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
  translation_x: 1,
  translation_y: 1,
  rotation_z: 1,
  isComposite: false,
  subProjections: [],
  
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

  d3Proj: function() {
    let d3Proj = eval(this.get('d3_geo'));
    if (this.get('isComposite')) {
      d3Proj.projections = this.get('subProjections');
    }
    return d3Proj;
  }.property('d3_geo'),
  
  deferredChange: Ember.debouncedObserver(
    'rotate', 'scale', 'clipAngle',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  fn(transform = true, idx) {

    let d3Proj = this.get('d3Proj');

    d3Proj = this.get('isComposite') && idx ? d3Proj.getSubProjection(idx) : d3Proj;

    if (this.get('lobes')) {
      d3Proj.lobes(this.compLobes());
    }
    
    if (transform) {
      if (this.get('clipAngle')) {
        d3Proj.clipAngle(this.compClipAngle());
      }
      
      if (this.get('rotate') && d3Proj.rotate) {
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

  getZoning(idx) {
    return (this.get('isComposite') && this.get('subProjections').find( p => p.idx === idx ).zoning) || [[0, 0], [1, 1]];
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
      year: this.get('year'),
      translation_x: this.get('translation_x'),
      translation_y: this.get('translation_y'),
      rotation_z: this.get('rotation_z'),
      isComposite: this.get('isComposite'),
      subProjections: this.get('subProjections')
    });
  }
  
});

Projection.reopenClass({

  createComposite(projections) {
    return this.create({
      d3_geo: "d3.geo.compositeProjection()",
      rotate: "[0,0,0]",
      translation_x: 0,
      translation_y: 0,
      rotation_z: 0,
      isComposite: true,
      subProjections: projections
    });
  },
  
  restore(json, refs = {}) {
      return this._super(json, refs, {
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
        year: json.year,
        translation_x: json.translation_x,
        translation_y: json.translation_y,
        rotation_z: json.rotation_z,
        isComposite: json.isComposite,
        subProjections: json.subProjections
      });
  }
  
});

export default Projection;
