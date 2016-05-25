import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import d3lper from 'mapp/utils/d3lper';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/geo-match';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import LegendFeature from './legend';
/* global Em */

let landSelSet = new Set();

export default Ember.Component.extend(LegendFeature, {
  
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
  
  title: null,
  
  trueSize: false,
  
  resizeInterval: null,
  
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
    
    let backMap = mapG.append("g")
			.classed("backmap", true);
      
    backMap.append("use")
      .classed("sphere", true);
      
    backMap.append("use")
      .classed("grid", true);
      
    backMap.append("path")
      .classed("land", true);
    	
		mapG.append("g")
			.classed("layers", true);
    
    let bordersMap = mapG.append("g")
      .classed("borders", true);
      
    bordersMap.append("path")
      .classed("borders", true);
      
    bordersMap.append("path")
      .classed("borders-disputed", true);
      
    this.legendInit();
    
    d3g.append("text")
      .classed("title", true);
      
    // DRAG & ZOOM
    
    
    let t = this.get('projection').translate(),
        s = this.get('projection').scale();

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", () => {
        
        let scale = d3.event.scale,
            translate = d3.event.translate;
        
        let _ = this.get('projection').scale() / s,
            __ = scale/_,
            tx = this.get('projection').translate()[0] - t[0] * _,
            ty = this.get('projection').translate()[1] - t[1] * _;

        mapG
          .attr({
            tx: translate[0],
            ty: translate[1],
            s: scale
          })
          .transition().duration(500).ease("cubic-out")
          .attr({
            "transform": `${d3lper.translate({tx: translate[0] - tx*__, ty: translate[1] - ty*__})} scale(${scale/_})`
          })
          .each("end", () => {
            
            mapG.attr("transform", null);
            
            let tx = t[0] * parseFloat(mapG.attr("s")) + parseFloat(mapG.attr("tx")),
                ty = t[1] * parseFloat(mapG.attr("s")) + parseFloat(mapG.attr("ty"));
                
            this.get('projection').translate([tx, ty]).scale(s * parseFloat(mapG.attr("s")));
        
            this.projectAndDraw();
            
          });
       
        /*console.log(d3.event.scale);
        let [tx, ty] = d3.event.translate,
            rz =  Math.round(parseFloat(d3.event.scale) * 2) / 2;
        if (rz != this.get('graphLayout.zoom')) {
          this.get('graphLayout').setProperties({
            tx: tx,
            ty: ty
          });
          //this.set('graphLayout.zoom', rz);
          this.sendAction('onAskVersioning', "freeze");
        }*/
      })
      //.translate(t)
      .scale(this.get('graphLayout.zoom'));
      
    //this.addObserver('graphLayout.zoom', () => zoom.scale(this.get('graphLayout.zoom')) );

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
        /*mapG.attr({
         'transform': d3lper.translate(pos), 
          tx: pos.tx,
          ty: pos.ty
        });*/
      })
      .on("dragend", () => {
        mapG.classed("dragging", false);
        this.get('graphLayout').setProperties({
          tx: mapG.attr('tx'),
          ty: mapG.attr('ty')
        });
        this.sendAction('onAskVersioning', "freeze");
      });
      
    //d3g.call(drag);
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
    this.drawTitle();
		this.projectAndDraw();
    this.updatePosition();
		this.updateColors();
          
	}.on("didInsertElement"),
  
  cleanup: function() {
    clearInterval(this.get('resizeInterval'));
  }.on("willDestroyElement"),
  
  getSize() {
    if (!this.get('trueSize')) {
      return {
        w: Math.max(this.get('$width'), this.get('graphLayout.width')),
        h: Math.max(this.get('$height'), this.get('graphLayout.height'))
      };
    } else {
      return {
        w: this.get('$width'),
        h: this.get('$height')
      };
    }
  },
  
  getViewboxTransform() {
    
    let {w, h} = this.getSize(),
        l = this.get('graphLayout').hOffset(w),
        t = this.get('graphLayout').vOffset(h);
        
    let transform = function({x, y}) {
      
      return {
        x: x - l,
        y: y - t
      };
      
    };
    
    transform.invert = function({x, y}) {
      
      return {
        x: x + l,
        y: y + t
      };
      
    }
    
    return transform;
    
  },
	
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
    
    /*this.d3l().select(".map")
      .attr("tx", this.get('graphLayout.tx'))
      .attr("ty", this.get('graphLayout.ty'))
      .attr("transform", d3lper.translate({tx: this.get('graphLayout.tx'), ty: this.get('graphLayout.ty')}));*/
    
  }.observes('graphLayout.tx', 'graphLayout.ty'),
  
  updateMargins: function() {
    
    // ===========
		// = VIEWBOX =
		// ===========
		
		let {w, h} = this.getSize();
		
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
      
    this.d3l().select("rect.bg")
      .attr({
        x: 0,
        y: 0,
        width: w,
        height: h
      });
      
  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'graphLayout.margin.h',  'graphLayout.margin.v'),
  
  projection: function() {
    
    let {w, h} = this.getSize();
    
    return projector.computeProjection(
			this.get("graphLayout.autoCenter") ? this.get("filteredBase"):null,
			w,
			h,
			this.get('graphLayout.width'),
			this.get('graphLayout.height'),
			this.get('graphLayout.margin'),
      this.get('graphLayout.zoom'),
			this.get('graphLayout.projection'),
      this.get('graphLayout.tx'),
      this.get('graphLayout.ty')
		);
    
  }.property('$width', '$height', 'graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.zoom', 'graphLayout.margin', 'graphLayout.precision',
    'graphLayout.projection._defferedChangeIndicator'),
    
  projectedPath: function() {
    
    let path = d3.geo.path(),
        proj = this.get('projection');
        
    path.projection(proj);
    
    return path;
     
  }.property('projection'),
  
	
	projectAndDraw: function() {
    
    let {w, h} = this.getSize();
    
    let path = this.get('projectedPath'),
        proj = this.get('projection'),
        precision = this.get('graphLayout.precision'),
        defs = this.d3l().select("defs");
    
    defs.select("#sphere")
      .datum({type: "Sphere"})
      .attr("d", path);
    
    defs.select("#grid")
      .datum(d3.geo.graticule())
      .attr("d", path)
      .attr("clip-path", `url(${window.location}#clip)`);

    defs.select("#clip use")
      .attr("xlink:href", `${window.location}#sphere`);
      
    defs.selectAll("path.feature")
      .attr("d", path);
      
    this.d3l().select("g.map")
      .attr("clip-path", `url(${window.location}#clip)`);
      
    this.drawGrid();
    this.drawBackmap();
    this.drawLayers();
			
	}.observes('windowLocation', 'projection', 'graphLayout.virginDisplayed'),
  
  registerLandSel(id) {
    
    landSelSet.add(id);
    return `${window.location}#f-path-${id}`;
    
  },
  
  drawLandSel() {
    
    let features = this.get('base').lands.features.filter( 
          f => landSelSet.has(f.id)
        ),
        path = this.get('projectedPath');
    
    let sel = this.d3l().select("defs").selectAll("path.feature")
      .data(features)
      .attr("d", path);
      
    sel.enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => `f-path-${d.id}`)
      .classed("feature", true);
     
    sel.exit().remove();
    
  },
  
  drawTitle: function() {
    
    let {w, h} = this.getSize();
    
    this.d3l().select("text.title")
      .text(this.get('title'))
      .attr({
        "text-anchor": "middle",
        "font-size": "1.6em",
        x: w / 2,
        y: this.get('graphLayout').vOffset(h) + 32
      });
      
   this.d3l().attr("title", this.get('title'));
   
  }.observes('title', "$width", "$height"),
   
  drawGrid: function() {
     
    let sphere = this.d3l().select("g.backmap").selectAll("use.sphere"),
        grid = this.d3l().select("g.backmap").selectAll("use.grid");

    sphere.style({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor')
    })
    .attr({
      "xlink:href": `${window.location}#sphere`,
    }).style({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    })
    .classed("sphere", true);
  
    grid.style({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor')
    })
    .attr({
      "xlink:href": `${window.location}#grid`,
    }).style({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    })
    .classed("grid", true);
     
   }.observes('graphLayout.gridColor', 'graphLayout.showGrid'),
   
   drawBackmap: function() {
    
    let d3l = this.d3l();
    
    d3l.select("g.backmap path.land")
      .datum(this.get('base').land)
      .attr("d", this.get('projectedPath'))
      .style({
        "fill": this.get('graphLayout.backMapColor')
      });
    
    d3l.select("g.borders path.borders")
      .datum(this.get('base').borders)
      .attr("d", this.get('projectedPath'))
      .style({
        "stroke-width": 1,
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });
      
    d3l.select("g.borders path.borders-disputed")
      .datum(this.get('base').bordersDisputed)
      .attr("d", this.get('projectedPath'))
      .style({
        "stroke-width": 1,
        "stroke-dasharray": "5,5",
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });
    
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
    
    this.drawLandSel();
    
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
          "xlink:href": d => this.registerLandSel(d.id),
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
