import Ember from 'ember';
import Struct from '../struct';
import GeoDef from '../geo-def';
import VisualizationFactory from './visualization/factory';
import Scale from './scale/scale';
import ValueMixins from './mixins/value';
import CategoryMixins from './mixins/category';
import LabellingMixins from './mixins/labelling';
import LegendMixin from './mixins/legend';
import Colorbrewer from 'khartis/utils/colorbrewer';
import Rule from './rule';
import FilterAbstract from './filter/abstract';
import FilterFactory from './filter/factory';
import PatternMaker from 'khartis/utils/pattern-maker';

let Mapping = Struct.extend(LegendMixin, {
  
  type: null,
  
  scale: null,
  visualization: null,
  
  varCol: null,
  geoDef: null,
  filter: null,
  
  rules: null,

  colorSet: null,
  
  canBeSurface: function() {
    return this.get('geoDef.isGeoRef');
  }.property('geoDef.isGeoRef'),
  
  canBeMappedAsValue: function() {
    return this.get('varCol.meta.type') === "numeric";
  }.property('varCol._defferedChangeIndicator'),
  
  init() {
    this._super();
    if (!this.get('scale')) {
      this.set('scale', Scale.create());
    }
  },

  filteredBody: function() {
    let geoDef = this.get('geoDef'),
        geoMapped = FilterAbstract.create({
          run(cell) {
            let geoCell = cell.get('row.cells').find( c => c.get('column') == geoDef.get('geo') );
            return geoCell && geoCell.get('postProcessedValue') !== false
          }
        });
    if (this.get('filter')) {
      return this.get('varCol.body').filter( cell => geoMapped.run(cell) && this.get('filter').run(cell) );
    } else {
      return this.get('varCol.body').filter( cell => geoMapped.run(cell) );
    }
  }.property('filter._defferedChangeIndicator', 'geoDef', 'varCol.body'),
  
  configure: function() {
    switch (this.get('type')) {
      case "quali.cat_surfaces":
        this.reopen(CategoryMixins.Data);
        this.reopen(CategoryMixins.Surface);
        break;
      case "quali.cat_symboles":
        this.reopen(CategoryMixins.Data);
        this.reopen(CategoryMixins.Symbol);
        break;
      case "quali.ordre_symbols":
        throw new Error(`Implementation is missing`);
      case "quali.taille_valeur":
        throw new Error(`Implementation is missing`);
      case "quanti.val_surfaces":
        this.reopen(ValueMixins.Data);
        this.reopen(ValueMixins.Surface);
        break;
      case "quanti.val_symboles":
        this.reopen(ValueMixins.Data);
        this.reopen(ValueMixins.Symbol);
        break;
      case "labelling":
        this.reopen(LabellingMixins.Visualization);
        break;
      default:
        this.set('visualization', null);
        break;
    }
    this.generateVisualization();
    this.generateRules();
    this.configureScale();
  }.observes('type').on("init"),
  
  getScaleOf(type) {
    throw new Error("not implemented. Should be overrided by mixin");
  },
  
  generateRules() {
  },
  
  generateVisualization() {
  },

  configureScale() {
  },

  usePattern: Ember.computed('visualization.pattern', {
    get() {
      return this.get('visualization.pattern') != null;
    },
    set(k, v) {
      if (v && this.get('visualization.pattern') === null) {

        let pattern = PatternMaker.Composer.build({
          angle: 0,
          stroke: 1,
          type: "lines"
        });
        this.set('visualization.pattern', pattern);

      } else if (!v && this.get('visualization.pattern') !== null) {
        this.set('visualization.pattern', null);
      }
      return v;
    }
  }),
  
  fn() {
    
    let self = this,
        rules = this.get('rules'),
        visualization = this.get('visualization'),
        ruleForCell = new Map();
    
    return function(cell, mode) {
      
      if (!ruleForCell.has(cell)) {
        ruleForCell.set(cell, rules ? rules.find( r => r.get('cells').indexOf(cell) !== -1 ) : false);
      }
      
      let rule = ruleForCell.get(cell);

      if (rule) {
        return self.ruleFn(rule, mode);
      } else {
        switch (mode) {
          case "texture":
            return self.getScaleOf("texture")(cell.get('postProcessedValue'));
          case "fill":
            return self.getScaleOf("color")(cell.get('postProcessedValue'));
          case "size":
            return self.getScaleOf("size")(cell.get('postProcessedValue'));
          case "shape":
            return visualization.get('shape');
          case "strokeColor":
            return visualization.get('strokeColor');
        }
      }
      
    }
  },

  ruleFn(rule, mode) {
    let visualization = this.get('visualization');

    if (mode === "fill") {
      return rule.get('visible') ? rule.color : "none";
    } else if (mode === "texture" && rule.get('pattern')) {
      return rule.get('visible') ? PatternMaker.Composer.build(rule.get('pattern')) : {fn: PatternMaker.NONE};
    } else if (mode === "texture" && !rule.get('pattern') && this.get('usePattern')) {
      return rule.get('visible') ? PatternMaker.Composer.build(visualization.get('pattern')) : {fn: PatternMaker.NONE};
    } else if (mode === "size") {
      return rule.get('size');
    } else if (mode === "shape") {
      return rule.get('visible') ? (rule.get('shape') ? rule.get('shape') : visualization.get('shape') ) : null;
    } else if (mode === "strokeColor") {
      return rule.get('visible') ? rule.get('strokeColor') : null;
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'type',
    'varCol._defferedChangeIndicator', 'geoDef._defferedChangeIndicator',
    'scale._defferedChangeIndicator', 'visualization._defferedChangeIndicator',
    'rules.@each._defferedChangeIndicator', 'colorSet',
    'filter._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    25),
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      scale: this.get('scale') ? this.get('scale').export() : null,
      visualization: this.get('visualization') ? this.get('visualization').export() : null,
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
      geoDef: this.get('geoDef') ? this.get('geoDef').export() : null,
      filter: this.get('filter') ? this.get('filter').export() : null,
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
      geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null,
      filter: json.filter ? FilterFactory.restoreInstance(json.filter, refs) : null,
      rules: json.rules ? json.rules.map( r => Rule.restore(r, refs) ) : null
    });
  }
  
});

export default Mapping;
