import Struct from 'mapp/models/struct';

let SurfaceVisualization = Struct.extend({
  
  type: "surface",
  pattern: null,
  patternColor: "grey",
  colors: "BuGn",
  stroke: 2,
  reverse: false,
  
  deferredChange: Ember.debouncedObserver(
    'colors', 'stroke', 'pattern', 'patternColor',
    'reverse',
    function() {
      this.notifyDefferedChange();
    },
    10),
    
  patternChange: function() {
    if (this.get('pattern') != null) {
      this.set('colors', null);
    }
  }.observes('pattern'),
  
  colorsChange: function() {
    if (this.get('colors') != null) {
      this.set('pattern', null);
    }
  }.observes('colors'),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      pattern: this.get('pattern'),
      patternColor: this.get('patternColor'),
      colors: this.get('colors'),
      stroke: this.get('stroke'),
      reverse: this.get('reverse')
    }, props));
  }
  
});

SurfaceVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      pattern: json.pattern,
      patternColor: json.patternColor,
      colors: json.colors,
      stroke: json.stroke,
      reverse: json.reverse
    });
    return o;
  }
});

export default SurfaceVisualization;
