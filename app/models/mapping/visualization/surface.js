import Struct from 'khartis/models/struct';

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

  resetToDefaults(categorical=false) {
    this.setProperties({
      colors: categorical ? DEFAULT_COLORS_CATEGORICAL:DEFAULT_COLORS_SEQUENTIAL
    });
  },

  deferredChange: Ember.debouncedObserver(
    'colors', 'stroke', 'pattern', 'patternColor',
    'patternColorBefore', 'reverse',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      pattern: this.get('pattern'),
      colors: this.get('colors'),
      stroke: this.get('stroke'),
      reverse: this.get('reverse'),
      patternColor: this.get('patternColor'),
      patternColorBefore: this.get('patternColorBefore')
    }, props));
  }
  
});

SurfaceVisualization.reopenClass({
  restore(json, refs = {}) {
    return this._super(json, refs, {
      type: json.type,
      pattern: json.pattern,
      colors: json.colors,
      stroke: json.stroke,
      reverse: json.reverse,
      patternColor: json.patternColor,
      patternColorBefore: json.patternColorBefore
    });
  }
});

export default SurfaceVisualization;
