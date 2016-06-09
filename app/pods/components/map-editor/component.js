import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import d3lper from 'mapp/utils/d3lper';
import GraphLayout from 'mapp/models/graph-layout';
import {geoMatch} from 'mapp/utils/geo-match';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import LegendFeature from './legend';
import {isChrome} from 'mapp/utils/browser-check';
import zoom2 from 'mapp/utils/d3-zoom2';
/* global Em */

let landSelSet = new Set();

let _translate0,
    _translate;
    
let zoom;

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
  dataSource: null,
  author: null,
  
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
    d3g.style("font-family", "verdana");
		
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
    
    let vm = defs.append("mask")
      .attr({
        id: "viewport-mask",
        x: 0,
        y: 0,
        width: "500",
        height: "500"
      });

    vm.append("path")
      .attr({
        "fill-rule": "evenodd"
      })
      .style("fill", "white");

    defs.append("clipPath")
      .attr({
        id: "viewport-clip",
      })
      .append("path");
    
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
      
    d3g.append("rect")
			.classed("fg", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("opacity", 0.8)
      .attr("mask", `url(${window.location}#viewport-mask)`)
      .attr("fill", this.get('graphLayout.backgroundColor'));
      
    this.legendInit();
    
    d3g.append("text")
      .classed("map-title", true);

    d3g.append("text")
      .classed("map-dataSource", true);

    d3g.append("g")
      .classed("map-author", true)
      .append("text");
      
    // DRAG & ZOOM
    zoom = zoom2()
      .scaleExtent([1, 12])
      .band(0.5)
      .on("zoom", (scale, translate) => {
        
        this.zoomAndDrag(scale, translate);
 
      })
      .scale(this.get('graphLayout.zoom'));
    
    this.addObserver('graphLayout.zoom', () => zoom.scale(this.get('graphLayout.zoom')) );
    
    let updateTxTy = () => {
      let p = this.get('projection');
      zoom.translate([
        p.initialTranslate[0]*this.get('graphLayout.tx'),
        p.initialTranslate[1]*this.get('graphLayout.ty')
      ]);
    }
    this.addObserver('graphLayout.tx', 'graphLayout.ty', updateTxTy);
    updateTxTy();

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
  
  updateMargins: function() {
    
    // ===========
		// = VIEWBOX =
		// ===========
		
		let {w, h} = this.getSize();
		
		this.d3l().attr("viewBox", "0 0 "+w+" "+h);
		// ===========
    
    // fg mask
    let vOf = this.get('graphLayout').vOffset(h),
        hOf = this.get('graphLayout').hOffset(w),
        m = this.get('graphLayout.margin'),
        outer = `M 0 0, ${w} 0, ${w} ${h}, 0 ${h} Z`,
        inner =  `M ${hOf + m.l} ${vOf + m.t}, ${w - hOf - m.r} ${vOf + m.t},
                   ${w - hOf - m.r} ${h - vOf - m.b}, ${hOf + m.l} ${h - vOf - m.b}Z`;
        
    this.d3l().select("defs #viewport-mask path")
      .attr("d", `${outer} ${inner}`);

    this.d3l().select("defs #viewport-clip path")
      .attr("d", `${inner}`);
    
    // ===========
		
		this.d3l().selectAll("g.offset line.horizontal-top")
			.attr("x1", 0)
			.attr("y1", vOf)
			.attr("x2", w)
			.attr("y2", vOf)
		  .attr("stroke-width", "1");
    
		this.d3l().selectAll("g.offset line.horizontal-bottom")
			.attr("x1", 0)
			.attr("y1", h - vOf)
			.attr("x2", w)
			.attr("y2", h - vOf)
		  .attr("stroke-width", "1");
			
		this.d3l().selectAll("g.offset line.vertical-left")
			.attr("x1", hOf)
			.attr("y1", 0)
			.attr("x2", hOf)
			.attr("y2", h)
		  .attr("stroke-width", "1");
      
		this.d3l().selectAll("g.offset line.vertical-right")
			.attr("x1", w - hOf)
			.attr("y1", 0)
			.attr("x2", w - hOf)
			.attr("y2", h)
		  .attr("stroke-width", "1");
		
		this.d3l().select("g.margin")
			.attr("transform", `translate(${hOf}, ${vOf})`)
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
    
    let {w, h} = this.getSize(),
        projection = projector.computeProjection(
          this.get("graphLayout.autoCenter") ? this.get("filteredBase"):null,
          w,
          h,
          this.get('graphLayout.width'),
          this.get('graphLayout.height'),
          this.get('graphLayout.margin'),
          this.get('graphLayout.projection')
        );
        
    this.scaleProjection(projection);
    
    return projection; 
    
  }.property('$width', '$height', 'graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.margin', 'graphLayout.precision',
    'graphLayout.projection._defferedChangeIndicator'),
    
  scaleProjection: function(projection) {
    
    projection
      .translate([
          projection.initialTranslate[0]*(this.get('graphLayout.zoom')+this.get('graphLayout.tx')),
          projection.initialTranslate[1]*(this.get('graphLayout.zoom')+this.get('graphLayout.ty'))
        ])
      .scale(projection.resolution * this.get('graphLayout.zoom'));
      
  },
  
  zoomAndDrag(scale, translate) {
    
    let mapG = this.d3l().select("g.map"),
        projection = this.get('projection'),
        t = projection.initialTranslate,
        ds = projection.scale() / projection.resolution,
        rs = scale/ds,
        tx = projection.translate()[0]*rs - t[0] * scale,
        ty = projection.translate()[1]*rs - t[1] * scale;
    
    mapG
      .attr({
        tx: translate[0],
        ty: translate[1],
        s: scale
      })
      .transition().duration(400).ease("cubic-out")
      .attr({
        "transform": `${d3lper.translate({tx: translate[0] - tx, ty: translate[1] - ty})} scale(${rs})`
      })
      .each("end", () => {
        
        mapG.attr("transform", null)
          .selectAll("g.layers .shape")
          .attr("transform", null);
        
        this.get('graphLayout').beginPropertyChanges();
        
        this.get('graphLayout').setProperties({
          zoom: parseFloat(mapG.attr("s")),
          tx: parseFloat(mapG.attr("tx")) / t[0],
          ty: parseFloat(mapG.attr("ty")) / t[1]
        });
        
        this.scaleProjection(projection);
        
        this.get('graphLayout').endPropertyChanges();
        
        this.projectAndDraw();
        
      });
    
    if (isChrome()) {
      mapG.selectAll("g.layers .shape").each(function() {
        
        let el = d3.select(this),
          elBox = el.node().getBBox(),
          cx = elBox.x + elBox.width / 2,
          cy = elBox.y + elBox.height / 2;
      
        el.attr("transform", `${d3lper.translate({tx: -cx*(1/rs-1), ty: -cy*(1/rs-1)})} scale(${1/rs})`);
        
      });
    }
    
    
  },
  
  zoomAndDragChange: function() {
    
    let projection = this.get('projection'),
        ds = projection.scale() / projection.resolution,
        tx = projection.translate()[0] - projection.initialTranslate[0]*ds,
        ty = projection.translate()[1] - projection.initialTranslate[1]*ds,
        shiftX = tx - this.get('graphLayout.tx')*projection.initialTranslate[0],
        shiftY = ty - this.get('graphLayout.ty')*projection.initialTranslate[1];
   
    if (Math.abs(ds - this.get('graphLayout.zoom')) > 0.1 
        || Math.abs(shiftX) > 0.1 || Math.abs(shiftY) > 0.1) {
      
      let {w, h} = this.getSize(),
		      vOf = this.get('graphLayout').vOffset(h),
          hOf = this.get('graphLayout').hOffset(w),
          m = this.get('graphLayout.margin');
       
      if (Math.abs(shiftX) <= 0.1 && Math.abs(shiftY) <= 0.1) {
        zoom.toPoint(
          this.get('graphLayout.zoom'),
          (w - 2*hOf - m.l - m.t) / 2 + hOf + m.l,
          (h - 2*vOf - m.t - m.b) / 2 + vOf + m.t
        );
      } else {
        zoom.toScaleAndTranslate(
          this.get('graphLayout.zoom'),
          this.get('graphLayout.tx')*projection.initialTranslate[0],
          this.get('graphLayout.ty')*projection.initialTranslate[1]
        );
      }
      
    }
    
  }.observes('graphLayout.zoom', 'graphLayout.tx', 'graphLayout.ty'),
    
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
    
    this.d3l().select("text.map-title")
      .text(this.get('title'))
      .attr({
        "font-size": "2em",
        x: this.get('graphLayout').hOffset(w) + this.get('graphLayout.margin.l'),
        y: this.get('graphLayout').vOffset(h) + this.get('graphLayout.margin.t') - 5
      });
      
   this.d3l().attr("title", this.get('title'));

   this.d3l().select("text.map-dataSource")
      .text(this.get('dataSource'))
      .attr({
        "font-size": "0.8em",
        "text-anchor": "end",
        x: w - this.get('graphLayout').hOffset(w) - this.get('graphLayout.margin.r') - 1,
        y: h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + 11
      });


    this.d3l().select("g.map-author")
      .attr("transform", d3lper.translate({
        tx: w - this.get('graphLayout').hOffset(w) - this.get('graphLayout.margin.r') + 11,
        ty: h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') - 1
      }))
      .select("text")
      .text(this.get('author'))
      .attr("transform", "rotate(-90)")
      .attr({
        "font-size": "0.8em"
      });
   
  }.observes('title', 'dataSource', 'author', "$width", "$height"),
   
  drawGrid: function() {
     
    let sphere = this.d3l().select("g.backmap").selectAll("use.sphere"),
        grid = this.d3l().select("g.backmap").selectAll("use.grid");

    sphere.style({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor'),
      "stroke-width": 3
    })
    .attr({
      "xlink:href": `${window.location}#sphere`,
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
      .datum(this.get('graphLayout.showBorders') ? this.get('base').borders : null)
      .attr("d", this.get('projectedPath'))
      .style({
        "stroke-width": 1,
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });
      
    d3l.select("g.borders path.borders-disputed")
      .datum(this.get('graphLayout.showBorders') ? this.get('base').bordersDisputed : null)
      .attr("d", this.get('projectedPath'))
      .style({
        "stroke-width": 1,
        "stroke-dasharray": "5,5",
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });
    
  }.observes('graphLayout.backMapColor', 'graphLayout.showBorders', 'graphLayout.stroke'),
  
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

	}
  
  
  /*test() {
    
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
    
  }*/
  
  
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
