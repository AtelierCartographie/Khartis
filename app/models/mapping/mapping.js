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
import {RuleFactory} from './rule';
import FilterAbstract from './filter/abstract';
import FilterFactory from './filter/factory';
import PatternMaker from 'khartis/utils/pattern-maker';
import AbstractMapping from './abstract-mapping';

let Mapping = AbstractMapping.extend(LegendMixin, {
  
  scale: null,
  
  varCol: null,
  filter: null,
  
  rules: null,

  colorSet: null,

  ordered: false,

  rulesCache: null,
  
  canBeMappedAsValue: function() {
    return this.get('varCol.meta.type') === "numeric";
  }.property('varCol._defferedChangeIndicator'),

  isBoundToVar: function() {
    return this.get('varCol') != null;
  }.property('varCol'),

  init() {
    this._super();
    !this.get('scale') && this.set('scale', Scale.create());
  },

  titleComputed: function() {
    return this.get('varCol.header.value');
  }.property('varCol.header.value'),

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

  filteredRows: function() {
    return this.get('filteredBody').map(c => c.get('row'));
  }.property('filteredBody'),
  
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

    //check compatibility between type and variable
    if (ValueMixins.Data.detect(this) && !this.get('canBeMappedAsValue')) {
      this.set('varCol', null);
    }

    this.finalize();

  }.observes('type').on("init"),

  finalize() {
    if (this.get('varCol')) {
      this.configureScale();
      this.generateVisualization();
      this.generateRules();
      this.postConfigure();
    }
  },
  
  getScaleOf(type) {
    throw new Error("not implemented. Should be overriden by mixin");
  },
  
  generateRules() {
    this.set('rulesCache', new Map());
    this.get('rules').forEach( r => {
      r.get('cells').forEach(cell => this.get('rulesCache').set(cell, r));
    });
  },
  
  generateVisualization() {},

  configureScale() {},

  postConfigure() {
    this._super();
    this.set('_finalized', true); 
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
    
    const visualization = this.get('visualization');
    
    return (row, mode) => {
      
      const cell = row.get('cells')[this.get('varCol.idx')];
      const rule = this.ruleForCell(cell);

      if (rule) {
        return this.ruleFn(rule, mode);
      } else {
        switch (mode) {
          case "texture":
            return this.getScaleOf("texture")(cell.get('postProcessedValue'));
          case "fill":
            return this.getScaleOf("color")(cell.get('postProcessedValue'));
          case "size":
            return this.getScaleOf("size")(cell.get('postProcessedValue'));
          case "shape":
            return visualization.get('shape');
          case "strokeColor":
            return visualization.get('strokeColor');
          case "stroke":
            return visualization.get('stroke');
        }
      }
      
    }
  },

  ruleForCell(cell) {
    return this.get('rulesCache').get(cell);
  },

  ruleFn(rule, mode) {
    let visualization = this.get('visualization');

    if (mode === "fill") {
      return rule.get('visible') ? rule.get('color') : "none";
    } else if (mode === "texture" && rule.get('pattern')) {
      return rule.get('visible') ? PatternMaker.Composer.build(rule.get('pattern')) : {fn: PatternMaker.NONE};
    } else if (mode === "texture" && !rule.get('pattern') && this.get('usePattern')) {
      return rule.get('visible') ? PatternMaker.Composer.build(visualization.get('pattern')) : {fn: PatternMaker.NONE};
    } else if (mode === "size") {
      return rule.get('visible') ? rule.get('size') : 0;
    } else if (mode === "shape") {
      return rule.get('visible') ? rule.get('shape') : null;
    } else if (mode === "strokeColor") {
      return rule.get('visible') ? rule.get('strokeColor') : null;
    }
  },
  
  deferredChange: Ember.debouncedObserver(
    'type', 'renderMode', 'titleComputed', 'varCol',
    'varCol._defferedChangeIndicator', 'geoDef._defferedChangeIndicator',
    'scale._defferedChangeIndicator', 'visualization._defferedChangeIndicator',
    'rules.@each._defferedChangeIndicator', 'colorSet', 'ordered',
    'filter._defferedChangeIndicator', 'maxValuePrecision',
    'opacity', 'legendTitle', 'legendOrientation',
    function() {
      this.notifyDefferedChange();
    },
    20),
  
  export(props) {
    return this._super(Object.assign({
      scale: this.get('scale') ? this.get('scale').export() : null,
      visualization: this.get('visualization') ? this.get('visualization').export() : null,
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
      filter: this.get('filter') ? this.get('filter').export() : null,
      legendMaxValuePrecision : this.get('legendMaxValuePrecision'),
      legendTitle: this.get('legendTitle'),
      legendOrientation: this.get('legendOrientation'),
      ordered: this.get('ordered'),
      rules: this.get('rules') ? this.get('rules').map( r => r.export() ) : null
    }, props));
  }
  
});

Mapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      scale: json.scale != null ? Scale.restore(json.scale, refs) : null,
      visualization: json.visualization != null ? VisualizationFactory.restoreInstance(json.visualization, refs) : null,
      varCol: json.varCol ? refs[json.varCol] : null,
      filter: json.filter ? FilterFactory.restoreInstance(json.filter, refs) : null,
      legendMaxValuePrecision: json.legendMaxValuePrecision,
      legendTitle: json.legendTitle,
      legendOrientation: json.legendOrientation,
      ordered: json.ordered,
      rules: json.rules ? json.rules.map( r => RuleFactory(r, refs) ) : null
    });
  }
  
});

export default Mapping;
