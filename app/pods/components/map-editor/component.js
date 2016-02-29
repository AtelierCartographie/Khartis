import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/world-dictionary';
/* global Em */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['height', 'width', 'xmlns', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
	
	base: null,
	
	data: null,
	
	graphLayout: null,
  
	filteredBase: function() {
		
		var self = this;
		
		var ret = Ember.Object.create(this.get("base"));
		
    if (this.get('data')) {
      
      ret.set('features', this.get("base.features").filter(function(item, i) {
        
        return self.get("data.rows").objectAt(i).values[0] != null;
        
      }));
      
    }
		
		return ret;
			
		
	}.property("base", "data"),

	draw: function() {
    
    console.log(this.get('graphLayout'));
		
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

          
	}.observes("base").on("didInsertElement"),
	
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
	
	projectAndDraw: function() {
		
		var base = this.get("graphLayout.virginDisplayed") ? this.get("base"):this.get("filteredBase");
	
		// ===========
		// = VIEWBOX =
		// ===========
		
		var w = Math.max(this.$().width(), this.get('graphLayout.width'));
		var h = Math.max(this.$().height(), this.get('graphLayout.height'));
		
		this.d3l().attr("viewBox", "0 0 "+w+" "+h);
		
		// ===========

		var path = d3.geo.path();
		
		var projection = projector.computeProjection(
			this.get("graphLayout.autoCenter") ? this.get("filteredBase"):this.get("base"),
			w,
			h,
			this.get('graphLayout.width'),
			this.get('graphLayout.height'),
			this.get('graphLayout.margin'),
			this.get('graphLayout.projection')
      
		);

		path.projection(projection);
		
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
		
		var pathSelection = this.d3l().select("defs")
			.selectAll("path.feature")
			.attr("d", path)
      .data(base.features);
      
    pathSelection.enter().append("path")
			.classed("feature", true)
      .attr("id", (d) => `f_${d.id}`)
			.attr("d", path);

		pathSelection.exit().remove();
			
		//var textSelection = this.d3l().select("g.geo")
		//	.selectAll("text")
		//	.attr("transform", function(d) {
		//	
		//		var centroid = path.centroid(d);
		//		return d3lper.translate(centroid[0], centroid[1]);
		//	
		//	})
        //	.data(base.features);
		//	
		//textSelection.enter().append("text")
		//	.text(function(d) { return d.properties.code_dept; })
		//	.attr("text-anchor", "middle")
		//	.attr("transform", function(d) {
        //
		//		var centroid = path.centroid(d);
		//		return d3lper.translate(centroid[0], centroid[1]);
        //
		//	});
        //
		//textSelection.exit().remove();
			
    this.drawLayers();
		this.mapData();
			
	}.observes('graphLayout.projection', 'graphLayout.autoCenter', 'graphLayout.virginDisplayed', 'graphLayout.width',
	 'graphLayout.height', 'graphLayout.margin.h',  'graphLayout.margin.v'),
   
  drawLayers: function() {
    
    //TODO : implement multi layer
    this.d3l().select("g.layers")
      .append("g")
			.attr("stroke", this.get("graphLayout.stroke"))
      .classed("layer", true);
    
  },
	
	mapData: function() {
		
		var self = this;
		
		var scale = this.get('graphLayout.scale');
    
    let geoCol = this.get('data.columns').find( col => col.get('meta.type') === "geo" ),
        varCol = this.get('data.columns').filter( col => col.get('meta.type') === "numeric" )[0];
		
		scale.domain(d3.extent(varCol.get('cells'), (c) => parseFloat(c.postProcessedValue()) ));
		scale.range(["#29aadf", "#f9aa0f"]);
    
    let data = geoCol.get('cells').map( (cell, index) => {
      
      let match = geoMatch(cell.get('value')),
          val;
          
      if (match) {
        val = varCol.get('cells').objectAt(index).postProcessedValue();
        return {
          id: match.value.iso_a2,
          color: scale(val)
        };
      }
      
      return false;
      
    }).filter( d => d !== false );
    
    var uses = this.d3l()
      .selectAll("g.layers g.layer")
      .selectAll("use.feature")
      .style("fill", (d) => d.color )
      .data(data);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", (d) => `#f_${d.id}`)
      .attr("fill", (d) => d.color )
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
			.classed("feature", true);

		uses.exit().remove();
			
	}.observes("data.rows.@each.values")

	
});
