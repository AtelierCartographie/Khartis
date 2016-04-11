import Ember from 'ember';
import Struct from '../struct';
import {CellStruct} from '../data';


let Rule = Struct.extend({
  
  cells: null,
  label: null,
  color: "#CCCCCC",
  visible: true,
  
  emptyValue: function() {
    return this.get('label') === Rule.EMPTY_VALUE;
  }.property('label'),
  
  export(props) {
    return this._super(Object.assign({
      cells: this.get('cells') ? this.get('cells').map( c => c._uuid ) : null,
      label: this.get('label'),
      color: this.get('color'),
      visible: this.get('visible')
    }, props))
  }
  
});

Rule.reopenClass({
  
  EMPTY_VALUE: "no_value",
  
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      cells: json.cells ? json.cells.map( cId => refs[cId] ) : null,
      label: json.label,
      color: json.color,
      visible: json.visible
    });
    return o;
  }
});

export default Rule;
