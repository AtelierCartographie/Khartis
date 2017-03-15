import Ember from 'ember';
import d3 from 'npm:d3';
import Rule from '../rule';
import VisualizationFactory from '../visualization/factory';
import PatternMaker from 'khartis/utils/pattern-maker';
import Colorbrewer from 'khartis/utils/colorbrewer';
import config from 'khartis/config/environment';
/* global d3 */

let DataMixin = Ember.Mixin.create({
  
  values: function() {
    return this.get('filteredBody')
      .filter( c => {
        return !Ember.isEmpty(c.get('value')) && this.get('varCol.incorrectCells').indexOf(c) === -1
        && !isNaN(c.get('postProcessedValue'))
      })
      .map( c => c.get('postProcessedValue') );
  }.property('varCol'),
  
  absValues: function() {
    return this.get('values').map( v => Math.abs(v) );
  }.property('values'),

  shouldDiverge: function() {
    return this.get('values').some( v => v < 0 ) && this.get('values').some( v => v >= 0 );
  }.property('values'),

  allNegative: function() {
    console.log(this.get('values'), this.get('values').every( v => v <= 0 ));
    return this.get('values').every( v => v <= 0 );
  }.property('values'),

  initDivergence: function() {
    if (this.get('shouldDiverge') && !this.get('scale.diverging')) {
      this.set('scale.valueBreak', 0);
    }
  },

  maxValue: function() {
    return Math.max.apply(this, this.get('values'));
  }.property('values'),

  findNearestValue(val) {
    let distance = Number.MAX_VALUE - 1;
    return this.get('values').reduce( (nearest, value) => {
      let _distance = Math.abs(value - val);
      if (_distance < distance) {
        nearest = value;
        distance = _distance;
      }
      return nearest;
    });
  },
  
  clampValueBreak: function() {

    if (!this.get('scale.valueBreak') != null) {
      if (this.get('scale.valueBreak') < this.get('extent')[0]) {
        this.set('scale.valueBreak', this.get('extent')[0]);
      } else if (this.get('scale.valueBreak') > this.get('extent')[1]) {
        this.set('scale.valueBreak', this.get('extent')[1]);
      }
    } else if (this.get('scale.diverging')) {
      this.set('scale.valueBreak', 0);
    }
    
  },
  
  maxValuePrecision: function() {

    let max = 5;

    let pre = this.get('values').reduce( (p, v) => {
      if (isFinite(v)) {
        let e = 1;
        while (Math.round(v * e) / e !== v) e *= 10;
        return Math.max(Math.log(e) / Math.LN10, p);
      }
      return p;
    }, 0);

    pre = Math.min(pre, 5);
    
    
    /*augmente la précision si elle ne permet pas
     *de distinguer les intervalles 
     */
    let raisePrecision = function(v1, v2, pre) {
      let rv1 = v1, rv2 = v2, p = pre;
      while (rv1 !== rv2) {
        rv1 = Math.floor(v1*Math.pow(10, pre))/Math.pow(10, pre);
        rv2 = Math.floor(v2*Math.pow(10, pre))/Math.pow(10, pre);
        p++;
        if (p >= max) { //impossible à séparer
          return pre;
        }
      }
      return p;
    };

    pre = this.get('intervals').reduce( (p, v, i, arr) => {
      return raisePrecision(i > 0 ? arr[i-1] : undefined, v, p);
    }, pre);
    
    return pre;
  }.property('values', 'intervals'),

  valueBreakChange: function() {
    
    if (this.get('possibleClasses').indexOf(this.get('scale.classes')) === -1) {
      this.set('scale.classes', 2);
    }
    
    if (!this.get('scale.diverging')) {
      this.set('scale.classesBeforeBreak', 1);
    } else {
      if (!this.get('scale.classesBeforeBreak')
          || this.get('possibleClassesBeforeBreak').indexOf(this.get('scale.classesBeforeBreak')) === -1) {
        this.set('scale.classesBeforeBreak', Math.floor(this.get('scale.classes') / 2));
      }
    }
    
  }.observes('scale.intervalType', 'scale.valueBreak', 'scale.diverging', 'scale.classes'),

  possibleClasses: function() {

    let hl = Math.floor(this.get('values').length/2),
        max;
    if (this.get('scale.intervalType') === "regular" || this.get('scale.intervalType') === "quantile"
      || this.get('scale.intervalType') === "standardDeviation" || this.get('scale.intervalType') === "jenks") {
      max = Math.max(1, hl - 2 + 1);
      return Array.from({length: Math.min(7, max)}, (v, i) => (i+2));
    } else if (this.get('scale.intervalType') === "mean") {
      max = Math.max(1, Math.log(hl)/Math.log(2));
      return Array.from({length: Math.min(3, max)}, (v, i) => Math.pow(2, (i+1)));
    } else {
      return []; //linear
    }

  }.property('scale.intervalType'),
  
  possibleClassesBeforeBreak: function() {
    let lgt = this.get('possibleClasses').indexOf(this.get('scale.classes'));
    if (this.get('scale.intervalType') === "regular" || this.get('scale.intervalType') === "quantile"
      || this.get('scale.intervalType') === "standardDeviation" || this.get('scale.intervalType') === "jenks") {
      return Array.from({length: lgt+1}, (v, i) => (i+1));
    } else if (this.get('scale.intervalType') === "mean") {
      //return Array.from({length: Math.floor(this.get('scale.classes') / 2) - 1}, (v, i) =>  2 * (i + 1)); désactivé pour le moment
      return [this.get('scale.classes') / 2];
    } else {
      return []; //linear
    }
  }.property('scale.classes', 'scale.intervalType'),

  generateRules() {
    if (!this.get('rules')) {
      let ruleMap = this.get('varCol.body')
        .filter( c => Ember.isEmpty(c.get('value')) || this.get('varCol.incorrectCells').indexOf(c) !== -1 )
        .reduce( (m, c) => {
          let val = !Ember.isEmpty(c.get('value')) ? c.get('value') : Rule.EMPTY_VALUE,
              shape = !Ember.isEmpty(c.get('value')) ? "circle" : "line";
          if (!m.has(val)) {
            m.set(val, Rule.create({
              cells: Em.A([c]),
              label: val,
              visible: true,
              color: "#dddddd",
              shape: shape,
              size: 4
            }));
          } else {
            m.get(val).get('cells').addObject(c);
          }
          return m;
        }, new Map());
      this.set("rules", [...ruleMap.values()]);
    }
  },
  
  intervals: function() {
    this.initDivergence();
    return this.get('scale').getIntervals(this.get('values'));
  }.property('values.[]', 'scale._defferedChangeIndicator'),
  
  extent: function() {
    return d3.extent(this.get('values'));
  }.property('values.[]'),

  extentMin: function() {
    return this.get('extent')[0];
  }.property('extent'),
  
  extentMax: function() {
    return this.get('extent')[1];
  }.property('extent'),
  
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


let SurfaceMixin = Ember.Mixin.create({
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("surface"));
    }
  },

  configureScale() {
    this.get('scale').setProperties({
      classes: this.get('scale.classes') != null ? this.get('scale.classes') : config.visualization.values.surface.default.classes,
      intervalType: this.get('scale.intervalType') || config.visualization.values.surface.default.intervalType,
      usesInterval: true
    });
  },

  colorSet: function() {

    let master = this.get('scale.diverging') ? Colorbrewer.diverging : Colorbrewer.sequential;
    if (!master[this.get('visualization.colors')]) {
      this.set('visualization.colors', Object.keys(master)[0]);
    }

    return Colorbrewer.Composer.compose(
      this.get('visualization.colors'), 
      this.get('scale.diverging'),
      this.get('visualization.reverse'), 
      this.get('scale.classes'),
      this.get('scale.classesBeforeBreak')
    );
    
  }.property('visualization.colors', 'visualization.reverse', 'scale.classes', 'scale.classesBeforeBreak', 'scale.diverging'),

  patternModifiers: function() {
    
    return PatternMaker.Composer.compose(
      this.get('scale.diverging'),
      this.get('scale.classes'),
      this.get('scale.classesBeforeBreak'),
      this.get('visualization.pattern.angle'),
      this.get('visualization.pattern.stroke'),
      this.get('visualization.reverse')
    );
    
  }.property('visualization.pattern', 'scale.classes',
  'scale.classesBeforeBreak', 'scale.diverging', 'visualization.reverse'),

  patternColor: Ember.computed('colorSet.[]', {

    get() {
      if (!this.get('visualization.patternColor')) {
        let master = this.get('colorSet'),
            startIndex = this.get('scale.diverging') ? this.get('scale.classesBeforeBreak') : 0;
        return master[this.get('visualization.reverse') ? startIndex : master.length - 1];
      }
      return this.get('visualization.patternColor');
    },
    set(k, v) {
      return this.set('visualization.patternColor', v);
    }
    
  }),

  patternColorBeforeBreak: Ember.computed('colorSet.[]', {

    get() {
      if (!this.get('visualization.patternColorBefore')) {
      let master = this.get('colorSet'),
            endIndex = this.get('scale.classesBeforeBreak') - 1;
        return master[this.get('visualization.reverse') ? endIndex : 0];
      }
      return this.get('visualization.patternColorBefore');
    },
    set(k, v) {
      return this.set('visualization.patternColorBefore', v);
    }

  }),

  getScaleOf(type) {
    
    let ext = d3.extent(this.get('values')),
        intervals = this.get('intervals'),
        d3Scale,
        range,
        rangeLength;
        
    if (this.get('scale.usesInterval')) {
      d3Scale = d3.scaleThreshold();
      rangeLength = intervals.length + 1;
    } else {
      d3Scale = d3.scaleLinear();
      rangeLength = intervals.length; //2
    };
        
    if (this.get('visualization.pattern')) {
      
      if (type === "texture") {
        range = this.get('patternModifiers');
      } else if (type === "color") {
        if (this.get('scale.diverging')) {
          range = Array.from({length: rangeLength}, (v, i) => {
            return (i < this.get('scale.classesBeforeBreak')) ? this.get('patternColorBeforeBreak') : this.get('patternColor');
          });
        } else {
          range = Array.from({length: rangeLength}, () => this.get('patternColor'));
        }
      }
      
    } else if (this.get('visualization.colors')) {
      
      if (type === "texture") {
        range = Array.from({length: rangeLength}, () => {fn: PatternMaker.NONE});
      } else if (type === "color") {
        range = this.get('colorSet');
      }
    }

    return d3Scale
      .domain(intervals)
      .range(range);
      
  }
  
});

