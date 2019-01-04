import Ember from 'ember';
import d3 from 'npm:d3';
import {default as Rule, OrderedSurfaceRule, OrderedSymbolRule} from '../rule';
import VisualizationFactory from '../visualization/factory';
import PatternMaker from 'khartis/utils/pattern-maker';
import ColorBrewer from 'khartis/utils/colorbrewer';

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

  maxValuePrecision: null,
  
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

      let values = [...this.get('distribution').values()],
          colors = this.getColorSet(values.length),
          colorScale = (index) => {
            return index < colors.length ? colors[index] : "#dddddd";
          };
      
      let rules = values.sort((a, b) => d3.descending(a.qty, b.qty))
        .map( (dist, i) => {
          if (this.get('ordered')) {
            return OrderedSurfaceRule.create({
              cells: dist.cells,
              label: dist.val,
              shape: null,
              index: i,
              color: colorScale(i),
              visualization: this.get('visualization')
            });
          } else {
            return Rule.create({
              cells: dist.cells,
              label: dist.val,
              visible: true,
              color: colorScale(i),
              size: null,
              shape: null
            });
          }
        });
      this.set("rules", rules);
    }
    this._super();
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

  shiftRule(oldIndex, newIndex) {
    let ascending = newIndex > oldIndex,
        colorByIndex = this.get('rules').reduce( (out, r) => {
          out[r.get('index')] = r.get('color');
          return out;
        }, {});
    this.get('rules').forEach( r => {
      let idx = r.get('index');
      if (r.get('index') === oldIndex) {
        idx = newIndex;
      } else {
        if (ascending) {
          if (r.get('index') > oldIndex && r.get('index') <= newIndex) {
            idx--;
          }
        } else {
          if (r.get('index') >= newIndex && r.get('index') < oldIndex) {
            idx++;
          }
        }
      }
      r.setProperties({
        index: idx,
        color: colorByIndex[idx]
      });
    });
  },

  getColorSet(length) {
    length = Math.max(2, Math.min(length || this.get('rules').length, 8));
    if (length > 1) {
      return ColorBrewer.Composer.compose(
        this.get('visualization.colors'),
        false,
        false,
        length,
        0,
        !this.get('ordered')
      );
    }
  },

  updateRulesColorSet() {
    let colorSet = this.getColorSet();
    this.get('rules').forEach( (r, i) => {
      r.setProperties({
        color: i < colorSet.length ? colorSet[i] : "#cccccc"
      });
    });
  },

  generateVisualization() {
    if (!this.get('visualization')) {
      let visu = VisualizationFactory.createInstance("surface");
      visu.resetToDefaults(!this.get('ordered'));
      this.set('visualization', visu);
    }
  },

  orderedChange: function() {
    if (this.get('visualization')) {
      this.get('visualization').resetToDefaults(!this.get('ordered'));
      this.generateRules(true);
    }
  }.observes('ordered'),
  
  getScaleOf(type) {
    return () => PatternMaker.NONE;
  },

  visualizationColorSetChange: function() {
    if (this.get('rules')) {
      this.updateRulesColorSet();
    }
  }.observes('visualization.colors'),
  
});

let SymbolMixin = Ember.Mixin.create({

  generateRules(force) {
    if (force || !this.get('rules')) {
      
      let values = [...this.get('distribution').values()];

      this.get('visualization').recomputeAvailableShapes(this.get('ordered'), Math.min(values.length, 8));

      let colors = shuffleArray(this.get('visualization').composeColorSet().slice()),
          shapes = this.get('ordered') ? this.get('visualization.shapeSet') : shuffleArray(this.get('visualization.availableShapes').slice()),
          colorScale = (index) => {
            return index < colors.length ? colors[index] : "#dddddd";
          },
          shapeScale = (index, noValue = "circle") => {
            return index < shapes.length ? shapes[index] : noValue;
          };
      
      let rules = values.sort((a, b) => d3.descending(a.qty, b.qty))
        .map( (dist, i) => {
          if (this.get('ordered')) {
            return OrderedSymbolRule.create({
              cells: dist.cells,
              label: dist.val,
              shape: shapeScale(i, null),
              index: i,
              visualization: this.get('visualization')
            });
          } else {
            return Rule.create({
              cells: dist.cells,
              label: dist.val,
              visible: true,
              color: colorScale(i),
              size: this.get('visualization.maxSize'),
              shape: shapeScale(i)
            });
          }
        });
      this.set("rules", rules);
    }
    this._super();
  },

  swapRule(rule, targetRule) {
    let oldShape = targetRule.get('shape'),
        oldIndex = targetRule.get('index');
    
    targetRule.setProperties({
      index: rule.get('index'),
      shape: rule.get('shape')
    });

    rule.setProperties({
      index: oldIndex,
      shape: oldShape
    });
  },

  shiftRule(oldIndex, newIndex) {
    let ascending = newIndex > oldIndex,
        shapeByIndex = this.get('rules').reduce( (out, r) => {
          out[r.get('index')] = r.get('shape');
          return out;
        }, {});
    this.get('rules').forEach( r => {
      let idx = r.get('index');
      if (r.get('index') === oldIndex) {
        idx = newIndex;
      } else {
        if (ascending) {
          if (r.get('index') > oldIndex && r.get('index') <= newIndex) {
            idx--;
          }
        } else {
          if (r.get('index') >= newIndex && r.get('index') < oldIndex) {
            idx++;
          }
        }
      }
      r.setProperties({
        index: idx,
        shape: shapeByIndex[idx]
      });
    });
  },

  updateRulesShapeSet(shapeSet) {
    this.get('rules').forEach( (r, i) => {
      r.setProperties({
        shape: i < shapeSet.length ? shapeSet[i] : null
      });
    });
  },

  updateRulesColorSet() {
    let colorSet = this.get('visualization').composeColorSet(this.get('rules').length);
    this.get('rules').forEach( (r, i) => {
      r.setProperties({
        color: i < colorSet.length ? colorSet[i] : "#dddddd"
      });
    });
  },
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("symbol.categorical"));
    }
  },

  postConfigure() {
    this.get('visualization').recomputeAvailableShapes(this.get('ordered'), Math.min(this.get('rules').length, 8));
    this._super();
  },

  orderedChange: function() {
    if (this.get('visualization')) {
      this.generateRules(true);
      this.get('visualization').resetToDefaults();
    }
  }.observes('ordered'),

  visualizationShapeChange: function() {
    if (this.get('rules')) {
      this.get('visualization').recomputeAvailableShapes(this.get('ordered'), Math.min(this.get('rules').length, 8), true);
    }
  }.observes('visualization.shape'),

  visualizationAvailableShapesChange: function() {
    if (this.get('rules')) {
      if (this.get('ordered')) {
        this.updateRulesShapeSet(this.get('visualization.shapeSet'));
      } else {
        this.generateRules(true);
      }
    }
  }.observes('visualization.availableShapes'),

  visualizationColorSetChange: function() {
    if (this.get('rules')) {
      this.updateRulesColorSet();
    }
  }.observes('visualization.colorSet'),
  
  getScaleOf(type) {
    return () => PatternMaker.NONE;
  }
  
});


export default {Data: DataMixin, Surface: SurfaceMixin, Symbol: SymbolMixin};
