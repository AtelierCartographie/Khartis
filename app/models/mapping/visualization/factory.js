import Ember from 'ember';
import Struct from 'khartis/models/struct';
import SurfaceVisualization from './surface';
import SymbolVisualization from './symbol';
import TextVisualization from './text';

let VisualizationFactory = Ember.Object.extend({});
VisualizationFactory.reopenClass({
  
  classForType(type) {
    switch (type) {
      case "surface":
        return SurfaceVisualization;
      case "symbol":
        return SymbolVisualization;
      case "text":
        return TextVisualization;
    }
    throw new Error(`Unknow mapping type ${type}`);
  },
  
  createInstance(type, props = {}) {
    let o = this.classForType(type).create(props);
    o.set('type', type);
    return o;
  },
  
  restoreInstance(json, refs) {
    if (json != null) {
      let o = this.classForType(json.type).restore(json, refs);
      return o;
    } else {
      return null;
    }
  }
  
});

export default VisualizationFactory;
