import Struct from 'mapp/models/struct';

let TextVisualization = Struct.extend({
  
  type: "text",
  color: null,
  anchor: "middle",

  deferredChange: Ember.debouncedObserver(
    'color', 'anchor',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      color: this.get('color'),
      anchor: this.get('anchor')
    }, props));
  }
  
});

TextVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      color: json.color,
      anchor: json.anchor
    });
    return o;
  }
});

export default TextVisualization;
