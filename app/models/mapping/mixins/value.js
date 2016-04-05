import Ember from 'ember';

export default Ember.Mixin.create({
  
  values: function() {
    return this.get('varCol.body')
      .filter( c => !Ember.isEmpty(c.get('value')) && this.get('varCol.incorrectCells').indexOf(c) === -1)
      .map( c => c.postProcessedValue() );
  }.property('varCol'),
  
  intervals: function() {
    return this.get('scale').getIntervals(this.get('values'));
  }.property('values', 'scale'),
  
  distribution: function() {
      
    return this.get('values').reduce( (dist, v) => {
      if (!dist.has(v)) {
        dist.set(v, {val: v, qty: 1});
      } else {
        dist.get(v).qty += 1;
      }
      return dist;
    }, new Map());
      
  }.property('values.[]'),
  
});
