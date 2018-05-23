import Ember from 'ember';
import AbstractMapping from './abstract-mapping';
import Mapping from './mapping';
import ValueMixins from './mixins/value';
import { QuantiValSymQuantiValSurf } from "./mixins/multi";

let MultiMapping = AbstractMapping.extend({
  
  mappings: null,
  isMulti: true,
  
  init() {
    this._super();
    !this.get('mappings') && this.set('mappings', []);
  },

  titleComputed: function() {
    return this.get('title') || this.get('mappings').map( m => m.get('titleComputed') ).join(" - ");
  }.property('title', 'varCol.header.value'),

  isBoundToVar: function() {
    return this.get('mappings').every( m => m.get('isBoundToVar') );
  }.property('mappings.@each.isBoundToVar'),

  isFinalized: function() {
    return this.get('mappings').every( m => m.get('isFinalized') );
  }.property('mappings.@each.isFinalized'),

  master: function() {
    return (this.get('mappings.length') && this.get('mappings')[0]) || null;
  }.property('mappings.[]'),

  filteredBody: function() {
    return this.get('master.filteredBody');
  }.property('master.filteredBody'),
  
  configure: function() {
    switch (this.get('type')) {
      case "quanti.val_symboles.combined.quanti.val_surfaces":
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
        }
        this.reopen(QuantiValSymQuantiValSurf);
        break;
      default:
        break;
    }

    this.finalize();

  }.observes('type').on("init"),

  finalize() {
    this.get('mappings').forEach( m => m.finalize() );
  },
  
  delegateStyleMode(cell, mode) {
    throw new Error("not implemented");
  },

  fn() {
    let rules = this.get('master.rules'),
        ruleForCell = new Map();
    
    return (cell, mode) => {
      
      if (!ruleForCell.has(cell)) {
        ruleForCell.set(cell, rules ? rules.find( r => r.get('cells').indexOf(cell) !== -1 ) : false);
      }
      
      let rule = ruleForCell.get(cell);

      if (rule) {
        return this.ruleFn(rule, mode);
      } else {
        return this.delegateStyleMode(cell, mode);
      }
      
    }
  },

  deferredChange: Ember.debouncedObserver(
    'type', 'titleComputed',
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
