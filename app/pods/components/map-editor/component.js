import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import d3lper from 'mapp/utils/d3lper';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/geo-match';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import ValueMixin from "mapp/models/mapping/mixins/value";
/* global Em */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'version'],
  classNames: ["map-editor"],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
  
  $width: null,
  $height: null,
	
	base: null,
	
	data: null,
	
	graphLayout: null,
  
  graphLayers: [],
  
  resizeInterval: null,
  
  applicationController: null,
  
  windowLocation: function() {
    return window.location;
  }.property(),
  
  init() {
    this._super();
  },
  
	draw: function() {
    
		var d3g = this.d3l();
    
    d3g.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
		
		// ========
		// = DEFS =
		// ========
		
		let defs = d3g.append("defs");
    
    defs.append("path")
      .attr("id", "sphere");
      
   defs.append("path")
      .attr("id", "grid");

    defs.append("clipPath")
      .attr("id", "clip")
      .append("use");
    
		// ---------
		
    // HANDLE RESIZE
    let $size = () => {
      let $width = this.$().parent().width(),
          $height = this.$().parent().height();
      
      if ($width != this.get('$width') || $height != this.get('$height')) {
        this.setProperties({
          '$width': this.$().parent().width(),
          '$height': this.$().parent().height()
        });
      }
    };
    this.set('resizeInterval', setInterval($size, 500));
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
      
    d3g.append("g")
			.classed("legend", true);
    
    // DRAG & ZOOM
    
    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", () => {
        let rz =  Math.round(d3.event.scale * 4) / 4;
        if (rz != this.get('graphLayout.zoom')) {
          this.set('graphLayout.zoom',rz);
          this.sendAction('onAskVersioning', "freeze");
        }
      })
      .scale(this.get('graphLayout.zoom'));
      
    this.addObserver('graphLayout.zoom', () => zoom.scale(this.get('graphLayout.zoom')) );

    var drag = d3.behavior.drag()
      .origin(() => {
        return {x: mapG.attr('tx'), y: mapG.attr('ty')};
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
          tx: pos.tx,
          ty: pos.ty
        });
      })
      .on("dragend", () => {
        mapG.classed("dragging", false);
        this.get('graphLayout').setProperties({
          tx: mapG.attr('tx'),
          ty: mapG.attr('ty')
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

    this.updateMargins();
		this.projectAndDraw();
    this.updatePosition();
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
      .attr("tx", this.get('graphLayout.tx'))
      .attr("ty", this.get('graphLayout.ty'))
      .attr("transform", d3lper.translate({tx: this.get('graphLayout.tx'), ty: this.get('graphLayout.ty')}));
    
  }.observes('graphLayout.tx', 'graphLayout.ty'),
  
  updateMargins: function() {
    
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
			.attr("x1", this.get('graphLayout').hOffset(w))
			.attr("y1", 0)
			.attr("x2", this.get('graphLayout').hOffset(w))
			.attr("y2", h)
		  .attr("stroke-width", "1");
      
		this.d3l().selectAll("g.offset line.vertical-right")
			.attr("x1", w - this.get('graphLayout').hOffset(w))
			.attr("y1", 0)
			.attr("x2", w - this.get('graphLayout').hOffset(w))
			.attr("y2", h)
		  .attr("stroke-width", "1");
		
		this.d3l().select("g.margin")
			.attr("transform", "translate("+this.get('graphLayout').hOffset(w)
				+", "+this.get('graphLayout').vOffset(h)+")")
			.selectAll("rect")
			.attr("x", this.get('graphLayout.margin.l'))
			.attr("y", this.get('graphLayout.margin.t'))
			.attr("width", this.get('graphLayout.width') - this.get('graphLayout.margin.h'))
			.attr("height", this.get('graphLayout.height') - this.get('graphLayout.margin.v'))
      .attr("stroke-width", "1")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "1, 3");
      
      this.drawLegend();
    
  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'graphLayout.margin.h',  'graphLayout.margin.v'),
  
  projection: function() {
    
    var w = Math.max(this.get('$width'), this.get('graphLayout.width'));
		var h = Math.max(this.get('$height'), this.get('graphLayout.height'));
    
    return projector.computeProjection(
			this.get("graphLayout.autoCenter") ? this.get("filteredBase"):null,
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
    'graphLayout.projection._defferedChangeIndicator'),
  
	
	projectAndDraw: function() {
    
    var path = d3.geo.path();
		path.projection(this.get('projection'));
		
    let defs = this.d3l().select("defs");
    
    defs.select("#sphere")
      .datum({type: "Sphere"})
      .attr("d", path);
    
    defs.select("#grid")
      .datum(d3.geo.graticule())
      .attr("d", path);

    defs.select("#clip use")
      .attr("xlink:href", `${window.location}#sphere`);
      
		let landSel = defs
			.selectAll("path.feature")
			.attr("d", path)
      .attr("clip-path", `url(${window.location}#clip)`)
      .data(this.get('base').lands.features);
      
    landSel.enter()
      .append("path")
			.attr("d", path)
      .attr("id", (d) => `f-path-${d.id}`)
      .attr("clip-path", `url(${window.location}#clip)`)
			.classed("feature", true);

		landSel.exit().remove();
    
    this.drawGrid();
    this.drawBackmap();
    this.drawLayers();
			
	}.observes('windowLocation', 'projection', 'graphLayout.virginDisplayed'),
   
   drawGrid: function() {
     
     let sphere = this.d3l().select("g.backmap")
      .selectAll("use.sphere");
    
    if (sphere.empty()) {
      sphere = this.d3l().select("g.backmap").append("use")
        .style({
          "fill": "none",
          "stroke": this.get('graphLayout.gridColor')
        })
        .classed("sphere", true);
        
    }
    
    sphere.attr({
      "xlink:href": `${window.location}#sphere`,
    }).style({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    });
    
    let grid = this.d3l().select("g.backmap")
      .selectAll("use.grid");
    
    if (grid.empty()) {
      grid = this.d3l().select("g.backmap").append("use")
        .style({
          "fill": "none",
          "stroke": this.get('graphLayout.gridColor')
        })
        .classed("grid", true);
        
    }
    
    grid.attr({
      "xlink:href": `${window.location}#grid`,
    }).style({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    });
     
   }.observes('graphLayout.gridColor', 'graphLayout.showGrid'),
   
   drawBackmap: function() {
     
    let bindAttr = (_) => {
      _.attr({
        "xlink:xlink:href": d => `${window.location}#f-path-${d.id}`,
      })
      .style({
        "fill": this.get('graphLayout.backMapColor'),
        "stroke-width": this.get("graphLayout.strokeWidth"),
        "stroke": this.get("graphLayout.stroke")
      });
    };
    
    var uses = this.d3l().select("g.backmap")
      .selectAll("use.feature")
      .data(this.get('base').lands.features)
      .call(bindAttr);
      
    uses.enter().append("use")
			.classed("feature", true)
      .call(bindAttr);
      
    uses.exit().remove();
      
  }.observes('graphLayout.backMapColor'),
  
  drawLayers: function() {
    
    let self = this,
        data = this.get('graphLayers')
          .filter( gl => gl.get('displayable') )
          .reverse();
          
    let bindAttr = (_) => {
      _.attr("stroke-width", d => d.get("mapping.visualization.stroke"))
       .style("opacity", d => d.get('opacity'));
    };
    
    let sel = this.d3l().select("g.layers")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();
    
    sel.each(function(d, index) {
      d.index = index;
      self.mapData(d3.select(this), d);
    });
    
  }.observes('graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
	mapData: function(d3Layer, graphLayer) {
    
    let geoDef = graphLayer.get('mapping.geoDef'),
        varCol = graphLayer.get('mapping.varCol'),
        data = [];
    
    if (geoDef.get('isGeoRef')) {
      
      data = varCol.get('body').map( (cell, index) => {
        
        let geoData = geoDef.get('geo').get('body').objectAt(index).get('postProcessedValue'),
            val = cell.get('postProcessedValue');
        if (geoData) {
          return {
            id: geoData.value.iso_a2,
            value: val,
            cell: cell,
            index: index,
            surface: this.get('base').lands.features.find( f => f.id === geoData.value.iso_a2),
            point: this.get('base').centroids.features.find( f => f.id === geoData.value.iso_a2)
          };
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );
      
      
      if (graphLayer.get('mapping.visualization.type') === "surface") {
        this.mapSurface(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      }
      
    } else if (geoDef.get('isLatLon')) {
      
      data = varCol.get('body').map( (cell, index) => {
        
        let val = cell.get('postProcessedValue'),
            lon = geoDef.get('lon').get('body').objectAt(index).get('postProcessedValue'),
            lat = geoDef.get('lat').get('body').objectAt(index).get('postProcessedValue');
        
        if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          return {
            id: `coord-${index}`,
            value: val,
            cell: cell,
            index: index,
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
      
      if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      }
      
    }
    
  },
  
  mapSurface: function(d3Layer, data, graphLayer) {
    
    let svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn();
		
    let bindAttr = (_) => {
      
      _.attr({
          "xlink:xlink:href": d => `${window.location}#f-path-${d.id}`,
          "stroke-width": this.get("graphLayout.strokeWidth"),
          "stroke": this.get("graphLayout.stroke"),
          "mask": d => {
            let mask = converter(d.cell, "texture");
          
            if (mask && mask.fn != PatternMaker.NONE) {
              svg.call(mask.fn);
              return `url(${mask.fn.url()})`;
            } else {
              return null;
            }
          }
        })
        .style({
          "fill": d => converter(d.cell, "fill")
        });
      
    };
      
    let sel = d3Layer.selectAll(".feature")
      .data(data)
      .call(bindAttr);
    
    sel.enter()
      .append("use")
      .classed("feature", true)
      .call(bindAttr);

		sel.exit().remove();
			
	},
  
  
   mapSymbol: function(d3Layer, data, graphLayer) {
		
    let projection = this.get('projection'),
        svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn(),
        sortedData = data.sort((a, b) => d3.descending(converter(a.cell, "size"), converter(b.cell, "size")));
		
    let shapeFn = function(d) {
      
      let _ = d3.select(this),
          shape = converter(d.cell, "shape"),
          r = converter(d.cell, "size"),
          fill = converter(d.cell, "fill"),
          strokeColor = converter(d.cell, "strokeColor");
          
      if (shape) {
        
        let symbol = SymbolMaker.symbol({name: shape});
      
        symbol.call(svg);
      
        let el = _.append("use").attr("xlink:href", symbol.url());
        
        if (shape === "bar") {
          
          el.attr({
              "width": mapping.get('visualization.minSize'),
              "height": r*r,
              "x": -mapping.get('visualization.minSize') / 2,
              "y": -r*r
            });
          
        } else {
          
            el.attr({
              "width": r*2,
              "height": r*2,
              "x": d => -r,
              "y": d => -r,
              "stroke-width": symbol.scale(mapping.get('visualization.stroke'), r*2)
            });
            
        }
        
        el.attr({
            "fill": fill,
            "stroke": strokeColor
          })
          .classed("shape", true);
          
      }
      
    };
    
   let bindAttr = (_) => {
     
      _.attr("transform", d => d3lper.translate({
        tx: projection(d.point.geometry.coordinates)[0],
        ty: projection(d.point.geometry.coordinates)[1]
      }));
      
      _.selectAll(".shape").remove();
      
      _.each(shapeFn);
      
    };
    
    let centroidSel = d3Layer
			.selectAll("g.feature")
      .data(sortedData)
      .call(bindAttr);
      
    centroidSel.enter()
      .append("g")
			.classed("feature", true)
      .call(bindAttr);
      
    centroidSel.order().exit().remove();

	},
  
  drawLegend: function() {
    
    let svg = this.d3l(),
        w = Math.max(this.get('$width'), this.get('graphLayout.width')),
		    h = Math.max(this.get('$height'), this.get('graphLayout.height')),
        padding = 2,
        width = (w - 2*this.get('graphLayout').hOffset(w)) / 2;
    
    let sel = this.d3l().selectAll("g.legend")
      .attr("transform", d3lper.translate({tx: (w - width) / 2, ty: h - 300}))
      .style({
        opacity: this.get('graphLayout.showLegend') ? 0.9 : 0
      });
    
    
    let container = sel.append("g")
      .attr("flow-css", "flow: horizontal; padding-left: 5; height: 500; width: "+width);
      
    container.append("rect")
        .attr({
          "flow-css": "layout: fill",
          "x": 0,
          "y": 0
        })
        .attr("fill", "white");
    
    let bindLayer = (_) => {
      
      _.attr("flow-css", "flow: vertical; stretch: true; layout: fluid; margin-top: 16");
      
      _.each( function(d, i) {
        
        if (!d.get('displayable')) {
          return;
        }
        
        let el = d3.select(this),
            label = el.selectAll("text.title");
        
        if (label.empty()) {
          label = el.append("g")
            .attr("flow-css", "margin-bottom: 10")
            .append("text")
            .classed("title", true);
        }
        
        label.text(d.get('mapping.varCol.header.value'));
          
        let appendSurfaceIntervalLabel = function(val, i) {
          
          let formatter = d3.format("0.2f"),
              r = 17/2
          
          d3.select(this).append("rect")
            .attr({
              y: -r,
              "width": 25,
              "height": 2*r,
              "fill": d.get('mapping').getScaleOf('color')(val - 0.0000001),
              "mask": () => {
                
                let mask = d.get('mapping').getScaleOf("texture")(val - 0.0000001)
                if (mask && mask.fn != PatternMaker.NONE) {
                  svg.call(mask.fn);
                  return `url(${mask.fn.url()})`;
                } else {
                  return null;
                }
              },
              stroke: "#F0F0F0"
            });
            
          let g = d3.select(this).append("g");
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: -10,
              y1: -(r + 2),
              x2: 5,
              y2: -(r + 2),
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: 10,
                y:  -(r + 2),
                "font-size": "0.75em"
              });
            
          }
          
          g.append("line").attr({
              x1: -10,
              y1: r + 2,
              x2: 5,
              y2: r + 2,
              stroke: "black"
            });
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: 10,
              y: r + 2,
              "font-size": "0.75em"
            });
          
        };
        
        let appendSymbolIntervalLabel = function(val, i) {
          
          let formatter = d3.format("0.2f"),
              r = d.get('mapping').getScaleOf('size')(val - 0.0000001);
          
          let symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});
      
          symbol.call(svg);
          
          d3.select(this).append("use")
            .attr({
              "xlink:href": symbol.url(),
              "width": r*2,
              "height": r*2,
              "x": d => -r,
              "y": d => -r,
              "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r*2),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.0000001)
            });
            
          let g = d3.select(this).append("g");
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: -10,
              y1: -(r + 2),
              x2: 5,
              y2: -(r + 2),
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: 10,
                y: -(r + 2),
                "font-size": "0.75em"
              });
            
          }
          
          g.append("line").attr({
              x1: -10,
              y1: r + 2,
              x2: 5,
              y2: r + 2,
              stroke: "black"
            });
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: 10,
              y: r + 2,
              "font-size": "0.75em"
            });
          
        };
        
        let appendRuleLabel = function(rule, i) {
          
          let r;
          
          if (d.get('mapping.visualization.type') === "symbol") {
            
            r = d.get('mapping.visualization.minSize');
            let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape');
            
            let symbol = SymbolMaker.symbol({name: shape});
      
            symbol.call(svg);
            
            d3.select(this).append("use")
              .attr({
                "xlink:href": symbol.url(),
                "width": r*2,
                "height": r*2,
                "x": d => -r,
                "y": d => -r,
                "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r*2),
                "stroke": rule.get('strokeColor'),
                "fill": rule.get('color')
              });
              
          } else {
            
            r = 17/2;
            
            let mask = rule.get('pattern') ? PatternMaker.Composer.build(rule.get('pattern')) : null;
            if (mask && mask.fn != PatternMaker.NONE) {
              svg.call(mask.fn);
            }
            
            d3.select(this).append("rect")
              .attr({
                y: -r,
                "width": 25,
                "height": 2*r,
                "fill": rule.get('color'),
                "mask": mask ? `url(${mask.fn.url()})` : null
              });
            
          }
          
          let g = d3.select(this).append("g");
          
          g.append("line").attr({
              x1: -10,
              y1: 0,
              x2: 5,
              y2: 0,
              stroke: "black"
            });
          
          g.append("text")
            .text( rule.get('label') )
            .attr({
              x: 10,
              y: 0,
              "font-size": "0.75em"
            })
          
        };
        
        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice();
          intervals.push(d.get('mapping.extent')[1]); //push max
          
          let sel = el.selectAll("g.interval")
            .each(ValueMixin.Surface.detect(d.get('mapping')) ? appendSurfaceIntervalLabel : appendSymbolIntervalLabel)
            .data(intervals);
            
          sel.enter()
            .append("g")
            .classed("interval", true)
            .attr("flow-css", "flow: horizontal; stretch: true;")
            .each(ValueMixin.Surface.detect(d.get('mapping')) ? appendSurfaceIntervalLabel : appendSymbolIntervalLabel);
          
          sel.exit().remove();
          
          if (d.get('mapping.rules')) {
            
            el.append("g")
              .attr("flow-css", "margin-top: 5; margin-bottom: 20")
              .append("line")
                .attr({
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  stroke: "#BBBBBB"
                });
            
          }
          
        }
        
        if (d.get('mapping.rules')) {
          
          let sel = el.selectAll("g.rule")
            .each(appendRuleLabel)
            .data(d.get('mapping.rules').filter( r => r.get('visible') ).slice(0, 10));
            
          sel.enter()
            .append("g")
            .classed("rule", true)
            .attr("flow-css", (r, i) => `flow: horizontal; stretch: true; margin-top: ${ i > 0 ? 4 : 0 }` )
            .each(appendRuleLabel);
            
          sel.exit().remove();
          
        }
        
      });
      
    };
    
    sel = container.selectAll("g.legend-label")
      .data(this.get('graphLayers'))
      .call(bindLayer);
      
    sel.enter()
      .append("g")
      .classed("legend-label", true)
      .call(bindLayer);
      
    sel.exit().remove();
    
    container.call(d3lper.flow);
    
    //this.test();
    
  }.observes('graphLayout.showLegend', 'graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
  test() {
    
    let parent = this.d3l().append("g")
      .attr("flow-css", "flow: vertical; width: 100; height: 150");
    
    for (let i = 0; i < 10; i++) {
      let w = Math.sqrt(i) * 100
      let g = parent.append("g")
        .attr("flow-css", `flow: horizontal; width: ${w}; height: 50`);
        
      let col1 = g.append("g")
        .attr("flow-css", "flow: horizontal; layout: fluid; stretch: 1; padding-top: 15px");
        
      let col2 = g.append("g")
        .attr("flow-css", "flow: horizontal; layout: fluid; stretch: 1; padding-top: 15px");
        
      col1.append("rect")
        .attr("fill", "red")
        .attr("flow-css", "layout: fluid; height: 50px; stretch: 1");
        
      col2.append("rect")
        .attr("fill", "blue")
        .attr("flow-css", "layout: fluid; stretch: 1");
        
    }
   
   parent.call(d3lper.flow);  
    
  }
  
  
  /*drawText: function() {
      
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
      
  }*/

	
});