let SymbolMixin = Ember.Mixin.create({
  
  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("symbol"));
    }
  },

  configureScale() {
    this.get('scale').setProperties({
      classes: this.get('scale.classes') != null ? this.get('scale.classes') : 2,
      intervalType: this.get('scale.intervalType') || "regular",
      usesInterval: this.get('scale.usesInterval') || false
    });
  },

  minContrastIndex: function() {
    return this.get('visualization.shape') !== "bar" ? 0 : 1;
  }.property('visualization.shape'),

  maxContrastIndex: function() {
    return this.get('visualization.shape') !== "bar" ? 4 : 5;
  }.property('visualization.shape'),

  contrastMinMaxIndexesChanged: function() {
    this.get('scale.contrast') < this.get('minContrastIndex') && this.set('scale.contrast', this.get('minContrastIndex'));
    this.get('scale.contrast') > this.get('maxContrastIndex') && this.set('scale.contrast', this.get('maxContrastIndex'));
  }.observes('minContrastIndex', 'maxContrastIndex'),
  
  getScaleOf(type) {
    
    let ext = d3.extent(this.get('absValues')),
        intervals = this.get('intervals'),
        contrastScale = this.get('scale.contrastScale'),
        visualization = this.get('visualization'),
        d3Scale,
        domain,
        transform = _ => d3Scale(_*(1+Math.sign(_)*Number.EPSILON)),
        range;
        
    if (type === "size") {

      if (this.get('scale.usesInterval')) {

        contrastScale = d3.scaleThreshold();

        if (this.get('shouldDiverge')) {
          range = Array.from({length: this.get('scale.classesBeforeBreak')},
            (v, i) => Math.pow(this.get('scale.classesBeforeBreak') - i, 2)
          );
          range = range.concat(
            Array.from({length: this.get('scale.classes') - this.get('scale.classesBeforeBreak')},
              (v, i) => Math.pow(i + 1, 2)
            )
          );
        } else {
          if (this.get('allNegative')) {
            range = Array.from({length: intervals.length + 1},
              (v, i) => Math.pow(intervals.length + 1 - i, 2)
            );
          } else {
            range = Array.from({length: intervals.length + 1},
              (v, i) => Math.pow(i + 1, 2)
            );
          }
        }

        contrastScale.domain(intervals).range(range);

        d3Scale = d3.scaleLinear().clamp(true);
        domain = [0, d3.max(range)];
        range = [0, visualization.get('maxSize')];

        transform = _ => {
          return d3Scale(contrastScale(_*(1+Math.sign(_)*Number.EPSILON)));
        };

      } else {

        d3Scale = contrastScale.clamp(true);
        domain = [0, ext[1]];
        range = [0, visualization.get('maxSize')];
        transform = _ => d3Scale(Math.abs(_));

        transform.invert = (_) => d3Scale.invert(Math.abs(_));

      };

    } else if (type === "color") {
      
      d3Scale = d3.scaleThreshold()

      if (this.get('scale.diverging')) {
        range = this.get('visualization').colorStops(this.get('scale.diverging'));
        domain = [this.get('scale.valueBreak')];
      } else {
        range = this.get('visualization').colorStops();
        domain = [];
      }
      
    }
    
    d3Scale.domain(domain).range(range);
    
    return transform;
      
  }
  
});


export default {Data: DataMixin, Surface: SurfaceMixin, Symbol: SymbolMixin};
