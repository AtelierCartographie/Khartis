import Ember from 'ember';
import d3 from 'd3';
import d3lper from 'mapp/utils/d3lper';
import Struct from './struct';
import Projection from './projection';
import Basemap from './basemap';

var Margin = Struct.extend({
  
  l: 16,
  r: 16,
  t: 30,
  b: 200,
  
  h: function() {
    return this.get('l') + this.get('r');
  }.property('l', 'r'),
  v: function() {
    return this.get('t') + this.get('b');
  }.property('t', 'b'),

  deferredChange: Ember.debouncedObserver(
    'l', 'r', 't', 'b', 'h', 'v',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export() {
    return this._super({
      l: this.get('l'),
      r: this.get('r'),
      t: this.get('t'),
      b: this.get('b')
    });
  }
  
});

Margin.reopenClass({
  
  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
          l: json.l,
          r: json.r,
          t: json.t,
          b: json.b
      });
      return o;
  }
    
});

var GraphLayout = Struct.extend({
	
  basemap: null,
  
	stroke: "#ffffff",
	strokeWidth: 1,
	
	backgroundColor: "#F7F7F7",
  backMapColor: "#e0e1e1",
  
  showBorders: true,

  showGrid: true,
  gridColor: "#e1e3ee",
  
  showLegend: null,
	
	autoCenter: false,
	
	virginPatternColorAuto: true,
	
	_virginPatternColor: null,
	virginPatternColor: function(key, value) {
		
		var self = this;
		
		var colorAuto = function() {
			
			var bgColor = d3.rgb(self.get("backgroundColor"));
			
			return (d3lper.yiqColor(bgColor) === "lighten" ? bgColor.brighter(3):bgColor.darker(3)).toString();
			
		};
		
		if (arguments.length === 1) { //get
			
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
		
		if (arguments.length === 1) {
			
			return this.get("_virginDisplayed");
			
		} else {

			if (value === false) {
				this.set("autoCenter", true);
      }
			
			this.set("_virginDisplayed", value);
			
			return value;
		
		}
		
	}.property("_virginDisplayed"),
	
  tx: 0,
  ty: 0,
	width: 1024,
	height: 700,
	margin: Margin.create(),
  zoom: 1,
  precision: 2.5,
  legendTx: null,
  legendTy: null,
  legendOpacity: 0.85,
  
  projection: null,

  showLegendChange: function() {
    this.set('margin.b', this.get('showLegend') ? this.get('height') * 0.33 : 30);
  }.observes('showLegend', 'height').on("init"),
  
	hOffset: function(screenWidth) {
		return (screenWidth - this.get('width')) / 2;
	},
	
	vOffset: function(screenHeight) {
		return (screenHeight - this.get('height')) / 2;
	},
	
  export() {
    return this._super({
      basemap: this.get('basemap') ? this.get('basemap').export() : null,
      projection: this.get('projection') ? this.get('projection').export() : null,
      margin: this.get('margin') ? this.get('margin').export() : null,
      backgroundColor: this.get('backgroundColor'),
      backMapColor: this.get('backMapColor'),
      gridColor: this.get('gridColor'),
      stroke: this.get('stroke'),
      tx: this.get('tx'),
      ty: this.get('ty'),
      width: this.get('width'),
      height: this.get('height'),
      zoom: this.get('zoom'),
      precision: this.get('precision'),
      showBorders: this.get('showBorders'),
      showGrid: this.get('showGrid'),
      showLegend: this.get('showLegend'),
      legendTx: this.get('legendTx'),
      legendTy: this.get('legendTy'),
      legendOpacity: this.get('legendOpacity')
    });
  }
  
});

GraphLayout.reopenClass({
  
  createDefault() {
    let o = GraphLayout.create({});
    return o;
  },
  
  restore(json, refs = {}) {
      let o = this._super(json, refs, {
        basemap: json.basemap ? Basemap.restore(json.basemap) : null,
        backgroundColor: json.backgroundColor,
        backMapColor: json.backMapColor,
        gridColor: json.gridColor,
        stroke: json.stroke,
        projection: json.projection ? Projection.restore(json.projection) : null,
        margin: json.margin ? Margin.restore(json.margin) : null,
        width: json.width,
        tx: json.tx,
        ty: json.ty,
        height: json.height,
        zoom: json.zoom,
        precision: json.precision,
        showBorders: json.showBorders,
        showGrid: json.showGrid,
        showLegend: json.showLegend,
        legendTx: json.legendTx,
        legendTy: json.legendTy,
        legendOpacity: json.legendOpacity
      });
      return o;
  }
    
});


export default GraphLayout;
