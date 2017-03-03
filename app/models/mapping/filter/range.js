import Ember from 'ember';
import d3 from 'npm:d3';
import Filter from './abstract';

let RangeFilter = Filter.extend({

  range: null,

  deferredChange: Ember.debouncedObserver(
    'range', 'range.[]',
    function() {
      this.notifyDefferedChange();
    }, 1),

  varColChange: function() {
    if (this.get('varCol') && !this.get('range')) {
      this.set('range', d3.extent(this.get('varCol.body'), cell => cell.get('postProcessedValue')));
    }
  }.observes('varCol').on("init"),

  domain: function() {
    if (this.get('varCol')) {
      return d3.extent(this.get('varCol.body'), cell => cell.get('postProcessedValue'));
    }
    return [0, 0];
  }.property('varCol'),

  min: function() {
    return this.get('domain')[0];
  }.property('domain.[]'),

  max: function() {
    return this.get('domain')[1];
  }.property('domain.[]'),

  filteredRows: function() {
    if (this.get('range') && this.get('varCol')) {
      let [min, max] = this.get('range');
      return this.get('varCol.body')
        .filter( 
          cell => cell.get('postProcessedValue') != null 
            && cell.get('postProcessedValue') >= min
            && cell.get('postProcessedValue') <= max
        )
        .map( cell => cell.get('row') );
    }
    return this.get('varCol.body').map( cell => cell.get('row') );
  }.property('range', 'range.[]', 'varCol'),

  run(cell) {
    return this.get('filteredRows').indexOf(cell.get('row')) !== -1;
  },

  export(props) {
    return this._super(Object.assign({
      range: this.get('range')
    }, props))
  }
  
});

RangeFilter.reopenClass({
  
  restore(json, refs = {}) {
    return this._super(json, refs, {
      range: json.range.slice()
    });
  }
});

export default RangeFilter;
