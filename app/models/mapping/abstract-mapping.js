import Ember from 'ember';
import GeoDef from '../geo-def';
import Struct from '../struct';

let AbstractMapping = Struct.extend({
  
  type: null,

  visualization: null,

  title: null,
  
  geoDef: null,

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
    return this.get('visualization') != null
      && this.get('isBoundToVar')
      && this.get('rules') != null;
  }.property('isBoundToVar', 'visualization', 'rules'),

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
      title: this.get('title'),
      geoDef: this.get('geoDef') ? this.get('geoDef').export() : null
    }, props));
  }
  
});

AbstractMapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      ...opts,
      type: json.type,
      title: json.title,
      geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null
    });
  }
  
});

export default AbstractMapping;