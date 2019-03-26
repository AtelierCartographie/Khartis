import Ember from 'ember';
import Basemap from './basemap';
import d3 from 'npm:d3';
import Struct from './struct';
import Projection from './projection';
import config from 'khartis/config/environment';
import {matcher as geoMatcher} from 'khartis/utils/geo-matcher';
import {csvHeaderToJs} from 'khartis/utils/csv-helpers';
import ab2string from 'khartis/utils/ab2string';
import CSV from 'npm:csv-string';
import topojson from 'npm:topojson';

var ImportedBasemap = Basemap.extend({
  
  type: "imported",

  id: null,

  /* transients */
  mapConfig: null,
  mapData: null,
  dictionaryData: null,
  availableProjections: null,
  isCustom: true,
  /* ---------- */

  compositeProjection: function() {
    return true;
  }.property(),

  projectionProvided: function() {
    return true;
  }.property('mapConfig'),

  assumeProjection() {
    return Projection.createComposite(
      this.get('mapConfig.sources').map( (s, idx) => Object.assign({}, s, {idx: idx+1}) )
    );
  },

  idChange: function() {

  }.observes('id').on("init"),

  initialWkt: function() {
    return this.get('mapConfig.initialWkt');
  }.property('mapConfig.initialWkt'),

  currentWkt: function() {
    return this.get('mapConfig.sources')[0].wkt;
  }.property('mapConfig.sources.@each.wkt'),

  setup() {
    return Promise.all([
      this.loadMapData(),
      this.loadDictionaryData(),
      this.loadProjections()
    ]);
  },

  loadMapData() {
    if (!this.get('mapData')) {
        this.set('mapData', this.computeMapSources(this.get('mapConfig.sources')));
    }
    return new Promise((res, rej) => res(this.get('mapData')) );
  },

  computeMapSources(sources) {
    let parts = sources.map( (source, idx) => {
          let j = source.topojson;
          j.projection = idx+1;
          return j;
        });
      return parts.map(function(j) {
        let partition = j.objects.poly.geometries
              .reduce( (part, g) => {
                part[g.properties.square ? "left" : "right"].push(g);
                return part;
              }, {left: [], right: []});
        return {
          projection: j.projection,
          land: d3.geoStitch(topojson.merge(j, partition.right)),
          squares: topojson.mesh(j, {type: "GeometryCollection", geometries: partition.left}),
          lands: d3.geoStitch(topojson.feature(j, j.objects.poly)),
          backLands: j.objects['poly-down'] && topojson.feature(j, j.objects['poly-down']),
          borders: !j.objects.line ? [] : topojson.mesh(j, j.objects.line, function(a, b) {
              return !a.properties || a.properties.featurecla === "International";
            }),
          bordersDisputed: !j.objects.line ? [] : topojson.mesh(j, j.objects.line, function(a, b) { 
              return a.properties && a.properties.featurecla === "Disputed"; 
            }),
          linesUp: !j.objects['line-up'] ? [] : topojson.mesh(j, j.objects['line-up'], function(a, b) { 
              return !(a.properties && a.properties.featurecla === "Disputed"); 
          }),
          linesUpDisputed: !j.objects['line-up'] ? [] : topojson.mesh(j, j.objects['line-up'], function(a, b) { 
              return a.properties && a.properties.featurecla === "Disputed"; 
          }),
          centroids: topojson.feature(j, j.objects.centroid)
        };
    });
  },

  loadDictionaryData() {
    return new Promise( (res, rej) => {
      if (!this.get('dictionaryData')) {
        this.set('dictionaryData', this.get('mapConfig.dictionary.source'));
      }

      res(geoMatcher.dic = this.get('dictionaryData'));
    });
	},

  loadProjections: function() {
		
    return new Promise( (res, rej) => {
      
      if (!this.get('availableProjections')) {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${config.rootURL}data/Projection-list.csv`, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = (e) => {
          
        if (e.target.status == 200) {
          
          let data = CSV.parse(ab2string(e.target.response));
          data = data.map( r => {
            return r.map( c => c.trim() );
          });
          
          let headers = data[0],
              body = data.slice(1),
              projs = body.map( r => {
                let o = {};
                headers.forEach( (h,i) => o[csvHeaderToJs(h)] = r[i] );
                return Projection.create(o);
              });
          
          res(this.set('availableProjections', projs));
          
        }
        
      };

      xhr.send();

      } else {
        res(this.get('availableProjections'));
      }
      
    });
		 
  },
  
  overrideProjectionWkt(wkt) {
    let source = {
      ...this.get('mapConfig.sources')[0],
      wkt
    };
    this.set('mapConfig.sources', [source]);
  },
  
  deferredChange: Ember.debouncedObserver(
    'config', 'mapData', 'dictionaryData',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export() {
    return this._super({
      id: this.get('id'),
      type: this.get('type'),
      mapConfig: this.get('mapConfig')
    });
  }
  
});

ImportedBasemap.reopenClass({

  buildMapConfigs(tuples, dictIds) {
    return tuples.map( (tuple, i) => {
      let file = tuple.files[0];
      let json = JSON.parse(file.content);

      //normalize names
      let basename;
      Object.keys(json.objects).forEach( (k, i) => {
        let name;
        if (i === 0) {
          name = "poly";
          basename = k;
        } else {
          name = k.replace(basename+"::", "");
        }
        json.objects[name] = json.objects[k];
        json.objects[k] = undefined;
      });

      return {
        id: file.filename,
        custom: true,
        attribution: "",
        sources: [
          {topojson: json, projection: "wkt", wkt: tuple.proj4Wkt}
        ],
        dictionary: {
          source: tuple.dict,
          identifier: dictIds[i]
        },
        initialWkt: tuple.proj4Wkt,
        _debug_simplify: tuple.simplifyPct
      }
    });
  },

  checkValidity(mapConfig) {
    let basemap = ImportedBasemap.create({mapConfig});
    return basemap.loadMapData().then( data => {
      return basemap.assumeProjection().projector().checkValidity(data);
    });
  },
  
  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
        id: json.id,
        type: json.type,
        mapConfig: json.mapConfig
      });
      return o;
  }
    
});

export default ImportedBasemap;
