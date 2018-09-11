import Ember from 'ember';
import GeoDef from '../geo-def';
import Struct from '../struct';

let AbstractMapping = Struct.extend({
  
  type: null,

  visualization: null,

  title: null,

  renderMode: "single",
  
  geoDef: null,

  _finalized: false,

  canBeSurface: function() {
    return this.get('geoDef.isGeoRef');
  }.property('geoDef.isGeoRef'),
  
  init() {
    this._super();
  },

  titleComputed: function() {
    return this.get('title');
  }.property('title'),

  isBoundToVar: function() {
    return false;
  }.property(),

  isFinalized: function() {
    return this.get('_finalized')
      && this.get('visualization') != null
      && this.get('isBoundToVar')
      && this.get('rules') != null;
  }.property('isBoundToVar', 'visualization', 'rules', '_finalized'),

  configure: function() {
    throw new Error("not implemented.");
  }.observes('type').on("init"),

  getScaleOf(type) {
    throw new Error("not implemented.");
  },

  postConfigure() { },

  fn() {
    throw new Error("not implemented");
  },

  ruleFn(rule, mode) {
    throw new Error("not implemented");
  },
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      renderMode: this.get('renderMode'),
      title: this.get('title'),
      legendMaxValuePrecision : this.get('legendMaxValuePrecision'),
      legendTitle: this.get('legendTitle'),
      legendOrientation: this.get('legendOrientation'),
      geoDef: this.get('geoDef') ? this.get('geoDef').export() : null
    }, props));
  }
  
});

AbstractMapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      ...opts,
      renderMode: json.renderMode || "single",
      type: json.type,
      title: json.title,
      legendMaxValuePrecision: json.legendMaxValuePrecision,
      legendTitle: json.legendTitle,
      legendOrientation: json.legendOrientation,
      geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null
    });
  }
  
});

export default AbstractMapping;