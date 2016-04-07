import Ember from 'ember';

export default Ember.Mixin.create({
  
  values: function() {
    return this.get('varCol.body')
      .filter( c => !Ember.isEmpty(c.get('value')) && this.get('varCol.incorrectCells').indexOf(c) === -1)
      .map( c => c.postProcessedValue() );
  }.property('varCol'),
  
  exceptions: null,
  
  generateExceptions() {
    let exceptions = this.get('varCol.body')
      .filter( c => c => !Ember.isEmpty(c.get('value')) || this.get('varCol.incorrectCells').indexOf(c) === 1 )
      .map( c => {
        return {cell: c, visible: true, color: "#CCCCCC"};
      })
    this.set("exceptions", exceptions);
  },
  
  intervals: function() {
    return this.get('scale').getIntervals(this.get('values'));
  }.property('values.[]', 'scale._defferedChangeIndicator'),
  
  getD3Scale() {
    
    let ext = d3.extent(this.get('values')),
        intervals = this.get('intervals').concat([ext[1]]);
    
    let s = d3.scale.threshold()
      .domain(intervals)
      .range(this.get('colorSet'));
      
    window.s = s;
    
    return s;
    
  },
  
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
