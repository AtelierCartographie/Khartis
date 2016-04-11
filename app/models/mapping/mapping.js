import Ember from 'ember';
import Struct from '../struct';
import VisualizationFactory from './visualization/factory';
import Scale from './scale/scale';
import ValueMixin from './mixins/value';
import CategorieMixin from './mixins/categorie';
import Colorbrewer from 'mapp/utils/colorbrewer';
import Rule from './rule';
import MaskPattern from 'mapp/utils/mask-pattern';

let Mapping = Struct.extend({
  
  type: null,
  
  scale: null,
  visualization: null,
  
  varCol: null,
  geoCols: null,
  
  rules: null,
  
  canBeSurface: function() {
    return this.get('geoCols').length === 1
      && this.get('geoCols')[0].get('meta.type') === "geo";
  }.property('geoCols.[]'),
  
  canBeMappedAsValue: function() {
    return this.get('varCol.meta.type') === "numeric";
  }.property('varCol._defferedChangeIndicator'),
  
  colorSet: function() {
    
    let name = this.get('visualization.colors'),
        master = this.get('scale.diverging') ? Colorbrewer.diverging : Colorbrewer.sequential;
    
    if (!name || !master[name]) {
      this.set('visualization.colors', name = Object.keys(master)[0]);
    }
    
    return master[name][this.get('scale.classes')];
    
  }.property('visualization.colors', 'scale.classes', 'scale.classesBeforeBreak', 'scale.diverging'),
  
  patternModifiers: function() {
    
    return Array.from({length: this.get('scale.classes')}, (v, i) => {
      let teta = i < this.get('scale.classesBeforeBreak') ? 90 : 0,
          stroke = i;
      return {
        teta: teta,
        stroke: stroke,
        fn: MaskPattern.lines({
          orientation: [ this.get('visualization.pattern.angle') + teta ],
          stroke: [ this.get('visualization.pattern.stroke') + stroke  ]
        })
      };
    });
    
  }.property('visualization.pattern', 'scale.classes',
  'scale.classesBeforeBreak', 'scale.diverging'),
  
  init() {
    this._super();
    this.set('scale', Scale.create());
  },
  
  generateRules() {},
  
  configure: function() {
    switch (this.get('type')) {
      case "quali.cat_surfaces":
        this.set('visualization', VisualizationFactory.createInstance("surface"));
        this.reopen(CategorieMixin);
        break;
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
    this.generateRules();
  }.observes('type').on("init"),
  
  getScaleOf(type) {
    throw new Error("not implemented. Should be overrided by mixin");
  },
  
  fn() {
    
    let colorScale = this.getScaleOf("color"),
        textureScale = this.getScaleOf("texture"),
        rules = this.get('rules'),
        visualization = this.get('visualization');
    
    return function(cell, mode) {
      
      let rule = rules ? rules.find( r => r.get('cells').indexOf(cell) !== -1 ) : false;
      if (rule) {
        if (mode === "fill" && rule.get('visible')) {
          return rule.color;
        } else {
          return "none";
        }
      } else {
        
          return mode === "texture" ? 
            textureScale(cell.postProcessedValue()).fn.url() 
            : colorScale(cell.postProcessedValue());
      }
      
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'varCol._defferedChangeIndicator', 'geoCols.@each._defferedChangeIndicator',
    'scale._defferedChangeIndicator', 'visualization._defferedChangeIndicator',
    'rules.@each._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      scale: this.get('scale') ? this.get('scale').export() : null,
      visualization: this.get('visualization') ? this.get('visualization').export() : null,
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
      geoCols: this.get('geoCols') ? this.get('geoCols').map(gc => gc.get('_uuid')) : null,
      rules: this.get('rules') ? this.get('rules').map( r => r.export() ) : null
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
      geoCols: json.geoCols ? json.geoCols.map( gc => refs[gc] ) : null,
      rules: json.rules ? json.rules.map( r => Rule.restore(r, refs) ) : null
    });
  }
  
});

export default Mapping;
