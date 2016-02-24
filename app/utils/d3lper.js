export default = {
	
	scale: function(val) {
		
		return "scale("+val+")";
		
	},
	
	translate: function(tx, ty) {
		
		return "translate("+tx+", "+ty+")";
		
	},
	
	yiqColor: function (d3Color) {
	  var r = d3Color.r,
	      g = d3Color.g,
	      b = d3Color.b;
	  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
	  return (yiq >= 128) ? 'darken' : 'lighten';
	}
	
	
}
