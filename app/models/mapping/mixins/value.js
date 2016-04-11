import Ember from 'ember';
import Rule from '../rule';

export default Ember.Mixin.create({
  
  values: function() {
    return this.get('varCol.body')
      .filter( c => !Ember.isEmpty(c.get('value')) && this.get('varCol.incorrectCells').indexOf(c) === -1
        && !isNaN(c.postProcessedValue()))
      .map( c => c.postProcessedValue() );
  }.property('varCol'),
  
  generateRules() {
    
    if (!this.get('rules')) {
      let ruleMap = this.get('varCol.body')
        .filter( c => this.get('varCol.incorrectCells').indexOf(c) !== -1 )
        .reduce( (m, c) => {
          let val = !Ember.isEmpty(c.get('value')) ? c.get('value') : Rule.EMPTY_VALUE;
          if (!m.has(val)) {
            m.set(val, Rule.create({cells: Em.A([c]), label: val, visible: true, color: "#CCCCCC"}));
          } else {
            m.get(val).get('cells').addObject(c);
          }
          return m;
        }, new Map());
      this.set("rules", [...ruleMap.values()]);
    }
  },
  
  intervals: function() {
    return this.get('scale').getIntervals(this.get('values'));
  }.property('values.[]', 'scale._defferedChangeIndicator'),
  
  getScaleOf(type) {
    
    const NONE = {fn: function() {}};
    NONE.fn.url = () => "none";
    
    let ext = d3.extent(this.get('values')),
        intervals = this.get('intervals'),
        range;
        
    if (this.get('visualization.pattern')) {
      
      if (type === "texture") {
        range = this.get('patternModifiers');
      } else if (type === "color") {
        range = Array.from({length: intervals.length+1}, () => this.get('visualization.patternColor'));
      }
      
    } else if (this.get('visualization.colors')) {
      
      if (type === "texture") {
        range = Array.from({length: intervals.length+1}, () => NONE);
      } else if (type === "color") {
        range = this.get('colorSet');
      }
      
    }
    
    return d3.scale.threshold()
      .domain(intervals)
      .range(range);
      
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
