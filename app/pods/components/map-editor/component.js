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
  
  $width: null,
  $height: null,
	
	base: null,
	
	data: null,
	
	graphLayout: null,
  
  graphLayers: [],

	draw: function() {
    
		var d3g = this.d3l();
		
		// ========
		// = DEFS =
		// ========
		
		d3g.append("defs");
			
		// ---------
		
    // HANDLE RESIZE
    let $size = () => {
      this.setProperties({
        '$width': this.$().width(),
        '$height': this.$().height()
      });
    };
    setInterval($size.bind(this), 800);
    $size();
    // ---------
		
		d3g.append("rect")
			.classed("bg", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", this.get("graphLayout.backgroundColor"));
		
    d3g.append("g")
			.classed("backmap", true);
    	
		d3g.append("g")
			.classed("layers", true);
			
		let og = d3g.append("g")
			.classed("offset", true);
			
		og.append("line").classed("horizontal-top", true);
		og.append("line").classed("horizontal-bottom", true);
		og.append("line").classed("vertical-left", true);
		og.append("line").classed("vertical-right", true);
		
		let mg = d3g.append("g")
			.classed("margin", true);
			
		mg.append("rect")
			.attr("fill", "none");

		this.projectAndDraw();
		this.updateColors();

          
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
	
	updateStroke: function() {
		
		var d3g = this.d3l();
		
		d3g.selectAll("path.feature")
			.attr("stroke-width", this.get("graphLayout.strokeWidth"));
		
	}.observes('graphLayout.strokeWidth'),
  
  projection: function() {
    
    var w = Math.max(this.get('$width'), this.get('graphLayout.width'));
		var h = Math.max(this.get('$height'), this.get('graphLayout.height'));
    
    return projector.computeProjection(
			this.get("graphLayout.autoCenter") ? this.get("filteredBase"):this.get("base.lands"),
			w,
			h,
			this.get('graphLayout.width'),
			this.get('graphLayout.height'),
			this.get('graphLayout.margin'),
			this.get('graphLayout.projection')
		);
    
  }.property('$width', '$height', 'graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.margin',
    'graphLayout.projection'),
  
	
	projectAndDraw: function() {
		
		// ===========
		// = VIEWBOX =
		// ===========
		
		var w = Math.max(this.get('$width'), this.get('graphLayout.width'));
		var h = Math.max(this.get('$height'), this.get('graphLayout.height'));
		
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
    
    this.drawBackmap();
    this.drawLayers();
			
	}.observes('projection', 'graphLayout.virginDisplayed', 'graphLayout.width',
	 'graphLayout.height', 'graphLayout.margin.h',  'graphLayout.margin.v'),
   
   drawBackmap: function() {
    
    var uses = this.d3l().select("g.backmap")
      .selectAll("use.feature")
      .data(this.get('base').lands.features);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style("fill", "none")
			.classed("feature", true);
    
  },
   
  drawLayers: function() {
    
    let self = this,
        data = this.get('graphLayers')
          .filter( gl => gl.get('varCol') )
          .sort( (a,b) => a.get('type') === "surface" ? -1:1 );
    
    let sel = this.d3l().select("g.layers")
      .selectAll("g.layer")
      .data(data);
    
    sel.enter().append("g")
      .attr("stroke", this.get("graphLayout.stroke"))
      .classed("layer", true);
    
    sel.exit().remove();
    
    sel.each(function(d) {
      self.mapData(d3.select(this), d);
    });
    
  }.observes('graphLayers.[]', 'graphLayers.@each.type', 'graphLayers.@each.changeIndicator'),
  
	mapData: function(d3Layer, graphLayer) {
    
    let geoCols = graphLayer.get('geoCols'),
        varCol = graphLayer.get('varCol'),
        data = [];
        
    if (geoCols.length === 1) {
      
      data = varCol.get('cells').map( (cell, index) => {
        
        
        let match = geoMatch(geoCols[0].get('cells').objectAt(index).postProcessedValue()),
            val = cell.postProcessedValue();
        if (!cell.get('row.header') && match && val != null) {
          return {
            id: match.value.iso_a2,
            value: val,
            surface: this.get('base').lands.features.find( f => f.id === match.value.iso_a2),
            point: this.get('base').centroids.features.find( f => f.id === match.value.iso_a2)
          };
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );
      
      if (graphLayer.type === "surface") {
        this.mapPath(d3Layer, data, graphLayer);
      } else if (graphLayer.type === "shape") {
        this.mapShape(d3Layer, data, graphLayer);
      }
      
    } else if (geoCols.length === 2 && geoCols[0] && geoCols[1]) {
      
      data = varCol.get('cells').map( (cell, index) => {
        
        let val = cell.postProcessedValue(),
            lon = geoCols[0].get('cells').objectAt(index).postProcessedValue(),
            lat = geoCols[1].get('cells').objectAt(index).postProcessedValue();
        
        if (!cell.get('row.header') 
          && val != null 
          && !Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          return {
            id: `coord-${index}`,
            value: val,
            surface: null,
            point: {
              geometry: {
                coordinates: [
                  lon,
                  lat
                ]
              }
            }
          };
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );
      
      this.mapShape(d3Layer, data, graphLayer);
      
    }
    
  },
  
  mapPath: function(d3Layer, data, graphLayer) {
		
    let scale = d3.scale.linear();
		
		scale.domain(d3.extent(data, c => c.value));
    scale.range(["#29aadf", "#f9aa0f"]);
    
    d3Layer.selectAll("*").remove();
      
    let uses = d3Layer.selectAll(".feature")
      .data(data);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style("fill", d => { return d.value != null ? scale(d.value) : "none"; } )
			.classed("feature", true);

		uses.exit().remove();
			
	},
  
   mapShape: function(d3Layer, data, graphLayer) {
		
    let projection = this.get('projection'),
        scale = d3.scale[graphLayer.scaleType()]();
		
		scale.domain(d3.extent(data, c => c.value));
    
    console.log(scale.domain());
    
    d3Layer.selectAll("*").remove();
    
    data.forEach( d => console.log(d.point.geometry.coordinates) );
    
    let centroidSel = d3Layer
			.selectAll(".feature")
			.attr("cx", d => projection(d.point.geometry.coordinates)[0] )
      .attr("cy", d => projection(d.point.geometry.coordinates)[1] )
      .data(data);
      
    let shape = centroidSel.enter()
      .append("circle")
			.classed("feature", true)
      .attr("cx", d => projection(d.point.geometry.coordinates)[0] )
      .attr("cy", d => projection(d.point.geometry.coordinates)[1] );
      
    if (graphLayer.get('representation.scaleOf') === "size") {
      scale.range([4, 10]);
      shape.attr("r", d => d.value != null ? scale(d.value): 1)
        .attr("fill", graphLayer.get('representation.fill'));
    } else if (graphLayer.get('representation.scaleOf') === "fill") {
      scale.range(["#29aadf", "#f9aa0f"]);
      shape.attr("r", graphLayer.get('representation.size'))
        .attr("fill", d => d.value != null ? scale(d.value): "none");
    }

		centroidSel.exit().remove();
    
	}

	
});
