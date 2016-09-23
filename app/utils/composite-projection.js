import d3 from 'd3';

function inside(bbox, x, y) {
  return x >= bbox[0][0] && x <= bbox[1][0]
  && y <= bbox[0][1] && y >= bbox[1][1];
}

let proj = function() {
  
  let projection = {

    set projections(projs) {
      this.projs = projs.map( projConfig => ({idx: projConfig.idx, fn: eval(projConfig.projection), scale: projConfig.scale}) );
    },

    get ref() {
      return this.projs[0].fn;
    },

    get resolution() {
      return this.ref.resolution;
    },

    set resolution(v) {
      this.ref.resolution = v;
    },

    get initialTranslate() {
      return this.ref.initialTranslate;
    },

    set initialTranslate(v) {
      this.ref.initialTranslate = v;
    },

    stream(stream) {
      
      let s = this.ref.stream(stream);

      return {
        point: function(x, y) {
          s.point(x, y);
        },
        sphere: function() {
          s.sphere();
        },
        lineStart: function() {
          s.lineStart();
        },
        lineEnd: function() {
          s.lineEnd();
        },
        polygonStart: function() {
          s.polygonStart();
        },
        polygonEnd: function() {
          s.polygonEnd();
        }
      }

    },

    scale(f) {
      if (!arguments.length) return this.ref.scale();
      return (this.ref.scale(f), this);
    },

    translate(xy) {
      if (!arguments.length) return this.ref.translate();
      return (this.ref.translate(xy), this);
    },

    invert(coords) {
      return this.ref.invert(coords);
    },

    precision(v) {
      if (!arguments.length) return this.ref.precision();
      projs.forEach( p => p.fn.precision(v) );
      return (this.ref.precision(v), this);
    },

    clipExtent(args) {
      projs.forEach( p => p.fn.clipExtent(args) );
      return (this.ref.clipExtent(args), this);
    },

    center(args) {
      if (!arguments.length) return this.ref.center();
      return (this.ref.center(args), this);
    },

    getSubProjection(idx) {
      let p = this.projs.find( p => p.idx === idx );
      return p.fn.scale(1/p.scale);
    },

    all() {
      return this.projs.map(p => p.fn);
    }

  };

  return projection;

}

d3.geo.compositeProjection = proj;
