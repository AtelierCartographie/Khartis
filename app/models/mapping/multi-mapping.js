import Ember from 'ember';
import AbstractMapping from './abstract-mapping';
import Mapping from './mapping';
import { DEFAULT_FILL_ALT } from "./visualization/symbol";
import {
  QuantiValSymQuantiValSurf,
  QuantiValSymQualiCatSurf,
  QuantiValSymProportional
} from "./mixins/multi";
import Scale from './scale/scale';

let MultiMapping = AbstractMapping.extend({
  
  mappings: null,
  isMulti: true,
  sharedDomain: false,
  sideBySideAlign: "middle", //top, bottom
  sideBySideMargin: "middle", //low, high
  
  init() {
    this._super();
    !this.get('mappings') && this.set('mappings', []);
  },

  titleComputed: function() {
    return this.get('title') || this.get('mappings').map( m => m.get('titleComputed') ).join(" - ");
  }.property('title', 'mappings.@each.titleComputed'),

  isBoundToVar: function() {
    return this.get('mappings').every( m => m.get('isBoundToVar') );
  }.property('mappings.@each.isBoundToVar'),

  isFinalized: function() {
    return this.get('mappings').every( m => m.get('isFinalized') );
  }.property('mappings.@each.isFinalized'),

  master: function() {
    return (this.get('mappings.length') && this.get('mappings')[0]) || null;
  }.property('mappings.[]'),

  slave: function() {
    return (this.get('mappings.length') > 1 && this.get('mappings')[1]) || null;
  }.property('mappings.[]'),

  filteredBody: function() {
    return this.get('master.filteredBody');
  }.property('master.filteredBody'),

  filteredRows: function() {
    return this.get('filteredBody').map(c => c.get('row'));
  }.property('filteredBody'),
  
  configure: function() {
    switch (this.get('type')) {
      case "quanti.val_symboles.combined.quanti.val_surfaces":
        this.set('renderMode', 'superposed');
        if (!this.get('mappings').length) {
          this.set('mappings', [
            Mapping.create({
              type: "quanti.val_symboles",
              geoDef: this.get('geoDef')
            }),
            Mapping.create({
              type: "quanti.val_surfaces",
              geoDef: this.get('geoDef')
            })
          ]);
        } else if (this.get('mappings').length === 1) {
          this.get('mappings').push(Mapping.create({
            type: "quanti.val_surfaces",
            geoDef: this.get('geoDef')
          }));
        }
        this.reopen(QuantiValSymQuantiValSurf);
        this.get('mappings').forEach( m => m.set('standalone', false) );
        break;
      case "quanti.val_symboles.combined.quali.cat_surfaces":
        this.set('renderMode', 'superposed');
        if (!this.get('mappings').length) {
          this.set('mappings', [
            Mapping.create({
              type: "quanti.val_symboles",
              geoDef: this.get('geoDef')
            }),
            Mapping.create({
              type: "quali.cat_surfaces",
              geoDef: this.get('geoDef')
            })
          ]);
        } else if (this.get('mappings').length === 1) {
          this.get('mappings').push(Mapping.create({
            type: "quali.cat_surfaces",
            geoDef: this.get('geoDef')
          }));
        }
        this.reopen(QuantiValSymQualiCatSurf);
        this.get('mappings').forEach( m => m.set('standalone', false) );
        break;
      case "quanti.val_symboles.combined.proportional":
        if (!this.get('scale')) {
          this.set('scale', Scale.create());
        }
        if (["sideclipped", "superposed", "sidebyside"].indexOf(this.get('renderMode')) === -1) {
          this.set('renderMode', 'sideclipped');
        }
        if (!this.get('mappings.length')) {
          this.set('mappings', [
            Mapping.create({
              type: "quanti.val_symboles.combined",
              geoDef: this.get('geoDef')
            }),
            Mapping.create({
              type: "quanti.val_symboles.combined",
              geoDef: this.get('geoDef')
            })
          ]);
        } else if (this.get('mappings').length === 1) {
          this.get('mappings').push(Mapping.create({
            type: "quanti.val_symboles.combined",
            geoDef: this.get('geoDef')
          }));
        }
        this.reopen(QuantiValSymProportional);
        break;
      default:
        break;
    }

    this.finalize();

  }.observes('type').on("init"),

  finalize() {
    this.get('mappings').forEach( m => m.finalize() );
  },

  delegateRuleMode(cell, mode) {
    throw new Error("not implemented");
  },
  
  delegateStyleMode(cell, mode) {
    throw new Error("not implemented");
  },

  fn() {
    return (row, mode) => {
      return this.delegateRuleMode(row, mode) || this.delegateStyleMode(row, mode);
    }
  },

  deferredChange: Ember.debouncedObserver(
    'type', 'titleComputed', 'renderMode',
    'sharedDomain', 'sideBySideAlign', 'sideBySideMargin', 'maxValuePrecision',
    'geoDef._defferedChangeIndicator', 'legendTitle', 'legendOrientation',
    'scale._defferedChangeIndicator',
    'mappings.@each._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    25
  ),
  
  export(props) {
    return this._super(Object.assign({
      isMulti: true,
      sharedDomain: this.get('sharedDomain'),
      sideBySideAlign: this.get('sideBySideAlign'),
      sideBySideMargin: this.get('sideBySideMargin'),
      mappings: this.get('mappings').map( m => m.export() )
    }, props));
  }
  
});

MultiMapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      isMulti: json.isMulti,
      sharedDomain: json.sharedDomain || false,
      sideBySideAlign: json.sideBySideAlign || "middle",
      sideBySideMargin: json.sideBySideMargin || "middle",
      mappings: json.mappings ? json.mappings.map( m => Mapping.restore(m, refs) ) : null
    });
  }
  
});

export default MultiMapping;
