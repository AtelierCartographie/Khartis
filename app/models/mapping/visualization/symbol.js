import Struct from 'mapp/models/struct';
import config from 'mapp/config/environment';

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  color: "red",
  colorBeforeBreak: "blue",
  shape: "circle",
  strokeColor: "#404040",
  stroke: 2,
  maxSize: 10,

  absoluteMinSize: function() {
    return config.symbolMaxMinSize;
  }.property(),

  absoluteMaxSize: function() {
    return config.symbolMaxMaxSize;
  }.property(),

  availableShapes: ["circle", "rect", "line", "star", "times"],
  
  colorStops(diverging) {
    if (diverging) {
      return [this.get('colorBeforeBreak'), this.get('color')];
    } else {
      return [this.get('color')];
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'type', 'color', 'strokeColor', 'stroke', 'colorBeforeBreak',
    'maxSize', 'shape',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      color: this.get('color'),
      shape: this.get('shape'),
      strokeColor: this.get('strokeColor'),
      stroke: this.get('stroke'),
      maxSize: this.get('maxSize')
    }, props));
  }
  
});

SymbolVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      color: json.color,
      shape: json.shape,
      strokeColor: json.strokeColor,
      stroke: json.stroke,
      maxSize: json.maxSize
    });
    return o;
  }
});

export default SymbolVisualization;
