import Struct from 'mapp/models/struct';

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  color: "red",
  colorBeforeBreak: "blue",
  shape: "star",
  minSize: 4,
  maxSize: 12,
  
  colorStops(diverging) {
    if (diverging) {
      return [this.get('colorBeforeBreak'), this.get('color')];
    } else {
      return [this.get('color')];
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'type', 'color', 'minSize', 'maxSize', 'shape',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      color: this.get('color'),
      shape: this.get('shape'),
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
      minSize: json.minSize,
      maxSize: json.maxSize
    });
    return o;
  }
});

export default SymbolVisualization;
