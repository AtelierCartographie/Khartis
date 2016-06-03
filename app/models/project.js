import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';
import GraphLayout from './graph-layout';
import GraphLayer from './graph-layer';
import GeoDef from './geo-def';
/* global Em */

let Project = Struct.extend({
  
    data: null,
    
    graphLayout: null,
    
    graphLayers: null,
    
    geoDef: null,
    
    title: "Titre de la carte",
    
    //transient
    report: null,
    
    init() {
      this._super();
      if (!this.get('graphLayout')) {
        this.set('graphLayout', GraphLayout.createDefault());
      }
      this.set('graphLayers', Em.A());
    },
    
    importRawData(data) {
      this.set('data', DataStruct.createFromRawData(data));
      this.set('report', this.get('data').analyse());
    },
    
    removeLayerMappedToColumn(column) {
      let layers = this.get('graphLayers')
        .filter( gl => !(gl.get('geoDef.columns').indexOf(column) !== -1 || gl.get('varCol') == column) );
      this.set('graphLayers', layers);
    },
    
    export() {
      return this._super({
        data: this.get('data') ? this.get('data').export() : null,
        graphLayout: this.get('graphLayout').export(),
        graphLayers: this.get('graphLayers').map( gl => gl.export() ),
        geoDef: this.get('geoDef') ? this.get('geoDef').export() : null,
        title: this.get('title')
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
        let o = this._super(json, refs, {
          title: json.title,
          graphLayout: GraphLayout.restore(json.graphLayout, refs)
        });
        o.setProperties({
          data: DataStruct.restore(json.data, refs),
          graphLayers: json.graphLayers.map( gl => GraphLayer.restore(gl, refs) ),
          geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null
        });
        return o;
    }
    
});

export default Project;
