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
      
  }.property('varCol'),

  reorderRules() {
    this.set('rules', this.get('rules').sort( (a,b) => d3.ascending(a.get('index'), b.get('index')) ).slice());
  }

  
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
          shape: null,
          index: i
        }));
       
      this.set("rules", rules);
    }
    
  },

  swapRule(rule, targetRule) {
    let oldColor = targetRule.get('color'),
        oldIndex = targetRule.get('index');
    
    targetRule.setProperties({
      color: rule.get('color'),
      index: rule.get('index')
    });

    rule.setProperties({
      color: oldColor,
      index: oldIndex
    });
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
          shape: shapeScale(i),
          index: i
        }));
       
      this.set("rules", rules);
    }
    
  },

  swapRule(rule, targetRule) {
    let oldColor = targetRule.get('color'),
        oldShape = targetRule.get('shape'),
        oldIndex = targetRule.get('index');
    
    targetRule.setProperties({
      color: rule.get('color'),
      index: rule.get('index'),
      shape: rule.get('shape')
    });

    rule.setProperties({
      color: oldColor,
      index: oldIndex,
      shape: oldShape
    });
  },

  updateRulesShapeSet(shapeSet) {
    this.get('rules').forEach( (r, i) => r.set('shape', i < shapeSet.length ? shapeSet[i] : null ));
  },
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("symbol"));
    }
  },

  orderedChange: function() {
    if (this.get('visualization')) {
      this.get('visualization').recomputeAvailableShapes(this.get('ordered'), Math.min(this.get('rules').length, 8), "circle");
    }
  }.observes('ordered').on("init"),
  
  getScaleOf(type) {
    return () => PatternMaker.NONE;
  }
  
});


export default {Data: DataMixin, Surface: SurfaceMixin, Symbol: SymbolMixin};
