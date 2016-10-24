import Ember from 'ember';
import Filter from './filter';

let RangeFilter = Filter.extend({

  range: null,

  varColChange: function() {
    if (this.get('varCol') && !this.get('range')) {
      this.set('range', d3.extent(this.get('varCol.body'), d => d.get('cell.postProcessedValue')));
    }
  }.observes('varCol').on("init"),

  run(row) {

  },

  export(props) {
    return this._super(Object.assign({
    }, props))
  }
  
});

Filter.reopenClass({
  
  restore(json, refs = {}) {
    return this._super(json, refs, {
    });
  }
});

export default Filter;
