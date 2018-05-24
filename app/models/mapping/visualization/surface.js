import Struct from 'khartis/models/struct';
import Pattern from '../pattern';

const DEFAULT_COLORS_SEQUENTIAL = "BuGn";
const DEFAULT_COLORS_CATEGORICAL = "schemeAccent";

let SurfaceVisualization = Struct.extend({
  
  type: "surface",
  pattern: null,
  colors: DEFAULT_COLORS_SEQUENTIAL,
  stroke: 2,
  reverse: false,
  patternColor: null,
  patternColorBefore: null,
  opacity: 1,

  mainType: function() {
    return this.get('type').split(".")[0];
  }.property('type'),

  resetToDefaults(categorical=false) {
    this.setProperties({
      colors: categorical ? DEFAULT_COLORS_CATEGORICAL:DEFAULT_COLORS_SEQUENTIAL
    });
  },

  deferredChange: Ember.debouncedObserver(
    'colors', 'stroke', 'pattern', 'pattern.stroke', 'patternColor',
    'patternColorBefore', 'reverse', 'opacity',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      pattern: (this.get('pattern') && this.get('pattern').export()) || null,
      colors: this.get('colors'),
      stroke: this.get('stroke'),
      reverse: this.get('reverse'),
      patternColor: this.get('patternColor'),
      patternColorBefore: this.get('patternColorBefore'),
      opacity: this.get('opacity')
    }, props));
  }
  
});

SurfaceVisualization.reopenClass({
  restore(json, refs = {}) {
    return this._super(json, refs, {
      type: json.type,
      pattern: (json.pattern && Pattern.restore(json.pattern, refs)) || null,
      colors: json.colors,
      stroke: json.stroke,
      reverse: json.reverse,
      patternColor: json.patternColor,
      patternColorBefore: json.patternColorBefore,
      opacity: json.opacity
    });
  }
});

export default SurfaceVisualization;
