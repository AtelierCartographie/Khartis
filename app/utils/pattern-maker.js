import {isFirefox} from 'khartis/utils/browser-check';
import d3 from 'npm:d3';

let _buildPatternFn = function(id, size, drawer) {
  
  let Fn = function(useMask = true, fill) {

    this.baseUrl = isFirefox() ? window.location : "";
    this.useMask = useMask;
    this.fill = d3.rgb(fill).toString();

  };

  Fn.prototype.init = function(sel) {
    
    this.patternId = btoa(`pt-${sel.attr('id')}-${id}${!this.useMask ? `-${this.fill}` : ""}`).replace(/\=/g, "");

    let defs = sel.selectAll("defs");
  
    if (defs.empty()) {
      defs = sel.append("defs");
    }
    
    let pattern = defs.selectAll(`#${this.patternId}`);
    
    if (pattern.empty()) {
      
      pattern = defs.append("pattern")
        .attrs({
          id: `${this.patternId}`,
          patternUnits: "userSpaceOnUse",
          width: size,
          height: size
        });
      
      drawer(pattern, this.fill);
      
    };

    if (this.useMask) {

      this.maskId = `${this.patternId}-mask`;

      let mask = defs.selectAll(`#${this.maskId}`);

      if (mask.empty() && useMask) {
      
        let size = 4096;
        
        mask = defs.append("mask")
          .attrs({
            id: this.maskId,
            width: 4096,
            height: 4096
          });
        
        mask.append("rect").attrs({
            x: -(4096/2),
            y: -(4096/2),
            width: 4096,
            height: 4096
          })
          .attr("fill", `url(#${this.patternId})`);
          
      }

    }
    
  }
  
  Fn.prototype.url = function() {
    return `${this.baseUrl}#${this.maskId ? this.maskId : this.patternId}`;
  };

  Fn.id = function() {
    return id;
  };
  
  return Fn;
  
};

let Pattern = {};

Pattern.lines = function(opts = {}) {
  let orientation = opts.orientation || ["diagonal"],
      shapeRendering = "auto",
      size = opts.size || (2*opts.stroke+4),
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
    function(g, stroke = "#FFFFFF") {
      for (let i = 0; i < orientation.length; i++) {
        g.append("path").attrs({
          d: path(orientation[i]),
          "stroke-width": strokeWidth,
          "stroke": stroke,
          "shape-rendering": shapeRendering,
          "stroke-linecap": "square"
        });
      }
    }
  );
   
};

Pattern.circles = function(opts = {}) {
  
  let strokeWidth = 1,
      radius = opts.stroke,
      size = opts.size || (2*radius+4)

  return _buildPatternFn(
    `circles-${(""+radius).replace(".", "_")}`,
    size,
    function(g, color = "#FFFFFF") {
      g.append("circle").attrs({
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
      strokeScale = d3.scalePow().exponent(1).range([1, 8]),
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
