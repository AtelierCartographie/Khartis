export default {
	
	scale(val) {
		return "scale("+val+")";
	},
	
	translate({tx = 0, ty = 0}) {
		return "translate("+tx+", "+ty+")";
	},
	
	yiqColor(d3Color) {
	  let r = d3Color.r,
	      g = d3Color.g,
	      b = d3Color.b,
	      yiq = (r * 299 + g * 587 + b * 114) / 1000;
	  return (yiq >= 128) ? 'darken' : 'lighten';
	},
  
  
  flow(_) {
    
    const CSS = {
      "flow": function(val) { return val; },
      "layout": function(val) { return val; },
      "width": function(val, bbox) { bbox.width =  cssPx(val) },
      "height": function(val, bbox) { bbox.height =  cssPx(val) },
      "stretch": function(val) { return val; },
      "wrap": function(val) { return val; },
      "margin-bottom": function(val, bbox) { /*bbox.height += cssPx(val);*/ },
      "margin-top": function(val, bbox) { /*bbox.height += cssPx(val);*/ },
      "margin-left": function(val, bbox) { /*bbox.width += cssPx(val);*/ },
      "margin-right": function(val, bbox) { /*bbox.width += cssPx(val);*/ },
      "padding-bottom": function(val, bbox, padBox) { padBox.b = cssPx(val); },
      "padding-top": function(val, bbox, padBox) { padBox.t = cssPx(val); },
      "padding-left": function(val, bbox, padBox) { padBox.l = cssPx(val); },
      "padding-right": function(val, bbox, padBox) { padBox.r = cssPx(val); },
    };
    
    function cssPx(val) { return parseInt(val.replace("px", "")); }
    
    function parseCss(el) {
      
      let css = el.getAttribute('flow-css') ? el.getAttribute('flow-css').split(";") : [];
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
      let computedBBoxs = new Map(),
          recomputableBBoxs = new Map();
      d3.selectAll(childs).each( function() {
        
        let css = parseCss(this);
        
        if (!css.hasProperty("layout", ["fluid"])) {
          let {bbox} = getDescriptor(this);
          (css.hasProperty("layout", "fill") ? recomputableBBoxs : computedBBoxs).set(this, bbox);
        }
        
      } );
      
      //compute size of every fluid children
      let fluidCount = childs.length - [...computedBBoxs.values()].length - [...recomputableBBoxs.values()].length,
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
          d3.select(this).attr(sizeAttr, bbox[sizeAttr]);
        }
        
      } );
      
      //final layout
     let pos = 0,
         crossMax = 0,
         crossShift = 0;
     d3.selectAll(childs).each( function() {
       
       if (computedBBoxs.has(this)) {
        
          let {bbox, padBox, css} = getDescriptor(this);
          
          let dCoord = bbox[coordAttr];
          
          if (elDesc.css.hasProperty('wrap', ["true", "1"]) &&  pos + bbox[sizeAttr] > elDesc.bbox[sizeAttr]) {
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
            d3l.attr(crossSizeAttr, bbox[crossSizeAttr]);
          }
          
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
          
          pos += (bbox[sizeAttr] + dCoord);
          
       }
       
      } );
      
      setTimeout(function() {
        let postDisplayBBox = el.getBBox();
        [...recomputableBBoxs.entries()].forEach( e => {
          let {padBox} = getDescriptor(e[0]);
          d3.select(e[0]).attr({
            x: -padBox.l,
            y: -padBox.t,
            width: postDisplayBBox.width + padBox.l + padBox.r,
            height: postDisplayBBox.height + padBox.t + padBox.b
          });
        });
      }, 100);
      
    };
    
    function traverse(el) {
      
      let css = parseCss(el);
          
      if (css.hasProperty("flow", ["horizontal", "vertical"])) {
        distribute(el);
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
    
  },
  
  wrapText: function(text, width)  {
    console.log(width);
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y);
          if (!isNaN(dy)) {
            tspan.attr("dy", dy + "em");
          }
          console.log(text, words, tspan);
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
	
	
}
