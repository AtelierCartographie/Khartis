let lines = function(opts = {}) {
  let orientation = opts.orientation || ["diagonal"],
      shapeRendering = "auto",
      size = opts.size || 10,
      stroke = "#FFFFFF",
      strokeWidth = opts.stroke,
      scale = opts.scale || 1,
      id = () => `${orientation.join('-').replace('/', '')}-${(strokeWidth+"").replace(".", "_")}`,
      maskId,
      patternId,
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
          /*case "1of8":
            return (function(s) {
              return "M " + (s / 4) + ",0 l " + (s / 2) + "," + s + " M " + (-s / 4) + ",0 l " + (s / 2) + "," + s + "\nM " + (s * 3 / 4) + ",0 l " + (s / 2) + "," + s;
            })(size);
          case "2of8":
            return (function(s) {
              return "M 0," + s + " l " + s + "," + (-s) + " M " + (-s / 4) + "," + (s / 4) + " l " + (s / 2) + "," + (-s / 2) + "\nM " + (3 / 4 * s) + "," + (5 / 4 * s) + " l " + (s / 2) + "," + (-s / 2);
            })(size);*/
          
          /*case "3of8":
            return (function(s) {
              return "M 0," + (3 / 4 * s) + " l " + s + "," + (-s / 2) + " M 0," + (s / 4) + " l " + s + "," + (-s / 2) + "\nM 0," + (s * 5 / 4) + " l " + s + "," + (-s / 2);
            })(size);*/
          /*case "4of8":
            return (function(s) {
              return "M 0," + (s / 2) + " l " + s + ",0";
            })(size);*/
          
          /*case "5of8":
            return (function(s) {
              return "M 0," + (-s / 4) + " l " + s + "," + (s / 2) + "M 0," + (s / 4) + " l " + s + "," + (s / 2) + "\nM 0," + (s * 3 / 4) + " l " + s + "," + (s / 2);
            })(size);*/
          /*case "7of8":
            return (function(s) {
              return "M " + (-s / 4) + ",0 l " + (s / 2) + "," + s + " M " + (s / 4) + ",0 l " + (s / 2) + "," + s + "\nM " + (s * 3 / 4) + ",0 l " + (s / 2) + "," + s;
            })(size);*/
          default:
            return (function(s) {
              return "M " + (s / 2) + ", 0 l 0, " + s;
            })(size);
        }
      };
      
  let proc = function() {
    
    maskId = `mask-${this.attr('id')}-${id()}`;
    
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
      
      for (let i = 0; i < orientation.length; i++) {
        pattern.append("path").attr({
          d: path(orientation[i]),
          "stroke-width": strokeWidth,
          "shape-rendering": shapeRendering,
          "stroke": stroke,
          "stroke-linecap": "square"
        });
      }
      
    }
    
    if (mask.empty()) {
      
      mask = defs.append("mask")
        .attr({
          id: maskId,
          width: 2048,
          height: 2048
        });
      
      mask.append("rect").attr({
          x: -1024,
          y: -1024,
          width: 2048,
          height: 2048,
          transform: `scale(${scale})`
          
        })
        .attr("fill", `url(${window.location}#pattern-${maskId})`);
        
    }
        
  }
  
  proc.url = function() {
    if (!maskId) {
      throw new Error("Pattern not attached to svg element");
    }
   return `${window.location}#${maskId}`;
  }
  
  return proc;
   
};

let Composer = function(){};

Composer.prototype.compose = function(diverging, reverse, classes, before, angle, baseStroke) {
  
  let res;
  
  if (diverging) {
    
    let left = Array.from({length: before}, (v, i) => {
          return this.build({
              angle: angle + 90,
              stroke: baseStroke + i
            });
        }),
        right = Array.from({length: classes - before}, (v, i) => {
          return this.build({
              angle: angle,
              stroke: baseStroke + i
            });
        });
    
    reverse ? right.reverse() : left.reverse();
    
    res = left.concat(right);
    
  } else {
    res = Array.from({length: classes}, (v, i) => {
      return this.build({
          angle: angle,
          stroke: baseStroke + i
        });
    });
    reverse ? res.reverse() : void(0);
  }
  
  return res;
  
};
  
Composer.prototype.build = function({angle, stroke}) {
  return {
    angle: angle,
    stroke: stroke,
    fn: lines({
      orientation: [ angle ],
      stroke: [ stroke  ]
    })
  };
};

const NONE = function() {};
NONE.url = () => "none";

export default {lines, NONE, Composer: new Composer()};
