import Ember from 'ember';
import d3 from 'npm:d3';
import Struct from 'khartis/models/struct';
import {insideInterval, nestedMeans, standardDeviation, jenks} from 'khartis/utils/stats';

const CONTRASTS = {
  0: 1/4,
  1: 1/3,
  2: 0.5,
  3: 1,
  4: 2,
  5: 3
};

let Scale = Struct.extend({
  
  classes: null,
  intervalType: null,
  valueBreak: null,
  classesBeforeBreak: 1,
  contrast: 2,
  usesInterval: null,
  
  diverging: function() {
    return this.get('valueBreak') != null && !isNaN(this.get('valueBreak'));
  }.property('valueBreak'),
  
  contrastScale: function() {
    return d3.scalePow().exponent(CONTRASTS[this.get('contrast')]);
  }.property('contrast'),
  
  deferredChange: Ember.debouncedObserver(
    'intervalType', 'usesInterval', 'classes',
    'valueBreak', 'classesBeforeBreak', 'contrast',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  getIntervals: function(values) {
    
    let calc = (intervalType, classes, bounds) => {
      
      let ext = d3.extent(values).map( (v,i) => bounds[i] !== undefined ? bounds[i] : v ),
          vals = values.filter( v => insideInterval(ext, v) );
      
      if (this.get('usesInterval')) {

        if (intervalType === "regular") {
          let band = (ext[1] - ext[0])/classes;
          return Array.from({length: classes-1}, (v,i) => (i+1)*band+ext[0] );
        } else if (intervalType === "quantile") {
          return d3.scaleQuantile()
            .domain(vals)
            .range(Array.from({length: classes}, (v,i) => i))
            .quantiles();
        } else if (intervalType === "mean") {
          return nestedMeans(vals, classes);
        } else if (intervalType === "standardDeviation") {
          return standardDeviation(vals, classes);
        } else if (intervalType === "jenks") {
          return jenks(vals, classes);
        }

      } else {
        return ext;
      }
      
    };
    
    let intervals;
    if (this.get('diverging')) {
      let vb = parseFloat(this.get('valueBreak'));
      vb = isNaN(vb) ? 0 : vb;
      intervals = calc(
        this.get('intervalType'),
        this.get('classesBeforeBreak'),
        [undefined, vb]
      ).concat([vb])
       .concat(calc(
          this.get('intervalType'),
          this.get('classes') - this.get('classesBeforeBreak'),
          [vb, undefined]
        ));
    } else {
      intervals = calc(
        this.get('intervalType'),
        this.get('classes'),
        [undefined, undefined]
      );
    }

    return intervals;
    
  },
  
  export(props) {
    return this._super(Object.assign({
      classes: this.get('classes'),
      intervalType: this.get('intervalType'),
      valueBreak: this.get('valueBreak'),
      classesBeforeBreak: this.get('classesBeforeBreak'),
      contrast: this.get('contrast'),
      usesInterval: this.get('usesInterval')
    }, props));
  }
  
});

Scale.reopenClass({
  
  restore(json, refs = {}) {
    let o = this._super(json, refs, {
      classes: json.classes,
      intervalType: json.intervalType,
      valueBreak: json.valueBreak,
      classesBeforeBreak: json.classesBeforeBreak,
      contrast: json.contrast,
      usesInterval: json.usesInterval
    });
    return o;
  }
});


export default Scale;
