import Ember from 'ember';
import d3 from 'd3';
import d3lper from 'mapp/utils/d3lper';

var GraphLayout = Ember.Object.extend({
	
  basemap: "110m-world.json",
  
	stroke: "#445aa9",
	strokeWidth: 1,
	
	backgroundColor: "#F7F7F7",
	
	autoCenter: false,
	
	virginPatternColorAuto: true,
	
	_virginPatternColor: null,
	virginPatternColor: function(key, value) {
		
		var self = this;
		
		var colorAuto = function() {
			
			var bgColor = d3.rgb(self.get("backgroundColor"));
			
			return (d3lper.yiqColor(bgColor) == "lighten" ? bgColor.brighter(3):bgColor.darker(3)).toString();
			
		}
		
		if (arguments.length == 1) { //get
			
			if (this.get('virginPatternColorAuto')) {
				
				return colorAuto();
				
			} else {
				
				return this.get("_virginPatternColor");
				
			}
			
		} else {
			
			
			
			if (value != null && value.length > 0) {
				this.setProperties({"_virginPatternColor": value, "virginPatternColorAuto": false});
			} else {
				this.set("virginPatternColorAuto", true);
			}
			
			return value;
			
		}
		
		
	}.property('_virginPatternColor', 'backgroundColor'),
	
	virginPattern: "diagonalGrid",
	
	_virginDisplayed: true,
	
	virginDisplayed: function(key, value) {
		
		if (arguments.length == 1) {
			
			return this.get("_virginDisplayed");
			
		} else {

			if (value === false)
				this.set("autoCenter", true);
			
			this.set("_virginDisplayed", value);
			
			return value;
		
		}
		
	}.property("_virginDisplayed"),
	
	width: 800,
	height: 600,
	margin: {v: 10, h: 10},
  
  projection: d3.geo.mercator,
	
	hOffset: function(screenWidth) {
		
		return (screenWidth - this.get('width')) / 2;
		
	},
	
	vOffset: function(screenHeight) {
		
		return (screenHeight - this.get('height')) / 2;
		
	},
	
	scale: d3.scale.linear()
  
});

GraphLayout.reopenClass({
	
	createFromDefaults: function(defaults) {
		
		defaults = Ember.Object.create(defaults);
		
		return GraphLayout.create({
			
			width: defaults.get('layout.width'),
			height: defaults.get('layout.height')
			
		});
		
	}
	
});


export default GraphLayout;
