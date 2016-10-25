import Struct from 'mapp/models/struct';

let SurfaceVisualization = Struct.extend({
  
  type: "surface",
  pattern: null,
  colors: "BuGn",
  stroke: 2,
  reverse: false,
  patternColor: null,
  patternColorBefore: null,

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
