import Ember from 'ember';
import AbstractMapping from './abstract-mapping';
import Mapping from './mapping';
import ValueMixins from './mixins/value';
import {
  QuantiValSymQuantiValSurf,
  QuantiValSymQualiCatSurf,
  QuantiValSymProportional
} from "./mixins/multi";

let MultiMapping = AbstractMapping.extend({
  
  mappings: null,
  isMulti: true,
  
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
        break;
      case "quanti.val_symboles.combined.proportional":
        if (["sideclipped", "superposed", "sidebyside"].indexOf(this.get('renderMode')) === -1) {
          this.set('renderMode', 'sideclipped');
        }
        this.set('mappings', [
          Mapping.create({
            type: "quanti.val_symboles",
            geoDef: this.get('geoDef')
          }),
          Mapping.create({
            type: "quanti.val_symboles",
            geoDef: this.get('geoDef')
          })
        ]);
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
    'geoDef._defferedChangeIndicator',
    'mappings.@each._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    25),
  
  export(props) {
    return this._super(Object.assign({
      isMulti: true,
      mappings: this.get('mappings').map( m => m.export() )
    }, props));
  }
  
});

MultiMapping.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      isMulti: json.isMulti,
      mappings: json.mappings ? json.mappings.map( m => Mapping.restore(m, refs) ) : null
    });
  }
  
});

export default MultiMapping;
