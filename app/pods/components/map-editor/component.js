import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/world-dictionary';
/* global Em */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['height', 'width', 'xmlns', 'xmlns:xlink', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
	
	base: null,
	
	data: null,
	
	graphLayout: null,

	draw: function() {
    
		var d3g = this.d3l();
		
		// ========
		// = DEFS =
		// ========
		
		d3g.append("defs");
			
		// ---------
			
		
		d3g.append("rect")
			.classed("bg", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", this.get("graphLayout.backgroundColor"));
			
		var geo = d3g.append("g")
			.classed("layers", true);
			
		var og = d3g.append("g")
			.classed("offset", true);
			
		og.append("line").classed("horizontal-top", true);
		og.append("line").classed("horizontal-bottom", true);
		og.append("line").classed("vertical-left", true);
		og.append("line").classed("vertical-right", true);
		
		var mg = d3g.append("g")
			.classed("margin", true);
			
		mg.append("rect")
			.attr("fill", "none");

		this.projectAndDraw();
		this.updateColors();
		this.updateVirginPattern();

          
	}.on("didInsertElement"),
	
	updateColors: function() {
		
		var d3g = this.d3l();
		
		d3g.selectAll("defs pattern g")
 			.style("stroke", this.get("graphLayout.virginPatternColor"));
		
		d3g.style("background-color", this.get("graphLayout.backgroundColor"));
			
		d3g.select("rect.bg")
			.attr("fill", this.get("graphLayout.backgroundColor"));
		
		d3g.selectAll("g.offset line")
			.attr("stroke", "#C0E2EF");
			
		d3g.selectAll("g.margin rect")
			.attr("stroke", "#20E2EF");
		
	}.observes('graphLayout.stroke', 'graphLayout.backgroundColor',
    'graphLayout.virginPatternColorAuto', 'graphLayout.virginPatternColor'),
	
	updateVirginPattern: function() {
		
		var self = this;
		
		var d3g = this.d3l();
		
		d3g.selectAll("g.geo g.virgin")
			.style("fill", function() {
				
				return "url(#"+self.get('graphLayout.virginPattern')+")";
				
			});

		
	}.observes('graphLayout.virginPattern'),
	
	updateStroke: function() {
		
		var d3g = this.d3l();
		
		d3g.selectAll("path.feature")
			.attr("stroke-width", this.get("graphLayout.strokeWidth"));
		
	}.observes('graphLayout.strokeWidth'),
  
  projection: function() {
    
    var w = Math.max(this.$().width(), this.get('graphLayout.width'));
		var h = Math.max(this.$().height(), this.get('graphLayout.height'));
    
    return projector.computeProjection(
			this.get("graphLayout.autoCenter") ? this.get("filteredBase"):this.get("base.lands"),
			w,
			h,
			this.get('graphLayout.width'),
			this.get('graphLayout.height'),
			this.get('graphLayout.margin'),
			this.get('graphLayout.projection')
		);
    
  }.property('graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.margin',
    'graphLayout.projection'),
  
	
	projectAndDraw: function() {
		
		// ===========
		// = VIEWBOX =
		// ===========
		
		var w = Math.max(this.$().width(), this.get('graphLayout.width'));
		var h = Math.max(this.$().height(), this.get('graphLayout.height'));
		
		this.d3l().attr("viewBox", "0 0 "+w+" "+h);
		
		// ===========

		var path = d3.geo.path();
		path.projection(this.get('projection'));
		
		this.d3l().selectAll("g.offset line.horizontal-top")
			.attr("x1", 0)
			.attr("y1", this.get('graphLayout').vOffset(h))
			.attr("x2", w)
			.attr("y2", this.get('graphLayout').vOffset(h))
		  .attr("stroke-width", "1");
			
		this.d3l().selectAll("g.offset line.horizontal-bottom")
			.attr("x1", 0)
			.attr("y1", h - this.get('graphLayout').vOffset(h))
			.attr("x2", w)
			.attr("y2", h - this.get('graphLayout').vOffset(h))
		  .attr("stroke-width", "1");
			
		this.d3l().selectAll("g.offset line.vertical-left")
			.attr("x1", w - this.get('graphLayout').hOffset(w))
			.attr("y1", 0)
			.attr("x2", w - this.get('graphLayout').hOffset(w))
			.attr("y2", h)
		  .attr("stroke-width", "1");
			
		this.d3l().selectAll("g.offset line.vertical-right")
			.attr("x1", this.get('graphLayout').hOffset(w))
			.attr("y1", 0)
			.attr("x2", this.get('graphLayout').hOffset(w))
			.attr("y2", h)
		  .attr("stroke-width", "1");
			
		this.d3l().select("g.margin")
			.attr("transform", "translate("+this.get('graphLayout').hOffset(w)
				+", "+this.get('graphLayout').vOffset(h)+")")
			.selectAll("rect")
			.attr("x", this.get('graphLayout.margin.h'))
			.attr("y", this.get('graphLayout.margin.v'))
			.attr("width", this.get('graphLayout.width') - 2*this.get('graphLayout.margin.h'))
			.attr("height", this.get('graphLayout.height') - 2*this.get('graphLayout.margin.v'))
      .attr("stroke-width", "1")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "1, 3");
		
		let landSel = this.d3l().select("defs")
			.selectAll("path.feature")
			.attr("d", path)
      .data(this.get('base').lands.features);
      
    landSel.enter()
      .append("path")
			.attr("d", path)
      .attr("id", (d) => `f-path-${d.id}`)
			.classed("feature", true);

		landSel.exit().remove();
    
    this.drawLayers();
			
	}.observes('projection', 'graphLayout.virginDisplayed', 'graphLayout.width',
	 'graphLayout.height', 'graphLayout.margin.h',  'graphLayout.margin.v'),
   
  drawLayers: function() {
    
    //TODO : implement multi layer binded to vars
    let self = this,
        vars = [{type: "background"}, {index: 0, type: "quali"}, {index: 1, type: "quanti"}];
    
    let sel = this.d3l().select("g.layers")
      .selectAll("g.layer")
      .data(vars);
      
    sel.enter().append("g")
			.attr("stroke", this.get("graphLayout.stroke"))
      .classed("layer", true);
      
   sel.exit().remove();
   
   sel.each(function(d) {
     if (d.type === "background") {
        self.drawBackgroundLayer(d3.select(this));
     } else {
        self.mapData(d3.select(this), d);
     }
   });
    
  },
  
  drawBackgroundLayer: function(d3Layer) {
    
    var uses = d3Layer
      .selectAll("use.feature")
      .data(this.get('base').lands.features);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style("fill", "#000000")
			.classed("feature", true);
    
  },
	
	mapData: function(d3Layer, variable) {
    
    let geoCol = this.get('data.columns').find( col => col.get('meta.type') === "geo" ),
        varCol = this.get('data.columns').filter( col => col.get('meta.type') === "numeric" )[variable.index];
        
    let data = geoCol.get('cells').map( (cell, index) => {
      
      let match = geoMatch(cell.get('value')),
          val;
          
      if (match && varCol.get('cells').objectAt(index).postProcessedValue() != null) {
        return {
          id: match.value.iso_a2,
          value: varCol.get('cells').objectAt(index).postProcessedValue(),
          land: this.get('base').lands.features.find( f => f.id === match.value.iso_a2),
          centroid: this.get('base').centroids.features.find( f => f.id === match.value.iso_a2)
        };
      }
      
      return undefined;
      
    }).filter( d => d !== undefined );
    
    if (variable.type === "quali") {
      this.mapPath(d3Layer, data);
    } else {
      this.mapPoint(d3Layer, data);
    }
    
  },
  
  mapPath: function(d3Layer, data) {
		
    let scale = this.get('graphLayout.scale');
		
		scale.domain(d3.extent(data, c => c.value));
    scale.range(["#29aadf", "#f9aa0f"]);
    
    var uses = d3Layer
      .selectAll("use.feature")
      .style("fill", d => { return d.value ? scale(d.value) : "#000000"; } )
      .data(data);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style("fill", d => { return d.value != null ? scale(d.value) : "#000000"; } )
			.classed("feature", true);

		uses.exit().remove();
			
	},
  
   mapPoint: function(d3Layer, data) {
		
    let projection = this.get('projection'),
        scale = this.get('graphLayout.scale')
		
		scale.domain(d3.extent(data, c => c.value));
		scale.range([1, 10]);
    
    let centroidSel = d3Layer
			.selectAll("circle.feature")
			.attr("cx", function (d) { return projection(d.centroid.geometry.coordinates)[0]; })
      .attr("cy", function (d) { return projection(d.centroid.geometry.coordinates)[1]; })
      .data(data);
      
    centroidSel.enter()
      .append("circle")
      .attr("cx", function (d) { return projection(d.centroid.geometry.coordinates)[0]; })
      .attr("cy", function (d) { return projection(d.centroid.geometry.coordinates)[1]; })
      .attr("r", d => d.value != null ? scale(d.value): 1)
      .attr("fill", "blue")
			.classed("feature", true);

		centroidSel.exit().remove();
    
	}

	
});
