import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import d3lper from 'mapp/utils/d3lper';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/world-dictionary';
import MaskPattern from 'mapp/utils/mask-pattern';
/* global Em */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'xmlns:xlink', 'version'],
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
  
  resizeInterval: null,
  
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
        '$width': this.$().parent().width(),
        '$height': this.$().parent().height()
      });
    };
    this.set('resizeInterval', setInterval($size, 600));
    $size();
    // ---------
    
		d3g.append("rect")
			.classed("bg", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", this.get("graphLayout.backgroundColor"));
		
    let mapG = d3g.append("g")
      .classed("map", true);
    
    mapG.append("g")
			.classed("backmap", true);
    	
		mapG.append("g")
			.classed("layers", true);
    
    // DRAG & ZOOM
    
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom", () => {
        let rz =  Math.round(d3.event.scale * 2) / 2;
        if (rz != this.get('graphLayout.zoom')) {
          this.set('graphLayout.zoom',rz);
          this.sendAction('onAskVersioning', "freeze");
        }
      })
      .scale(this.get('graphLayout.zoom'));

    var drag = d3.behavior.drag()
      .origin(() => {
        return {x: mapG.attr('x'), y: mapG.attr('y')};
      })
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        mapG.classed("dragging", true);
      })
      .on("drag", () => {
        let bbox = mapG.node().getBBox(),
            pos = {
              tx: Math.min(bbox.width, Math.max(d3.event.x, -bbox.width)),
              ty: Math.min(bbox.height, Math.max(d3.event.y, -bbox.height))
            };
        mapG.attr({
         'transform': d3lper.translate({tx: pos.tx, ty: pos.ty}), 
          x: pos.tx,
          y: pos.ty
        });
      })
      .on("dragend", () => {
        mapG.classed("dragging", false);
        this.get('graphLayout').setProperties({
          tx: mapG.attr('x'),
          ty: mapG.attr('y')
        });
        this.sendAction('onAskVersioning', "freeze");
      });
      
    d3g.call(drag);
    d3g.call(zoom);
    	
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

    this.updatePosition();
		this.projectAndDraw();
		this.updateColors();
          
	}.on("didInsertElement"),
  
  cleanup: function() {
    clearInterval(this.get('resizeInterval'));
  }.on("willDestroyElement"),
	
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
  
  updatePosition: function() {
    
    this.d3l().select(".map")
      .attr("x", this.get('graphLayout.tx'))
      .attr("y", this.get('graphLayout.ty'))
      .attr("transform", d3lper.translate({tx: this.get('graphLayout.tx'), ty: this.get('graphLayout.ty')}));
    
  }.observes('graphLayout.tx', 'graphLayout.ty'),
  
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
      this.get('graphLayout.zoom'),
			this.get('graphLayout.projection')
		);
    
  }.property('$width', '$height', 'graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.zoom', 'graphLayout.margin',
    'graphLayout.projection'),
  
	
	projectAndDraw: function() {
    
    var path = d3.geo.path();
		path.projection(this.get('projection'));
		
		// ===========
		// = VIEWBOX =
		// ===========
		
		var w = Math.max(this.get('$width'), this.get('graphLayout.width'));
		var h = Math.max(this.get('$height'), this.get('graphLayout.height'));
		
		this.d3l().attr("viewBox", "0 0 "+w+" "+h);
		// ===========
		
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
      .style("fill", this.get('graphLayout.backMapColor'))
      .data(this.get('base').lands.features);
      
    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style("fill", this.get('graphLayout.backMapColor'))
			.classed("feature", true);
    
  }.observes('graphLayout.backMapColor'),
  
  drawLayers: function() {
    
    let self = this,
        data = this.get('graphLayers')
          .filter( gl => gl.get('visible') && gl.get('varCol') )
          .sort( (a,b) => a.get('mappedToShape') ? (a.get('mappedToText') ? 1:-1):-1 );
    
    let sel = this.d3l().select("g.layers")
      .selectAll("g.layer")
      .data(data);
    
    sel.enter().append("g")
      .attr("stroke", this.get("graphLayout.stroke"))
      .classed("layer", true);
    
    sel.exit().remove();
    
    sel.each(function(d, index) {
      d.index = index;
      self.mapData(d3.select(this), d);
    });
    
  }.observes('graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
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
            index: index,
            surface: this.get('base').lands.features.find( f => f.id === match.value.iso_a2),
            point: this.get('base').centroids.features.find( f => f.id === match.value.iso_a2)
          };
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );
      
      if (graphLayer.get('mappedToSurface')) {
        this.mapPath(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mappedToShape')) {
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
            index: index,
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
		
    let scale = scale = d3.scale[graphLayer.scaleType()]();
		
		scale.domain(d3.extent(data, c => c.value));
    scale.range([graphLayer.get('mapping.color'), "#f9aa0f"]);
    
    d3Layer.selectAll("*").remove();
      
    let uses = d3Layer.selectAll(".feature")
      .data(data);
    
    let maskUrl = "none";
    if (!(graphLayer.get('mapping.pattern') === "solid")) {
      
      let t = MaskPattern.lines({
        orientation: [ graphLayer.get('mapping.pattern')  ]
      });
      this.d3l().call(t);
      maskUrl = `url(${t.url()})`;
      
    }

    uses.enter().append("use")
      .attr("xlink:xlink:href", d => `${window.location}#f-path-${d.id}`)
			.attr("stroke-width", this.get("graphLayout.strokeWidth"))
			.attr("stroke", this.get("graphLayout.stroke"))
      .style({
        "fill": d => { return d.value != null ? scale(d.value) : "none"; },
        "mask": maskUrl
      })
			.classed("feature", true);

		uses.exit().remove();
			
	},
  
   mapShape: function(d3Layer, data, graphLayer) {
		
    let projection = this.get('projection'),
        scale = d3.scale[graphLayer.scaleType()]();
		
		scale.domain(d3.extent(data, c => c.value));
    
    d3Layer.selectAll("*").remove();
    
    let centroidSel = d3Layer
			.selectAll(".feature")
			.attr("transform", d => d3lper.translate({
        tx: projection(d.point.geometry.coordinates)[0],
        ty: projection(d.point.geometry.coordinates)[1]
      }))
      .data(data);
      
    let g = centroidSel.enter()
      .append("g")
			.classed("feature", true)
      .attr("transform", d => d3lper.translate({
        tx: projection(d.point.geometry.coordinates)[0],
        ty: projection(d.point.geometry.coordinates)[1]
      }));
    
    let shape,
        sizeFn,
        colorFn;
        
    if (graphLayer.get('mapping.shape') === "point") {
      
      shape = g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0);
        
      sizeFn = function(calc) {
        return function() {
          this.attr("r", d => calc(d.value));
        };
      };
      
      colorFn = function(calc) {
        return function() {
          this.attr("fill", d => calc(d.value));
        };
      };
      
    } else if (graphLayer.get('mapping.shape') === "rect") {
      
      shape = g.append("rect");
      sizeFn = function(calc) {
         return function() {
            let size = d => calc(d.value)*2,
                shift = d => -calc(d.value);
            this.attr({
              width: size,
              height: size,
              x: shift,
              y: shift
            });
         };
      };
      
      colorFn = function(calc) {
        return function() {
          this.attr("fill", d => calc(d.value));
        };
      };
      
    } else if (graphLayer.get('mapping.shape') === "text") {
      
      shape = g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-weight", "lighter")
        .text( (d) => graphLayer.get('mapping').labelAtIndex(d.index) );
        
      sizeFn = function(calc) {
         return function() {
            let size = d => calc(d.value);
            this.attr({
              "font-size": size
            });
         };
      };
      
      colorFn = function(calc) {
        return function() {
          this.attr({
            "fill": d => calc(d.value),
            "stroke": d => calc(d.value)
          });
        };
      };
      
    }
    
    if (graphLayer.get('mapping.scaleOf') === "size") {
      
      scale.range([graphLayer.get('mapping.size'), graphLayer.get('mapping.size')*2]);
      shape.call(colorFn( v => graphLayer.get('mapping.color') ))
           .call(sizeFn( v => v != null ? scale(v) : 0 ));
           
    } else if (graphLayer.get('mapping.scaleOf') === "fill") {
      
      scale.range([graphLayer.get('mapping.color'), "#f9aa0f"]);
      shape.call(colorFn( v => v != null ? scale(v): "none" ))
           .call(sizeFn( v => graphLayer.get('mapping.size') ));
           
    } else {
      shape.call(colorFn( v => graphLayer.get('mapping.color') ))
           .call(sizeFn( v => graphLayer.get('mapping.size') ));
    }

		centroidSel.exit().remove();
    
	}

	
});
