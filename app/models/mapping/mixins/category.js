import Ember from 'ember';
import d3 from 'npm:d3';
import Rule from '../rule';
import VisualizationFactory from '../visualization/factory';
import PatternMaker from 'khartis/utils/pattern-maker';

let shuffleArray = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
};

let DataMixin = Ember.Mixin.create({
  
  defaultColorScale: d3.scaleOrdinal(d3.schemeCategory10), 
  
  getScaleOf(type) {
    
    const NONE = {fn: function() {}};
    NONE.fn.url = () => "none";
    
    return () => NONE;
      
  },

  maxValuePrecision: 5,
  
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

  generateRules(force) {
    
    if (force || !this.get('rules')) {

      let colors = shuffleArray(this.get('defaultColorScale').range().slice()),
          colorScale = (index) => {
            return index < colors.length ? colors[index] : "#dddddd";
          };
      
      let rules = [...this.get('distribution').values()]
        .sort((a, b) => d3.descending(a.qty, b.qty))
        .map( (dist, i) => Rule.create({
          cells: dist.cells,
          label: dist.val,
          visible: true,
          color: colorScale(i),
          size: null,
          shape: null
        }));
       
      this.set("rules", rules);
    }
    
  },
  
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

  generateRules(force) {
    
    if (force || !this.get('rules')) {
      
      let colors = shuffleArray(this.get('defaultColorScale').range().slice()),
          shapes = shuffleArray(this.get('visualization.availableShapes').slice()),
          colorScale = (index) => {
            return index < colors.length ? colors[index] : "#dddddd";
          },
          shapeScale = (index) => {
            return index < shapes.length ? shapes[index] : "circle";
          };
      
      let rules = [...this.get('distribution').values()]
        .sort((a, b) => d3.descending(a.qty, b.qty))
        .map( (dist, i) => Rule.create({
          cells: dist.cells,
          label: dist.val,
          visible: true,
          color: colorScale(i),
          size: this.get('visualization.maxSize'),
          shape: shapeScale(i)
        }));
       
      this.set("rules", rules);
    }
    
  },
  
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
