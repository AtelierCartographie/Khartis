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
          //transform: `scale(${scale})`
        })
        .attr("fill", `url(${window.location}#pattern-${maskId})`);
        
    }
    
  }
  
  fn.url = function() {
    if (!maskId) {
      throw new Error("Pattern not attached to svg element");
    }
    return `${window.location}#${maskId}`;
  };
  
  return fn;
  
};

let Pattern = {};

Pattern.lines = function(opts = {}) {
  let orientation = opts.orientation || ["diagonal"],
      shapeRendering = "auto",
      size = opts.size || 12,
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
  
  let size = opts.size || 12,
      color = "#FFFFFF",
      strokeWidth = 1,
      radius = opts.stroke;
  
  return _buildPatternFn(
    `circles-${size}`,
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

Composer.prototype.compose = function(diverging, reverse, classes, before, angle, baseStroke) {
  
  let res;
  
  if (diverging) {
    
    let left = Array.from({length: before}, (v, i) => {
          return this.build({
              type: "circles",
              angle: angle + 90,
              stroke: baseStroke + Math.pow(before - i, 2),
              size: 6*(before - i)
            });
        }),
        right = Array.from({length: classes - before}, (v, i) => {
          return this.build({
              type: "lines",
              angle: angle,
              stroke: baseStroke + Math.pow(i, 2),
              size: 6*i
            });
        });
    
    reverse ? right.reverse() : left.reverse();
    
    res = left.concat(right);
    
  } else {
    res = Array.from({length: classes}, (v, i) => {
      return this.build({
          type: "lines",
          angle: angle,
          stroke: baseStroke + Math.pow(i, 2),
          size: 6*i
        });
    });
    reverse ? res.reverse() : void(0);
  }
  
  return res;
  
};
  
Composer.prototype.build = function({angle, stroke, type, size}) {
  size = size || 12;
  return {
    angle: angle,
    stroke: stroke,
    key: `${angle}-${stroke}`,
    fn: Pattern[type]({
      orientation: [ angle ],
      stroke: stroke,
      size: size
    })
  };
};

const NONE = function() {};
NONE.url = () => "none";

export default {NONE, Composer: new Composer()};
