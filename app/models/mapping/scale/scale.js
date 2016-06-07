import Ember from 'ember';
import Struct from 'mapp/models/struct';

let CONTRASTS = {
  0: 1/3,
  1: 0.5,
  2: 1,
  3: 2
};

let Scale = Struct.extend({
  
  classes: 8,
  intervalType: "mean",
  valueBreak: null,
  classesBeforeBreak: 0,
  contrast: 1,
  
  diverging: false,
  
  valueBreakChange: function() {
    
    if (this.get('possibleClasses').indexOf(this.get('classes')) === -1) {
      this.set('classes', 2);
    }
    
    if (!this.get('diverging')) {
      this.set('classesBeforeBreak', 0);
    } else {
      if (!this.get('classesBeforeBreak')
          || this.get('possibleClassesBeforeBreak').indexOf(this.get('classesBeforeBreak')) === -1) {
        this.set('classesBeforeBreak', Math.floor(this.get('classes') / 2));
      }
    }
    
  }.observes('intervalType', 'valueBreak', 'diverging', 'classes', 'possibleClassesBeforeBreak'),
  
  possibleClasses: function() {
    if (this.get('intervalType') === "regular" || this.get('intervalType') === "quantile") {
      return Array.from({length: 7}, (v, i) => (i+2));
    } else if (this.get('intervalType') === "mean") {
      return Array.from({length: 3}, (v, i) => Math.pow(2, (i+1)));
    } else {
      return []; //linear
    }
  }.property('intervalType'),
  
  possibleClassesBeforeBreak: function() {
    let lgt = this.get('possibleClasses').indexOf(this.get('classes'));
    if (this.get('intervalType') === "regular" || this.get('intervalType') === "quantile") {
      return Array.from({length: lgt+1}, (v, i) => (i+1));
    } else if (this.get('intervalType') === "mean") {
      return [1].concat(this.get('possibleClasses').slice(0, lgt));
    } else {
      return []; //linear
    }
  }.property('classes', 'intervalType'),
  
  contrastScale: function() {
    return d3.scale.pow().exponent(CONTRASTS[this.get('contrast')]);
  }.property('contrast'),
  
  deferredChange: Ember.debouncedObserver(
    'intervalType', 'classes', 'valueBreak',
    'classesBeforeBreak', 'contrast',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  getIntervals: function(values) {
    
    let calc = (intervalType, classes, bounds) => {
      
      let isInside = (ext, v) => v >= ext[0] && v <= ext[1],
          ext = d3.extent(values).map( (v,i) => bounds[i] !== undefined ? bounds[i] : v ),
          vals = values.filter( v => isInside(ext, v) );
          
      if (intervalType === "regular") {
        let band = (ext[1] - ext[0])/classes;
        return Array.from({length: classes-1}, (v,i) => (i+1)*band+ext[0] );
      } else if (intervalType === "quantile") {
        return d3.scale.quantile()
          .domain(vals)
          .range(Array.from({length: classes}, (v,i) => i))
          .quantiles();
      } else if (intervalType === "mean") {
        
        let means = [],
            mean = (ext) => {
              return d3.mean(vals.filter( v => isInside(ext, v) ));
            };
        
        for (;means.length+1 < classes;) {
          let exts = means.reduce( (arr, m, i) => {
            let e = arr[i];
            arr[i] = [e[0], m];
            arr.push([m, e[1]]);
            return arr;
          }, [d3.extent(vals)]);
          
          means = exts.map( ext => mean(ext) );
        }
        
        return means;
        
      } else if (intervalType === "linear") {
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
        this.get('classes') - this.get('classesBeforeBreak'),
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
      diverging: this.get('diverging')
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
      diverging: json.diverging
    });
    return o;
  }
});


export default Scale;
