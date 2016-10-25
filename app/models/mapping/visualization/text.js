import Struct from 'mapp/models/struct';

let TextVisualization = Struct.extend({
  
  type: "text",
  color: "#404040",
  size: 1,
  anchor: "middle",

  deferredChange: Ember.debouncedObserver(
    'color', 'anchor', 'size',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      color: this.get('color'),
      anchor: this.get('anchor'),
      size: this.get('size')
    }, props));
  }
  
});

TextVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      color: json.color,
      anchor: json.anchor,
      size: json.size
    });
    return o;
  }
});

export default TextVisualization;
