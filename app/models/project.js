import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';
import GraphLayout from './graph-layout';
import GraphLayer from './graph-layer';
/* global Em */

let Project = Struct.extend({
  
    data: null,
    
    graphLayout: GraphLayout.create(),
    
    graphLayers: null,
    
    geoColumns: null,
    
    report: null,
    
    init() {
      this._super();
      this.setProperties({
        'graphLayout': GraphLayout.create(),
        'geoColumns': Em.A(),
        'graphLayers': Em.A()
      });
    },
    
    importRawData(data) {
      this.set('data', DataStruct.createFromRawData(data));
      this.set('report', this.get('data').analyse());
    },
    
    removeLayerMappedToColumn(column) {
      let layers = this.get('graphLayers')
        .filter( gl => !(gl.get('geoCols').indexOf(column) !== -1 || gl.get('varCol') == column) );
      this.set('graphLayers', layers);
    },
    
    export() {
      return this._super({
        data: this.get('data') ? this.get('data').export() : null,
        graphLayout: this.get('graphLayout').export(),
        graphLayers: this.get('graphLayers').map( gl => gl.export() )
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
        let o = this._super(json, refs);
        o.setProperties({
            data: DataStruct.restore(json.data, refs),
            graphLayout: GraphLayout.restore(json.graphLayout, refs),
            graphLayers: json.graphLayers.map( gl => GraphLayer.restore(gl, refs) )
        });
        return o;
    }
    
});

export default Project;
