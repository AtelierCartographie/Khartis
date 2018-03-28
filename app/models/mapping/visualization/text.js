import Struct from 'khartis/models/struct';

const DEFAUL_OVERWRITE = {
  dx: 0,
  dy: 0
};

let TextVisualization = Struct.extend({
  
  type: "text",
  color: "#404040",
  size: 1,
  anchor: "start",
  overwrites: {},

  mainType: function() {
    return this.get('type').split(".")[0];
  }.property('type'),

  setOverwrite(id, ov) {
    this.get('overwrites')[id] = ov;
    this.notifyPropertyChange('overwrites');
  },

  getOverwrite(id) {
    return this.get('overwrites')[id] || {...DEFAUL_OVERWRITE};
  },

  mergeOverwrite(id, ov) {
    !this.get('overwrites')[id] && (this.get('overwrites')[id] = {});
    Object.assign(this.get('overwrites')[id], ov);
    this.notifyPropertyChange('overwrites');
  },

  deferredChange: Ember.debouncedObserver(
    'color', 'anchor', 'size', 'overwrites',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      color: this.get('color'),
      anchor: this.get('anchor'),
      size: this.get('size'),
      overwrites: this.get('overwrites')
    }, props));
  }
  
});

TextVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      color: json.color,
      anchor: json.anchor,
      size: json.size,
      overwrites: Object.assign({}, json.overwrites)
    });
    return o;
  }
});

export default TextVisualization;
