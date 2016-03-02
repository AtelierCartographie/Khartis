import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
/* global Em */

let GraphLayer = Struct.extend({
  
  type: null,
  
  varCol: null,
  
  export() {
    return this._super({
        type: this.get('type'),
        varCol: this.get('varCol') ? this.get('varCol._uuid') : null
    });
  }

});

GraphLayer.reopenClass({
  
    restore(json, refs = {}) {
        let o = this._super(json, refs);
        o.setProperties({
            type: json.type,
            varCol: json.varCol ? refs[json.varCol] : null
        });
        return o;
    }
    
});

export default GraphLayer;
