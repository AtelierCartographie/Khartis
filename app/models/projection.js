import Ember from 'ember';
import Struct from './struct';
import d3 from 'd3';

let Projection = Struct.extend({
  
  id: null,
  name: null,
  d3_geo: null,
  rotate: null,
  scale: null,
  clipAngle: null,
  lobes: null,
  
  rotateX: Ember.computed('rotate', {
    get() {
      let parts = this.get('rotate')
        .split(',');
      if (parts.length >= 1 && parts[0].length) {
        return parseInt(parts[0]
         .replace(/[\[\]]/g, "")
          .trim());
      }
      return 0;
    },
    set(key, value) {
      if (isNaN(value = parseFloat(value))) {
        value = 0;
      }
      this.set('rotate', `[${value},${this.get('rotateY')},${this.get('rotateZ')}]`);
      return value;
    }
  }),
  
  rotateY: Ember.computed('rotate', {
    get() {
      let parts = this.get('rotate')
        .split(',');
      if (parts.length >= 2) {
        return parseInt(parts[1]
         .replace(/[\[\]]/g, "")
          .trim());
      }
      return 0;
    },
    set(key, value) {
      if (isNaN(value = parseFloat(value))) {
        value = 0;
      }
      this.set('rotate', `[${this.get('rotateX')},${value},${this.get('rotateZ')}]`);
      return value;
    }
  }),
  
  rotateZ: Ember.computed('rotate', {
    get() {
      let parts = this.get('rotate')
        .split(',');
      if (parts.length === 3) {
        return parseInt(parts[2]
         .replace(/[\[\]]/g, "")
          .trim());
      }
      return 0;
    },
    set(key, value) {
      if (isNaN(value = parseFloat(value))) {
        value = 0;
      }
      this.set('rotate', `[${this.get('rotateX')},${this.get('rotateY')},${value}]`);
      return value;
    }
  }),
  
  deferredChange: Ember.debouncedObserver(
    'rotate', 'scale', 'clipAngle',
    function() {
      this.notifyDefferedChange();
    },
    100),
  
  fn(transform = true) {
    let d3Proj = eval(this.get('d3_geo'));
    
    if (this.get('lobes')) {
      d3Proj.lobes(this.compLobes());
    }
    
    if (transform) {
      if (this.get('clipAngle')) {
        d3Proj.clipAngle(this.compClipAngle());
      }
      
      if (this.get('rotate')) {
        d3Proj.rotate(this.compRotate());
      }
    }
    
    return d3Proj;
  },
  
  compClipAngle() {
    return eval(this.get('clipAngle'));
  },
  
  compLobes() {
    return eval(this.get('lobes'));
  },
  
  compRotate() {
    return eval(this.get('rotate'));
  },
  
  export() {
    return this._super({
      id: this.get('id'),
      name: this.get('name'),
      d3_geo: this.get('d3_geo'),
      rotate: this.get('rotate'),
      scale: this.get('scale'),
      clipAngle: this.get('clipAngle'),
      lobes: this.get('lobes'),
      score_angle: this.get('score_angle'),
      score_area: this.get('score_area'),
      score_distance: this.get('score_distance'),
      author: this.get('author'),
      year: this.get('year')
    });
  }
  
});

Projection.reopenClass({
  
  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
        id: json.id,
        name: json.name,
        d3_geo: json.d3_geo,
        rotate: json.rotate,
        scale: json.scale,
        clipAngle: json.clipAngle,
        lobes: json.lobes,
        score_angle: json.score_angle,
        score_area: json.score_area,
        score_distance: json.score_distance,
        author: json.author,
        year: json.year
      });
      return o;
  }
  
});

export default Projection;
