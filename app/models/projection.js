import Ember from 'ember';
import Struct from './struct';
import d3 from 'd3';

let Projection = Struct.extend({
  
  dictionnary: Ember.inject.service(),
  
  id: null,
  name: null,
  d3_geo: null,
  rotate: null,
  scale: null,
  clipAngle: null,
  lobes: null,
  
  fn() {
    let d3Proj = eval(this.get('d3_geo'));
    
    if (this.get('clipAngle')) {
      d3Proj.clipAngle(this.compClipAngle());
    }
    
    if (this.get('lobes')) {
      d3Proj.clipAngle(this.compLobes());
    }
    
    return d3Proj;
  },
  
  compClipAngle() {
    return eval(this.get('clipAngle'));
  },
  
  compLobes() {
    return eval(this.get('lobes'));
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
      score_distance: this.get('score_distance')
    });
  }
  
});

Projection.reopenClass({
  
  createDefault() {
    let o = Projection.create({
      id: "mercator",
      name: "Mercator",
      d3_geo: "d3.geo.mercator()"
    });
    return o;
  },
  
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
          score_distance: json.score_distance
      });
      return o;
  }
  
});

export default Projection;
