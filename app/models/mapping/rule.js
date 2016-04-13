import Ember from 'ember';
import Struct from '../struct';
import {CellStruct} from '../data';


let Rule = Struct.extend({
  
  cells: null,
  label: null,
  color: "#CCCCCC",
  pattern: null,
  visible: true,
  shape: "line",
  
  emptyValue: function() {
    return this.get('label') === Rule.EMPTY_VALUE;
  }.property('label'),
  
  qty: function() {
    return this.get('cells').length;
  }.property('cells.[]'),
  
  deferredChange: Ember.debouncedObserver(
    'color', 'visible', 'pattern',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export(props) {
    return this._super(Object.assign({
      cells: this.get('cells') ? this.get('cells').map( c => c._uuid ) : null,
      label: this.get('label'),
      color: this.get('color'),
      pattern: this.get('pattern'),
      visible: this.get('visible'),
      shape: this.get('shape')
    }, props))
  }
  
});

Rule.reopenClass({
  
  EMPTY_VALUE: "no_value",
  
  restore(json, refs = {}) {
    return this._super(json, refs, {
      cells: json.cells ? json.cells.map( cId => refs[cId] ) : null,
      label: json.label,
      color: json.color,
      pattern: json.pattern,
      visible: json.visible,
      shape: json.shape
    });
  }
});

export default Rule;
