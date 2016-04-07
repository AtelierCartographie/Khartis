import Struct from 'mapp/models/struct';

let SurfaceVisualization = Struct.extend({
  
  type: "surface",
  pattern: "solid",
  colors: "BuGn",
  
  deferredChange: Ember.debouncedObserver(
    'colors', 'pattern',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      pattern: this.get('pattern'),
      colors: this.get('colors')
    }, props));
  }
  
});

SurfaceVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      type: json.type,
      pattern: json.pattern,
      colors: json.colors
    });
    return o;
  }
});

export default SurfaceVisualization;
