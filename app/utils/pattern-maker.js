let _buildPatternFn = function(id, size, drawer) {
  
  let maskId;
  
  let fn = function() {
    
    maskId = `mask-${this.attr('id')}-${id}`;
    
    let defs = this.selectAll("defs");
  
    if (defs.empty()) {
      defs = this.append("defs");
    }
      
    let pattern = defs.selectAll(`#pattern-${maskId}`),
        mask = defs.selectAll(`#${maskId}`);
    
    if (pattern.empty()) {
      
      pattern = defs.append("pattern")
        .attr({
          id: `pattern-${maskId}`,
          patternUnits: "userSpaceOnUse",
          width: size,
          height: size
        });
      
      drawer(pattern);
      
    }
    
    if (mask.empty()) {
      
      let size = 4096;
      
      mask = defs.append("mask")
        .attr({
          id: maskId,
          width: 4096,
          height: 4096
        });
      
      mask.append("rect").attr({
          x: -(4096/2),
          y: -(4096/2),
          width: 4096,
          height: 4096
        })
        .attr("fill", `url(#pattern-${maskId})`);
        
    }
    
  }
  
  fn.url = function() {
    if (!maskId) {
      throw new Error("Pattern not attached to svg element");
    }
    return `#${maskId}`;
  };

  fn.id = function() {
    return id;
  };
  
  return fn;
  
};

let Pattern = {};

Pattern.lines = function(opts = {}) {
  let orientation = opts.orientation || ["diagonal"],
      shapeRendering = "auto",
      size = opts.size || (2*opts.stroke+4),
      stroke = "#FFFFFF",
      strokeWidth = opts.stroke,
      path = function(orientation) {
        switch (orientation % 180) {
          case 0:
            return (function(s) {
              return "M 0," + (s / 2) + " l " + s + ",0";
            })(size);
          case 45:
            return (function(s) {
              return "M 0," + s + " l " + s + "," + (-s) + " M " + (-s / 4) + "," + (s / 4) + " l " + (s / 2) + "," + (-s / 2) + "\nM " + (3 / 4 * s) + "," + (5 / 4 * s) + " l " + (s / 2) + "," + (-s / 2);
            })(size);
          case 90:
            return (function(s) {
              return "M " + (s / 2) + ", 0 l 0, " + s;
            })(size);
          case 135:
            return (function(s) {
              return "M 0,0 l " + s + "," + s + " M " + (-s / 4) + "," + (3 / 4 * s) + " l " + (s / 2) + "," + (s / 2) + "\nM " + (s * 3 / 4) + "," + (-s / 4) + " l " + (s / 2) + "," + (s / 2);
            })(size);
          default:
            return (function(s) {
              return "M " + (s / 2) + ", 0 l 0, " + s;
            })(size);
        }
      };
  size = (orientation[0] % 90 === 0) ? size : size*Math.sqrt(2);
  return _buildPatternFn(
    `lines-${orientation.join('-').replace('/', '')}-${(strokeWidth+"").replace(".", "_")}`,
    size,
    function(g) {
      for (let i = 0; i < orientation.length; i++) {
        g.append("path").attr({
          d: path(orientation[i]),
          "stroke-width": strokeWidth,
          "shape-rendering": shapeRendering,
          "stroke": stroke,
          "stroke-linecap": "square"
        });
      }
    }
  );
   
};

Pattern.circles = function(opts = {}) {
  
  let color = "#FFFFFF",
      strokeWidth = 1,
      radius = opts.stroke,
      size = opts.size || (2*radius+4)

  return _buildPatternFn(
    `circles-${(""+radius).replace(".", "_")}`,
    size,
    function(g) {
      g.append("circle").attr({
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: color,
        stroke: color,
        "stroke-width": strokeWidth
      });
    }
  );
  
};


let Composer = function(){};

Composer.prototype.compose = function(diverging, classes, before, angle, baseStroke, reverse) {
  
  let res,
      l,
      strokeScale = d3.scale.pow().exponent(1).range([1, 8]),
      maxSize = strokeScale.range()[1] + 4;

  if (diverging) {
    
    let left = Array.from({length: l = before}, (v, i) => {

          strokeScale.domain([l > 1 ? 1 : 0, l]);
          return this.build({
              type: "circles",
              stroke: (baseStroke + Math.abs(strokeScale(before - i)))/2,
              size: maxSize
            });

        }),
        right = Array.from({length: l = classes - before}, (v, i) => {

          strokeScale.domain([l > 1 ? 1 : 0, l]);
          return this.build({
              type: "lines",
              angle: angle,
              stroke: baseStroke + strokeScale(i+1),
              size: maxSize
            });

        });
    
    reverse ? left.reverse() : void(0);
    reverse ? right.reverse() : void(0);
    res = left.concat(right);
    
  } else {
    res = Array.from({length: l = classes}, (v, i) => {

      strokeScale.domain([1, l]);
      return this.build({
          type: "lines",
          angle: angle,
          stroke: baseStroke + strokeScale(i+1),
          size: maxSize
        });

    });
    reverse ? res.reverse() : void(0);
  }

  console.log(res);
  
  return res;
  
};
  
Composer.prototype.build = function({angle, stroke, type, size}) {
  let fn = Pattern[type]({
        orientation: [ angle ],
        stroke: stroke,
        size: size
      });

  return {
    angle: angle,
    stroke: stroke,
    key: fn.id(),
    type: type,
    fn: fn
  };
};

const NONE = function() {};
NONE.url = () => "none";

export default {NONE, Composer: new Composer()};
