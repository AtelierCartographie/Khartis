import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
import MappingFactory from './layer-mapping';
import {SurfaceMapping, ShapeMapping, TextMapping} from './layer-mapping';
/* global Em */

let GraphLayer = Struct.extend({
  
  varCol: null,
  geoCols: null,
  mapping: null,
  visible: true,
  
  _defferedChangeIndicator: null,
  
  mappedToSurface: function() {
    return this.get('mapping') instanceof SurfaceMapping;
  }.property('mapping'),
  
  mappedToShape: function() {
    return this.get('mapping') instanceof ShapeMapping;
  }.property('mapping'),
  
  mappedToText: function() {
    return this.get('mapping') instanceof TextMapping;
  }.property('mapping'),
  
  canBeSurface: function() {
    return this.get('geoCols').length === 1
      && this.get('geoCols')[0].get('meta.type') === "geo";
  }.property('geoCols.[]'),
  
  deferredChange: Ember.debouncedObserver(
    'mapping', 'mapping.scaleOf', 'mapping.pattern', 'mapping.shape',
    'mapping.labelCol', 'mapping.color', 'visible',
    function() {
      this.notifyPropertyChange('_defferedChangeIndicator');
    },
    100),
  
  scaleType() {
    return this.get('varCol.meta.type') === "numeric" ? "linear" : "ordinal";
  },
  
  export() {
    return this._super({
        visible: this.get('visible'),
        varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
        geoCols: this.get('geoCols') ? this.get('geoCols').map( gc => gc.get('_uuid') ) : null,
        mapping: this.get('mapping') != null ? this.get('mapping').export() : null
    });
  }

});

GraphLayer.reopenClass({
  
    restore(json, refs = {}) {
        let o = this._super(json, refs);
        o.setProperties({
            visible: json.visible,
            varCol: json.varCol ? refs[json.varCol] : null,
            geoCols: json.geoCols ? json.geoCols.map( gc => refs[gc] ) : null,
            mapping: MappingFactory.restoreInstance(json.mapping, refs)
        });
        return o;
    },
    
    createDefault(props) {
      let o = this.create(props);
      o.setProperties({
        mapping: MappingFactory.createInstance("shape")
      });
      return o;
    }
    
});

export default GraphLayer;
