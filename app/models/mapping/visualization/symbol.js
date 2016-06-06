import Struct from 'mapp/models/struct';

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  color: "red",
  colorBeforeBreak: "blue",
  shape: "circle",
  strokeColor: "#404040",
  stroke: 2,
  minSize: 5,
  maxSize: 10,
  
  colorStops(diverging) {
    if (diverging) {
      return [this.get('colorBeforeBreak'), this.get('color')];
    } else {
      return [this.get('color')];
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'type', 'color', 'strokeColor', 'stroke', 'colorBeforeBreak', 'minSize',
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
      minSize: this.get('minSize'),
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
      minSize: json.minSize,
      maxSize: json.maxSize
    });
    return o;
  }
});

export default SymbolVisualization;
