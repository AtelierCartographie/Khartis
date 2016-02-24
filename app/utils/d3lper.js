export default {
	
	scale(val) {
		return "scale("+val+")";
	},
	
	translate(tx, ty) {
		return "translate("+tx+", "+ty+")";
	},
	
	yiqColor(d3Color) {
	  let r = d3Color.r,
	      g = d3Color.g,
	      b = d3Color.b,
	      yiq = (r * 299 + g * 587 + b * 114) / 1000;
	  return (yiq >= 128) ? 'darken' : 'lighten';
	}
	
	
}
