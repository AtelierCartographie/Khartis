import Ember from 'ember';
import Struct from '../../struct';

let Filter = Struct.extend({

  type: null,
  varCol: null,

  run(cell) {
    throw new Error(`Filter run method not implemented`);
  },

  deferredChange: Ember.debouncedObserver(
    'varCol',
    function() {
      this.notifyDefferedChange();
    },
    1),

  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      varCol: this.get('varCol') ? this.get('varCol._uuid') : null
    }, props))
  }
  
});

Filter.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, Object.assign({
      type: json.type,
      varCol: json.varCol ? refs[json.varCol] : null
    }, opts));
  }
});

export default Filter;
