import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';
import GraphLayout from './graph-layout';
import GraphLayer from './graph-layer';
import GeoDef from './geo-def';
import StyleText from './style-text';
/* global Em */

const CURRENT_VERSION = 3.3;
const VERSION_LZ_STRING= 3.0;
const VERSION_LEGEND_2 = 3.1;
const VERSION_LABELLING_2 = 3.2;
const VERSION_WITH_STYLE_TEXT = 3.3;

const DEFAULT_TITLE_SIZE = 26;

let Project = Struct.extend({

    version: CURRENT_VERSION,
    date: new Date(),
    thumbnail: null,
  
    data: null,
    
    graphLayout: null,
    
    graphLayers: null,

    labellingLayers: null,
    
    geoDef: null,
    
    title: "",
    dataSource: null,
    author: null,
    comment: null,
    titleStyle: null,
    dataSourceStyle: null,
    authorStyle: null,
    commentStyle: null,

    report: null,

    blindnessMode: null,

    hasLabelling: function() {
      return this.get('labellingLayers') && this.get('labellingLayers').length > 0
       && this.get('labellingLayers').some( ll => ll.get('displayable') );
    }.property('labellingLayers.[]', 'labellingLayers.@each.displayable'),
    
    init() {
      this._super();
      if (!this.get('graphLayout')) {
        this.set('graphLayout', GraphLayout.createDefault());
      }
      this.set('graphLayers', Em.A());
      this.set('labellingLayers', Em.A());
      !this.get('titleStyle') && this.set('titleStyle', StyleText.create({size: DEFAULT_TITLE_SIZE}));
      !this.get('dataSourceStyle') && this.set('dataSourceStyle', StyleText.create({size: 10, anchor: "end"}));
      !this.get('authorStyle') && this.set('authorStyle', StyleText.create({size: 10}));
      !this.get('commentStyle') && this.set('commentStyle', StyleText.create());
    },
    
    importRawData(data) {
      this.set('graphLayers', Em.A());
      this.set('labellingLayers', Em.A());
      this.set('geoDef', null);
      this.set('data', DataStruct.createFromRawData(data));
      this.set('report', this.get('data').analyse());
    },
    
    export() {
      if (this.get('version') < 3) this.set('version', CURRENT_VERSION);
      return this._super({
        date: new Date(),
        version: this.get('version'),
        thumbnail: this.get('thumbnail'),
        data: this.get('data') ? LZString.compressToBase64(JSON.stringify(this.get('data').export())) : null,
        graphLayout: LZString.compressToBase64(JSON.stringify(this.get('graphLayout').export())),
        graphLayers: LZString.compressToBase64(JSON.stringify(this.get('graphLayers').map( gl => gl.export() ))),
        labellingLayers: this.get('labellingLayers').map( gl => gl.export() ),
        geoDef: this.get('geoDef') ? this.get('geoDef').export() : null,
        title: this.get('title'),
        dataSource: this.get('dataSource'),
        author: this.get('author'),
        titleStyle: this.get('titleStyle').export(),
        dataSourceStyle: this.get('dataSourceStyle').export(),
        authorStyle: this.get('authorStyle').export(),
        commentStyle: this.get('commentStyle').export(),
        comment: this.get('comment'),
        blindnessMode: this.get('blindnessMode'),
        report: this.get('report')
      });
    }
    
});

Project.reopenClass({
  
    createEmpty() {
      return Project.create({
        data: DataStruct.createFromRawData([])
      })
    },
    
    restore(json, refs = {}) {
      json = this.backwardCompatibility(json);
      let o = this._super(json, refs, {
        date: json.date,
        version: json.version,
        thumbnail: json.thumbnail,
        title: json.title,
        dataSource: json.dataSource,
        author: json.author,
        comment: json.comment,
        titleStyle: StyleText.restore(json.titleStyle, refs),
        dataSourceStyle: StyleText.restore(json.dataSourceStyle, refs),
        authorStyle: StyleText.restore(json.authorStyle, refs),
        commentStyle: StyleText.restore(json.commentStyle, refs),
        blindnessMode: json.blindnessMode,
        graphLayout: GraphLayout.restore(json.graphLayout, refs)
      });
      return new Promise( (res, rej) => {
        if (o.get('graphLayout.basemap')) {
          o.get('graphLayout.basemap').loadDictionaryData()
            .then( () => {
              res(o);
            });
        } else {
          res(o);
        }
      }).then( (o) => {
        o.setProperties({
          data: DataStruct.restore(json.data, refs),
          graphLayers: json.graphLayers.map( gl => GraphLayer.restore(gl, refs) ),
          labellingLayers: json.labellingLayers.map( gl => GraphLayer.restore(gl, refs) ),
          geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null,
          report: json.report
        });
        o.get('graphLayout').restoreLegend(json.graphLayout, refs);
        return o;
      });
    },

    backwardCompatibility(json) {
      let ret = Object.assign({}, json);
      !ret.version && (ret.version = 2);
      if (ret.version >= VERSION_LZ_STRING) {
        ret.data = (ret.data && JSON.parse(LZString.decompressFromBase64(ret.data))) || null;
        ret.graphLayout = JSON.parse(LZString.decompressFromBase64(ret.graphLayout));
        ret.graphLayers = JSON.parse(LZString.decompressFromBase64(ret.graphLayers));
      }

      if (ret.version < VERSION_LEGEND_2) {
        ret.graphLayout.legendLayout = {
          groups: Em.A([{
            layers: ret.graphLayers.map( gl => gl._uuid ),
            tx: ret.graphLayout.legendTx,
            ty: ret.graphLayout.legendTy
          }]),
          stacking: "horizontal",
          opacity: ret.graphLayout.legendOpacity
        }
      }
      if (ret.version <= VERSION_LABELLING_2) {
        ret.labellingLayers = ret.labellingLayers.map( ll => {
          if (ll.mapping.visualization.overwrites) {
            Object.keys(ll.mapping.visualization.overwrites).forEach( k => {
              if (ll.mapping.visualization.overwrites[k].type) {
                ll.mapping.visualization.overwrites[k] = {
                  dx: 0,
                  dy: 0,
                  __dCoords: ll.mapping.visualization.overwrites[k].coordinates
                };
              }
            });
          }
          return ll;
        });
      }
      if (ret.version < VERSION_WITH_STYLE_TEXT) {
        ret.labellingLayers = ret.labellingLayers.map(ll => {
          if (!ll.mapping.visualization.style) {
            ll.mapping.visualization.style = StyleText.create({
              color: ll.mapping.visualization.color,
              size: ll.mapping.visualization.size
            }).export();
          }
          return ll; 
        });
      }

      return ret;
    }
    
});

export default Project;
