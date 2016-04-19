import Ember from 'ember';
import Rule from '../rule';
import VisualizationFactory from '../visualization/factory';
import PatternMaker from 'mapp/utils/pattern-maker';

let DataMixin = Ember.Mixin.create({
  
  defaultColorScale: d3.scale.category10(), 
  
  generateRules() {
    
    if (!this.get('rules')) {
      
      let scale = (index) => {
        return index < this.get('defaultColorScale').range().length ? this.get('defaultColorScale')(index) : "#dddddd";
      };
      
      let rules = [...this.get('distribution').values()]
        .sort((a, b) => d3.descending(a.qty, b.qty))
        .map( (dist, i) => Rule.create({
          cells: dist.cells,
          label: dist.val,
          visible: true,
          color: scale(i),
          shape: "circle"
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

let SurfaceMixin = Ember.Mixin.create({
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("surface"));
    }
  },
  
  getScaleOf(type) {
    return () => PatternMaker.NONE;
  }
  
});

let SymbolMixin = Ember.Mixin.create({
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("symbol"));
    }
  },
  
  getScaleOf(type) {
    return () => PatternMaker.NONE;
  }
  
});


export default {Data: DataMixin, Surface: SurfaceMixin, Symbol: SymbolMixin};
