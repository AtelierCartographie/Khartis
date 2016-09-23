import d3 from 'd3';

function inside(bbox, x, y) {
  return x >= bbox[0][0] && x <= bbox[1][0]
  && y <= bbox[0][1] && y >= bbox[1][1];
}

let projs = [
  {fn: d3.geo.conicConformal(), scale: 1},
  {fn: d3.geo.mercator(), scale: 0.3},
  {fn: d3.geo.mercator(), scale: 1},
  {fn: d3.geo.mercator(), scale: 1},
  {fn: d3.geo.mercator(), scale: 0.5},
  {fn: d3.geo.mercator(), scale: 1}
];

let proj = function(proxy) {
  
  proxy = proxy || projs[0].fn;

  let projection = {

    stream(stream) {
      
      let s = proxy.stream(stream);

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
      if (!arguments.length) return proxy.scale();
      //let diff = this.resolution/f;
      //projs.forEach( p => p.fn.scale(p.fn.resolution/diff) );
      return (proxy.scale(f), this);
    },

    translate(xy) {
      if (!arguments.length) return proxy.translate();
      /*let diff = [proxy.translate()[0] - xy[0], proxy.translate()[1] - xy[1]];
      projs.forEach( p => p.fn.translate([p.fn.translate()[0] - diff[0], p.fn.translate()[1] - diff[1]]) );*/
      return (proxy.translate(xy), this);
    },

    invert(coords) {
      return proxy.invert(coords);
    },

    precision(v) {
      if (!arguments.length) return proxy.precision();
      projs.forEach( p => p.fn.precision(v) );
      return (proxy.precision(v), this);
    },

    clipExtent(args) {
      projs.forEach( p => p.fn.clipExtent(args) );
      return (proxy.clipExtent(args), this);
    },

    center(args) {
      if (!arguments.length) return proxy.center();
      return (proxy.center(args), this);
    },

    proxying(idx) {
      return projs[idx].fn.scale(1/projs[idx].scale);
    },

    get resolution() {
      return proxy.resolution;
    },

    set resolution(v) {
      proxy.resolution = v;
    },

    get initialTranslate() {
      return proxy.initialTranslate;
    },

    set initialTranslate(v) {
      proxy.initialTranslate = v;
    },

    all() {
      return projs.map(p => p.fn);
    }

  };


  return projection;

}

d3.geo.arnaudTest = proj;
