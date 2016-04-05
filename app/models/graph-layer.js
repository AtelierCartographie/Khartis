import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
import Mapping from './mapping/mapping';
/* global Em */

let GraphLayer = Struct.extend({
  
  mapping: null,
  visible: true,
  
  deferredChange: Ember.debouncedObserver(
    'mapping', 'mapping._defferedChangeIndicator', 'visible',
    function() {
      this.notifyDefferedChange();
    },
    100),
  
  export() {
    return this._super({
        visible: this.get('visible'),
        mapping: this.get('mapping') != null ? this.get('mapping').export() : null
    });
  }

});

GraphLayer.reopenClass({
  
  restore(json, refs = {}) {
      return this._super(json, refs, {
        visible: json.visible,
        mapping: Mapping.restore(json.mapping, refs)
      });
  },
  
  createDefault(varCol, geoCols, props = {}) {
    let o = this.create(Object.assign({
      mapping: Mapping.create({
        varCol: varCol,
        geoCols: geoCols
      })
    }, props));
    return o;
  }
    
});

export default GraphLayer;
