import Ember from 'ember';
import Struct from '../../struct';
import RangeFilter from './filter';

let Filter = Struct.extend({

  varCol: null,

  run(cell) {
    throw new Error(`Filter run method not implemented`);
  },

  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null
    }, props))
  }
  
});

Filter.reopenClass({
  
  restore(json, refs = {}) {
    if (json.type === "range") {
      return RangeFilter.restore(json, refs);
    }
    throw new Error(`Unable to restore filter with type ${json.type}`);
  }
});

export default Filter;
