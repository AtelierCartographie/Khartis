import Ember from 'ember';
import Struct from '../struct';
import VisualizationFactory from './visualization/factory';
import Scale from './scale/scale';
import ValueMixin from './mixins/value';

let Mapping = Struct.extend({
  
  type: null,
  
  scale: null,
  visualization: null,
  
  varCol: null,
  geoCols: null,
  
  canBeSurface: function() {
    return this.get('geoCols').length === 1
      && this.get('geoCols')[0].get('meta.type') === "geo";
  }.property('geoCols.[]'),
  
  canBeMappedAsValue: function() {
    return this.get('varCol.meta.type') === "numeric";
  }.property('varCol._defferedChangeIndicator'),
  
  init() {
    this._super();
    this.set('scale', Scale.create());
  },
  
  configure: function() {
    switch (this.get('type')) {
      case "quali.cat_surfaces":
        throw new Error(`Implementation is missing`);
      case "quali.cat_symboles":
        throw new Error(`Implementation is missing`);
      case "quali.ordre_symboles":
        throw new Error(`Implementation is missing`);
      case "quali.taille_valeur":
        throw new Error(`Implementation is missing`);
      case "quanti.val_surfaces":
        this.set('visualization', VisualizationFactory.createInstance("surface"));
        this.reopen(ValueMixin);
        break;
      case "quanti.val_symboles":
        this.set('visualization', VisualizationFactory.createInstance("symbol"));
        this.reopen(ValueMixin);
        break;
      default:
        this.set('visualization', null);
        break;
    }
  }.observes('type').on("init"),
  
  deferredChange: Ember.debouncedObserver(
    'varCol._defferedChangeIndicator', 'geoCols.@each._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    100),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      scale: this.get('scale') ? this.get('scale').export() : null,
      visualization: this.get('visualization') ? this.get('visualization').export() : null,
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
      geoCols: this.get('geoCols') ? this.get('geoCols').map(gc => gc.get('_uuid')) : null
    }, props));
  }
  
});

Mapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      type: json.type,
      scale: json.scale != null ? Scale.restore(json.scale, refs) : null,
      visualization: json.visualization != null ? VisualizationFactory.restoreInstance(json.visualization, refs) : null,
      varCol: json.varCol ? refs[json.varCol] : null,
      geoCols: json.geoCols ? json.geoCols.map( gc => refs[gc] ) : null
    });
  }
  
});

export default Mapping;
