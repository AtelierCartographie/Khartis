import Ember from 'ember';
import Struct from './struct';
import d3 from 'npm:d3';

let Projection = Struct.extend({
  
  id: null,
  name: null,
  d3_geo: null,
  rotate: null,
  parallels: [0, 0],
  scale: null,
  clipAngle: null,
  lobes: null,
  translation_x: 1,
  translation_y: 1,
  rotation_z: 1,
  isComposite: false,
  subProjections: null,
  
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
    10),
  
  projector() {
    let projector = d3.geoCompositeProjection();
    if (this.get('isComposite')) {
      projector.projections = this.get('subProjections');
    } else {
      projector.projections = [{idx: 1, projection: this.get('d3_geo'), scale: 1, zoning: [[0,0], [1,1]], bounds: "Sphere"}];
    }

    if (this.get('lobes')) {
      projector.lobes(this.compLobes());
    }

    if (this.get('clipAngle')) {
      projector.clipAngle(this.compClipAngle());
    }
    
    if (this.get('rotate')) {
      projector.rotate(this.compRotate());
    }

    return projector;
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
      d3_geo: "",
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
