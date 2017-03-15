import d3 from 'npm:d3';

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
    return d3.formatLocale(locale);
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
