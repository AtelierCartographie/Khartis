import d3 from 'd3';

function inside(bbox, x, y) {
  return x >= bbox[0][0] && x <= bbox[1][0]
  && y <= bbox[0][1] && y >= bbox[1][1];
}

let proj = function() {
  
  let proxy = d3.geo.mercator(),
      projs = [
        {fn: d3.geo.conicConformal(), bbox: [[-11, 58.0], [9.5, 35.5]], center: [6.5, 44.0]},
        {fn: d3.geo.mercator(), bbox: [[-61.9634, 16.6034],[-60.7879, 15.722]], translateTo: [5, 44], center: [6.5, 44.0], log: true},
        {fn: d3.geo.mercator(), bbox: [[-61.2968, 14.943],[-60.715, 14.321]], translateTo: [6, 44], center: [6.5, 44.0], log: true}
      ];

  let projection = {

    stream(stream) {

      let streams = projs.map( p => {
        let trans = d3.geo.transform({
          point: function(x, y) {
            /*if (p.translateTo) {
              let o0 = proxy(p.bbox[0]),
                  o1 = proxy(p.translateTo);
              x += o1[0] - o0[0];
              y += o1[1] - o0[1];
            }*/
            this.stream.point(x, y);
          }
        });
        p.stream = p.fn.stream(stream);
        return p;
      });

      return {
        point: function(x, y) {
          streams.forEach( s => s.stream.point(x, y) );
        },
        sphere: function() {
          streams.forEach( s => s.stream.sphere() );
        },
        lineStart: function() {
          streams.forEach( s => s.stream.lineStart() );
        },
        lineEnd: function() {
          streams.forEach( s => s.stream.lineEnd() );
        },
        polygonStart: function() {
          streams.forEach( s => s.stream.polygonStart() );
        },
        polygonEnd: function() {
          streams.forEach( s => s.stream.polygonEnd() );
        }
      }
    },

    scale(f) {
      if (!arguments.length) return proxy.scale();
      projs.forEach( p => p.fn.scale(f) );
      return (proxy.scale(f), this);
    },

    translate(xy) {
      if (!arguments.length) return proxy.translate();
      projs.forEach( p => {
        p.fn.translate(xy);
        //p.fn.clipExtent([proxy(p.bbox[0]), proxy(p.bbox[1])]);
      });
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
    }
  };

  return projection;

}

d3.geo.arnaudTest = proj;
