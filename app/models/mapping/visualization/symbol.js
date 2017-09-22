import Struct from 'khartis/models/struct';
import config from 'khartis/config/environment';
import SymbolBrewer from 'khartis/utils/symbolbrewer';

const DEFAULT_UNORDERED_SHAPES = ["circle", "rect", "line", "star", "times"];

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  color: "red",
  colorBeforeBreak: "blue",
  shape: "circle",
  shapeSet: null,
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

  availableShapes: DEFAULT_UNORDERED_SHAPES,

  recomputeAvailableShapes(ordered, classes, palette=null) {
    if (!ordered) {
      this.set('availableShapes', DEFAULT_UNORDERED_SHAPES);
      this.set('shapeSet', null);
    } else {
      this.set('availableShapes', SymbolBrewer.Composer.compose(palette, classes));
      !this.get('shapeSet') && this.set('shapeSet', this.get('availableShapes')[0]);
    }
  },
  
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
      shapeSet: this.get('shapeSet'),
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
      shapeSet: json.shapeSet,
      strokeColor: json.strokeColor,
      stroke: json.stroke,
      maxSize: json.maxSize,
      colorBeforeBreak: json.colorBeforeBreak,
      barWidth: json.barWidth
    });
  }
});

export default SymbolVisualization;
