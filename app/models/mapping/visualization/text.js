import Struct from 'mapp/models/struct';

let TextVisualization = Struct.extend({
  
  type: "text",
  color: null,

  deferredChange: Ember.debouncedObserver(
    'color',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      color: this.get('color')
    }, props));
  }
  
});

TextVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      color: json.color
    });
    return o;
  }
});

export default TextVisualization;
