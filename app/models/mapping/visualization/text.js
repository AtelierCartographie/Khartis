import Struct from 'khartis/models/struct';
import StyleText from '../../style-text';

const DEFAUL_OVERWRITE = {
  dx: 0,
  dy: 0
};

let TextVisualization = Struct.extend({
  
  type: "text",
  style: null,
  overwrites: {},

  init() {
    this._super();
    !this.get('style') && this.set('style', StyleText.create({size: 12}));
  },

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
    'overwrites', 'style._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      style: this.get('style').export(),
      overwrites: this.get('overwrites')
    }, props));
  }
  
});

TextVisualization.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      type: json.type,
      style: StyleText.restore(json.style, refs),
      overwrites: Object.assign({}, json.overwrites)
    });
    return o;
  }
});

export default TextVisualization;
