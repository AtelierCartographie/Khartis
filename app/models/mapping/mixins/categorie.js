import Ember from 'ember';
import Rule from '../rule';

export default Ember.Mixin.create({
  
  defaultColorScale: d3.scale.category10(), 
  
  generateRules() {
    
    if (!this.get('rules')) {
      
      let scale = (index) => {
        return index < this.get('defaultColorScale').range().length ? this.get('defaultColorScale')(index) : "#cccccc";
      };
      
      let rules = [...this.get('distribution').values()]
        .sort((a, b) => a.qty > b.qty ? 1:-1)
        .map( (dist, i) => Rule.create({
          cells: dist.cells,
          label: dist.val,
          visible: true,
          color: scale(i)
        }));
       
      this.set("rules", rules);
    }
    
  },
  
  getScaleOf(type) {
    
    const NONE = {fn: function() {}};
    NONE.fn.url = () => "none";
    
    return () => NONE;
      
  },
  
  distribution: function() {
      
    return this.get('varCol.body').reduce( (dist, c) => {
      let val = !Ember.isEmpty(c.get('value')) ? c.get('value') : Rule.EMPTY_VALUE;
      if (!dist.has(val)) {
        dist.set(val, {val: val, qty: 1, cells: Em.A([c])});
      } else {
        dist.get(val).qty += 1;
        dist.get(val).cells.addObject(c);
      }
      return dist;
    }, new Map());
      
  }.property('varCol')
  
});
