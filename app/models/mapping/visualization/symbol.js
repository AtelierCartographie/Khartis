import Struct from 'mapp/models/struct';

let SymbolVisualization = Struct.extend({
  
  type: "symbol",
  colors: null,
  
  deferredChange: Ember.debouncedObserver(
    'type', 'colors',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      colors: this.get('colors')
    }, props));
  }
  
});

SymbolVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      type: json.type,
      colors: json.colors
    });
    return o;
  }
});

export default SymbolVisualization;
