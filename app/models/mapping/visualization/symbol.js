import Struct from 'khartis/models/struct';
import config from 'khartis/config/environment';

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  color: "red",
  colorBeforeBreak: "blue",
  shape: "circle",
  strokeColor: "#404040",
  stroke: 1,
  maxSize: 10,
  barWidth: 16,

  absoluteMinSize: function() {
    return config.symbolMinMaxSize;
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
    'maxSize', 'shape', 'barWidth',
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
      maxSize: this.get('maxSize'),
      colorBeforeBreak: this.get('colorBeforeBreak'),
      barWidth: this.get('barWidth')
    }, props));
  }
  
});

SymbolVisualization.reopenClass({
  restore(json, refs = {}) {
    return this._super(json, refs, {
      type: json.type,
      color: json.color,
      shape: json.shape,
      strokeColor: json.strokeColor,
      stroke: json.stroke,
      maxSize: json.maxSize,
      colorBeforeBreak: json.colorBeforeBreak,
      barWidth: json.barWidth
    });
  }
});

export default SymbolVisualization;
