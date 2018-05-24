import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
import Mapping from "./mapping/mapping";
import { MappingFactory } from './mapping/factory';
/* global Em */

let GraphLayer = Struct.extend({
  
  mapping: null,
  visible: true,

  displayable: function() {
    return this.get('visible') && this.get('mapping')
    && this.get('mapping.type')
    && this.get('mapping.isFinalized');
  }.property('mapping', 'mapping.isFinalized', 'visible'),

  deferredChange: Ember.debouncedObserver(
    'mapping', 'mapping._defferedChangeIndicator',
    'visible',
    function() {
      this.notifyDefferedChange();
    },
    20),
  
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
        mapping: MappingFactory(json.mapping, refs)
      });
  },
  
  createDefault(varCol, geoDef, props = {}) {
    let o = this.create(Object.assign({
      mapping: Mapping.create({
        varCol: varCol,
        geoDef: geoDef
      })
    }, props));
    return o;
  }
    
});

export default GraphLayer;
