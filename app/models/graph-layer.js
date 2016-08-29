import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
import Mapping from './mapping/mapping';
/* global Em */

let GraphLayer = Struct.extend({
  
  mapping: null,
  visible: true,
  opacity: 1,

  legendTitle: null,
  
  legendTitleComputed: function() {
    return this.get('legendTitle') ? this.get('legendTitle') : this.get('mapping.varCol.header.value');
  }.property('legendTitle', 'mapping.varCol.header.value'),
  
  displayable: function() {
    return this.get('visible') && this.get('mapping')
    && this.get('mapping.type') && this.get('mapping.varCol');
  }.property('mapping', 'mapping.type', 'visible'),
  
  deferredChange: Ember.debouncedObserver(
    'mapping', 'mapping._defferedChangeIndicator',
    'visible', 'opacity', 'legendTitle',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export() {
    return this._super({
        visible: this.get('visible'),
        mapping: this.get('mapping') != null ? this.get('mapping').export() : null,
        opacity: this.get('opacity'),
        legendTitle: this.get('legendTitle')
    });
  }

});

GraphLayer.reopenClass({
  
  restore(json, refs = {}) {
      return this._super(json, refs, {
        visible: json.visible,
        mapping: Mapping.restore(json.mapping, refs),
        opacity: json.opacity,
        legendTitle: json.legendTitle
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
