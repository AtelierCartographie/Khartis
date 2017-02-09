let d3lper = {
	
	scale(val) {
		return "scale("+val+")";
	},
	
	translate({tx = 0, ty = 0}) {
		return "translate("+tx+", "+ty+")";
	},

  sumCoords(...args) {
    return args.reduce( (out, coords) => {
      !coords && (coords = [0,0]);
      return [out[0] + coords[0], out[1] + coords[1]];
    }, [0, 0]);
  },

  subtractCoords(...args) {
    return args.reverse().reduce( (out, coords) => {
      !coords && (coords = [0,0]);
      return [coords[0] - out[0], coords[1] - out[1]];
    }, [0, 0]);
  },

  scaleCoords(scale, ...args) {
    return args.map( (coords) => [coords[0]*scale, coords[1]*scale] );
  },

  polyPoints(arr) {
    return arr.map(function(d) {
        return d.join(",");
    }).join(" ");
  },
	
	yiqColor(d3Color) {
	  let r = d3Color.r,
	      g = d3Color.g,
	      b = d3Color.b,
	      yiq = (r * 299 + g * 587 + b * 114) / 1000;
	  return (yiq >= 128) ? 'darken' : 'lighten';
	},

  getLocale(i18n) {
    const en_US = {
      "decimal": ".",
      "thousands": ",",
      "grouping": [3],
      "currency": ["$", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%m/%d/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
    const locale = Object.assign(en_US, {
      "decimal": i18n.t('d3.format.decimal'),
      "thousands": i18n.t('d3.format.thousands')
    });
    return d3.locale(locale);
  },
  
  flow(_) {
    
    const CSS = {
      "flow": function(val) { return val; },
      "layout": function(val) { return val; },
      "width": function(val, bbox) { bbox.width =  cssPx(val); },
      "height": function(val, bbox) { bbox.height =  cssPx(val); },
      "stretch": function(val) { return val; },
      "wrap": function(val) { return val; },
      "margin-bottom": function(val, bbox) {  },
      "margin-top": function(val, bbox) {  },
      "margin-left": function(val, bbox) {  },
      "margin-right": function(val, bbox) {  },
      "padding-bottom": function(val, bbox, padBox) { padBox.b = cssPx(val); },
      "padding-top": function(val, bbox, padBox) { padBox.t = cssPx(val); },
      "padding-left": function(val, bbox, padBox) { padBox.l = cssPx(val); },
      "padding-right": function(val, bbox, padBox) { padBox.r = cssPx(val); },
      "min-width": function(val, bbox) { if (bbox.width < cssPx(val)) bbox.width = cssPx(val) },
      "min-height": function(val, bbox) { if (bbox.height < cssPx(val)) bbox.height = cssPx(val) },
      "max-width": function(val, bbox) { if (bbox.width > cssPx(val)) bbox.height = cssPx(val) },
      "max-height": function(val, bbox) { if (bbox.height > cssPx(val)) bbox.height = cssPx(val) },
      "wrap-text": function() {}
    };
    
    function cssPx(val) { return parseFloat(val.replace("px", "")); }
    
    function parseCss(el) {
      
      let css = el.getAttribute('kis:flow-css') ? el.getAttribute('kis:flow-css').split(";") : [];
      let instructions = css.filter(s => s.length).reduce( (instructions, s) => {
        let couple = s.trim().split(":");
        if (couple.length === 2) {
          if (CSS.hasOwnProperty(couple[0].trim())) {
            instructions.push({name: couple[0].trim(), val: couple[1].trim()});
          } else {
            console.log(`Unrocognized flow css : ${couple[0]} -- skipping`);
          }
        } else {
          throw new Error(`Unrocognized flow css : ${s}`);
        }
        return instructions;
      }, []).sort( (a, b) => d3.ascending() );
      
      let CSSProcessor = function(instructions) {
        this.instructions = instructions;
      };
      CSSProcessor.prototype.process = function(bbox, padBox) {
        this.instructions.forEach( css => CSS[css.name](css.val, bbox, padBox) );
      };
      CSSProcessor.prototype.get = function(prop) {
        return this.instructions.find( inst => inst.name === prop );
      };
      CSSProcessor.prototype.hasProperty = function(prop, val) {
        if (val !== undefined) {
          let inst = this.get(prop),
              vals = val instanceof Array ? val : [val];
          return inst && vals.indexOf(inst.val) !== -1;
        }
        return this.get(prop) != null;
      };
      
      return new CSSProcessor(instructions);
    };
    
    let descriptors = new Map();
    
    function getDescriptor(el) {
      if (!descriptors.has(el)) {
        let bbox = el.getBBox(),
            padBox = {l: 0, r: 0, t: 0, b: 0},
            css = parseCss(el);
        css.process(bbox, padBox);
        descriptors.set(el, {bbox, padBox, css});
      }
      return descriptors.get(el);
    }
    
    function distribute(el) {
      
      let elDesc = getDescriptor(el),
          [coordAttr, sizeAttr] = elDesc.css.get("flow").val === "vertical" ? ["y", "height"] : ["x", "width"],
          [crossCoordAttr, crossSizeAttr] = elDesc.css.get("flow").val === "vertical" ?  ["x", "width"] : ["y", "height"],
          [padBefore, padAfter, crossPadBefore, crossPadAfter] = elDesc.css.get("flow").val === "vertical" ?  ["t", "b", "l", "r"] : ["l", "r", "t", "b"],
          childs = el.childNodes;
      
      //compute size of every solid children
      let computedBBoxs = new Map();
      d3.selectAll(childs).each( function() {
        
        let css = parseCss(this);
        
        if (!css.hasProperty("layout", ["fluid"])) {
          let {bbox} = getDescriptor(this);
          computedBBoxs.set(this, bbox);
        }
        
      } );
      
      //compute size of every fluid children
      let fluidCount = childs.length - [...computedBBoxs.values()].length,
          remainingSpace = [...computedBBoxs.values()].reduce( (bbox, v) => {
            bbox[sizeAttr] -= v[sizeAttr]; 
            return bbox;
          }, {width: elDesc.bbox.width, height: elDesc.bbox.height});
      remainingSpace.width -= elDesc.padBox.l + elDesc.padBox.r;
      remainingSpace.height -= elDesc.padBox.t + elDesc.padBox.b;
      d3.selectAll(childs).each( function() {
        
        let css = parseCss(this);
        
        if (css.hasProperty("layout", ["fluid"])) {
          let {bbox} = getDescriptor(this);
          bbox[sizeAttr] = remainingSpace[sizeAttr] / fluidCount;
          computedBBoxs.set(this, bbox);
          d3.select(this).attr("kis:kis:"+sizeAttr, bbox[sizeAttr]);
        }
        
      } );
      
      //final layout
     let pos = 0,
         crossMax = 0,
         crossShift = 0;
     d3.selectAll(childs).each( function() {
       
       if (computedBBoxs.has(this)) {
        
          let {bbox, padBox, css} = getDescriptor(this);

          if (elDesc.css.hasProperty('wrap', ["true", "1"]) && pos + bbox[sizeAttr] > elDesc.bbox[sizeAttr]) {
            crossShift = crossMax;
            pos = 0;
            crossMax = 0;
          }
          
          bbox[crossCoordAttr] = crossShift;
          crossMax = Math.max(crossMax, bbox[crossCoordAttr] + bbox[crossSizeAttr]);
          
          //apply padding
          bbox.x += elDesc.padBox.l;
          bbox.y += elDesc.padBox.t;
          
          //apply margin before
          if (css.hasProperty('margin-top')) {
            bbox.y += cssPx(css.get('margin-top').val);
            if (coordAttr === "y") {
              pos += cssPx(css.get('margin-top').val);
            }
          }
          
          if (css.hasProperty('margin-left')) {
            bbox.x += cssPx(css.get('margin-left').val);
            if (coordAttr === "x") {
              pos += cssPx(css.get('margin-left').val);
            }
          }
          
          bbox[coordAttr] = pos;
          
          let d3l = d3.select(this).attr("transform", `translate(${bbox.x}, ${bbox.y})`)
          
          if (css.hasProperty('stretch', ["1", "true"])) {
            bbox[crossSizeAttr] =  elDesc.bbox[crossSizeAttr] - (elDesc.padBox[crossPadBefore] + elDesc.padBox[crossPadAfter]);
            d3l.attr("kis:kis:"+crossSizeAttr, bbox[crossSizeAttr]);
          }
          
          pos += bbox[sizeAttr];
          
          //apply margin after
          if (css.hasProperty('margin-bottom')) {
            if (coordAttr === "y") {
              pos += cssPx(css.get('margin-bottom').val);
            }
          }
          
          if (css.hasProperty('margin-right')) {
            if (coordAttr === "x") {
              pos += cssPx(css.get('margin-right').val);
            }
          }
          
       }
       
      } );
      
      
    };

    let postProcessing = [];
    
    function traverse(el) {
      
      let css = parseCss(el);
          
      if (css.hasProperty("flow", ["horizontal", "vertical"])) {
        postProcessing.push(el);
      }

      if (css.hasProperty("wrap-text", ["1", "true"])) {
        d3lper.wrapText(el, css.hasProperty("max-width") ? cssPx(css.get('max-width').val) : 200);
      }
      
      for (var i = 0; i < el.childNodes.length; i++) {
        var child = el.childNodes[i];
        if (child.nodeType === 1) {
          traverse(child);
        }
      }
      
    };
    
    if (_.node()) {
      traverse(_.node());
    }

    postProcessing.forEach( el => distribute(el) );
    
  },
  
  wrapText: function(el, width)  {
    d3.select(el).each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy"));
          if (isNaN(dy)) {
            dy = 0;
          }
          let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
        }
      }
    });
  }
	
	
};


export default d3lper;
