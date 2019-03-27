import d3 from 'npm:d3';
import {Vector} from './vector';

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

  xyRelativeTo(from, to) {
    const bboxTo = d3lper.normalizedClientRect(to);
    const bboxFrom = d3lper.normalizedClientRect(from);
    return {
      x: bboxFrom.x - bboxTo.x,
      y: bboxFrom.y - bboxTo.y
    }
  },

  polyPoints(arr) {
    return arr.map(function(d) {
        return d.join(",");
    }).join(" ");
  },

  distance(pt1, pt2) {
    return Math.sqrt((pt2[0]-pt1[0])*(pt2[0]-pt1[0]) + (pt2[1]-pt1[1])*(pt2[1]-pt1[1]));
  },

  curveLine(points, pctDistance) {
    let vect = Vector.fromPoints(points[0] ,points[1]),
        normal = vect.normal(),
        ptMiddle = [vect.x / 2 + points[0][0], vect.y / 2 + points[0][1]],
        scaledNormal = normal.scale(pctDistance),
        deviatiedPt = [ptMiddle[0] + scaledNormal.x, ptMiddle[1] + scaledNormal.y];
    return [
      points[0],
      deviatiedPt,
      points[1]
    ];
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
    return d3.formatLocale(locale);
  },
  
  wrapText: function(sel, width)  {
    sel.each(function() {
      let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1; // ems
  
      if (words.length > 1) {
        let y = text.attr("y"),
            dy = parseFloat(text.attr("dy"));

        isNaN(dy) && (dy = 0);
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
      }
    })
  },

  multilineText: function(textEl, text)  {
    if (!textEl.empty() && text && text.length > 1) {
      let lines = (text || "").split(/\n/g),
          lineHeight = 1.1, // ems
          y = textEl.attr("y"),
          dy = parseFloat(textEl.attr("dy"));
      if (isNaN(dy)) {
        dy = 0;
      }
      textEl.text(null);
      lines.forEach( line => {
        textEl.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(line);
      } );
    }
  },

  selectionMaxWidth(sel) {
    return Math.max.apply(undefined, [0, ...sel.nodes().map( n => n.getBoundingClientRect().width )]);
  },

  selectionMaxHeight(sel) {
    return Math.max.apply(undefined, [0, ...sel.nodes().map( n => n.getBoundingClientRect().height )]);
  },

  absoluteSVGBox(svg, element) {
    let xy = svg.createSVGPoint(),
        elemBox = d3lper.normalizedClientRect(element);
    xy.x = elemBox.x;
    xy.y = elemBox.y;
    xy = xy.matrixTransform(svg.getScreenCTM().inverse());
    return {x: xy.x, y: xy.y, width: elemBox.width*svg.getScreenCTM().inverse().d, height: elemBox.height*svg.getScreenCTM().inverse().a};
  },

  normalizedClientRect(element) {
    let box = element.getBoundingClientRect();
    return {
      left: box.left, 
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      width: box.width,
      height: box.height,
      x: box.width < 0 ? box.left + box.width : box.left,
      y: box.height < 0 ? box.top + box.height : box.top
    };
  }
	
	
};


export default d3lper;
