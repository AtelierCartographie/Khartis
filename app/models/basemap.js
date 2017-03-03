import Ember from 'ember';
import d3 from 'npm:d3';
import Struct from './struct';
import Projection from './projection';
import config from 'khartis/config/environment';
import {matcher as geoMatcher} from 'khartis/utils/geo-matcher';
import ab2string from 'khartis/utils/ab2string';
import CSV from 'npm:csv-string';
import {csvHeaderToJs} from 'khartis/utils/csv-helpers';
import topojson from 'npm:topojson';

var Basemap = Struct.extend({
  
  id: null,

  /* transients */
  mapConfig: null,
  mapData: null,
  dictionaryData: null,
  availableProjections: null,
  /* ---------- */

  compositeProjection: function() {
    return this.get('mapConfig.sources').length > 1 || this.get('projectionProvided');
  }.property('mapConfig'),

  projectionProvided: function() {
    return this.get('mapConfig.sources').find( s => s.projection );
  }.property('mapConfig'),

  assumeProjection() {
    if (this.get('compositeProjection')) {
      return Projection.createComposite(
        this.get('mapConfig.sources').map( (s, idx) => Object.assign({}, s, {idx: idx+1}) )
      );
    } else {
      return this.get('availableProjections').find( p => p.id === (this.get('mapConfig.sources')[0].projection || config.projection.default) );
    }
  },

  idChange: function() {

    this.setProperties({
      mapConfig: null,
      mapData: null,
      dictionaryData: null
    });

    if (this.get('id') !== null) {
      this.set('mapConfig', config.maps.find( c => c.id === this.get('id') ));
    }

  }.observes('id').on("init"),

  setup() {
    return Promise.all([
      this.loadMapData(),
      this.loadDictionaryData(),
      this.loadProjections()
    ]);
  },

  loadMapData() {

    if (!this.get('mapData')) {
      
      let promises = this.get('mapConfig.sources').map( source => {
        
        return new Promise((res, rej) => {
          
          var xhr = new XMLHttpRequest();
          xhr.open('GET', `${config.rootURL}data/map/${source.source}`, true);

          xhr.onload = (e) => {
            
            if (e.target.status == 200) {
              res({source: source, topojson: e.target.response});
            }
            
          };

          xhr.send();
        
        });

      });

      return Promise.all(promises).then( sources => this.set('mapData', this.computeMapSources(sources) ));

    } else {
      return new Promise((res, rej) => res(this.get('mapData')) );
    }
    
  },

  computeMapSources(sources) {
    let parts = sources.map( (source, idx) => {
          let j = JSON.parse(source.topojson);
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
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${config.rootURL}data/dictionary/${this.get('mapConfig.dictionary.source')}`, true);

        xhr.onload = (e) => {
          
          if (e.target.status == 200) {
            res(geoMatcher.dic = this.set('dictionaryData', JSON.parse(e.target.responseText).map( x => Ember.Object.create(x))));
          }
          
        };

        xhr.send();
      } else {
        res(geoMatcher.dic = this.get('dictionaryData'));
      }
      
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
  
  deferredChange: Ember.debouncedObserver(
    'config', 'mapData', 'dictionaryData',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export() {
    return this._super({
      id: this.get('id')
    });
  }
  
});

Basemap.reopenClass({
  
  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
        id: json.id
      });
      return o;
  }
    
});

export default Basemap;
