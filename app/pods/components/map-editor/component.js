import Ember from 'ember';
import d3 from 'd3';
import d3lper from 'mapp/utils/d3lper';
import GraphLayout from 'mapp/models/graph-layout';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import ViewportFeature from './viewport';
import LegendFeature from './legend';
import ZoomFeature from './zoom';
import LabellingFeature from './labelling';

/* global Em */

let landSelSet = new Set();

let shift = 0;

export default Ember.Component.extend(ViewportFeature, LegendFeature,
  ZoomFeature, LabellingFeature, {
  
  tagName: "svg",
  attributeBindings: ['width', 'height', 'xmlns', 'version'],
  classNames: ["map-editor"],
  width: "100%",
  height: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
  
  $width: null,
  $height: null,
	
	base: null,
	
	data: null,
	
	graphLayout: null,
  
  graphLayers: [],
  labellingLayers: [],
  
  title: null,
  dataSource: null,
  author: null,
  
  resizeInterval: null,

  windowLocation: function() {
    return window.location;
  }.property(),
  
  init() {
    this._super();
  },

  getFeaturesFromBase(ns, ns2 = "features") {
    return this.get('base').reduce( (col, base) => {
      return col.concat(
        base[ns][ns2].map(f => ({path: this.getProjectedPath(base.projection), feature: f}))
      );
    }, []);
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

    defs.append("clipPath")
      .attr("id", "border-square-clip");
    
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
      .attr("fill", this.get("graphLayout.backgroundColor"));
		
    let mapG = d3g.append("g")
      .classed("outer-map", true)
      .append("g")
      .classed("map", true);
    
    let backMap = mapG.append("g")
			.classed("backmap", true);
      
    backMap.append("use")
      .classed("sphere", true);
      
    backMap.append("use")
      .classed("grid", true);
      
    /*backMap.append("path")
      .classed("land", true);*/

		let layers = mapG.append("g")
			.classed("layers", true);
    
    let bordersMap = layers.append("g")
      .classed("borders", true)
      .datum({isBorderLayer: true});
      
    this.labellingInit(mapG);
    this.viewportInit(defs, d3g);
    this.zoomInit(d3g);
    this.legendInit();
    
    d3g.append("text")
      .classed("map-title", true);

    d3g.append("text")
      .classed("map-dataSource", true);

    d3g.append("g")
      .classed("map-author", true)
      .append("text");
      
    this.drawTitle();
		this.projectAndDraw();
		this.updateColors();
          
	}.on("didInsertElement"),
  
  cleanup: function() {
    clearInterval(this.get('resizeInterval'));
  }.on("willDestroyElement"),
  
  getSize() {
    return {
      w: Math.max(this.get('$width'), this.get('graphLayout.width')),
      h: Math.max(this.get('$height'), this.get('graphLayout.height'))
    };
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
  
  projector: function() {
    
    let {w, h} = this.getSize(),
        projector = this.get('graphLayout.projection').projector();

    projector.configure(
      this.get('base'),
      w,
      h,
      this.get('graphLayout.width'),
      this.get('graphLayout.height'),
      this.get('graphLayout.margin')
    );

    this.scaleProjector(projector);

    return projector;
    
  }.property('$width', '$height', 'graphLayout.autoCenter', 'graphLayout.width',
    'graphLayout.height', 'graphLayout.margin._defferedChangeIndicator', 'graphLayout.precision',
    'graphLayout.projection', 'graphLayout.projection._defferedChangeIndicator'),

  projectionFor(idx) {
    return this.get('projector').projectionAt(idx);
  },
    
  scaleProjector(projector) {

    projector.forEachProjection( projection => {
      projection
      .translate([
          projection.initialTranslate[0]*this.get('graphLayout.zoom')+this.get('graphLayout.tx')*this.getSize().w,
          projection.initialTranslate[1]*this.get('graphLayout.zoom')+this.get('graphLayout.ty')*this.getSize().h
        ])
      .scale(projection.resolution * this.get('graphLayout.zoom'));
    });
      
  },
  
  getProjectedPath(idx) {
    
    let path = d3.geo.path(),
        proj = idx ? this.projectionFor(idx) : this.get('projector');
    
    path.projection(proj);
    
    return path;
     
  },
	
	projectAndDraw: function() {
    
    let {w, h} = this.getSize();
    
    let path = this.getProjectedPath(),
        precision = this.get('graphLayout.precision'),
        defs = this.d3l().select("defs");
    
    defs.select("#sphere")
      .datum({type: "Sphere"})
      .attr("d", path);
    
    defs.select("#grid")
      .datum(d3.geo.graticule())
      .attr("d", path)
      .attr("clip-path", `url(#clip)`);

    defs.select("#clip use")
      .attr("xlink:href", `#sphere`);
      
    defs.selectAll("path.feature")
      .attr("d", path);
      
    this.d3l().select("g.map")
      .attr("clip-path", `url(#clip)`);
      
    this.drawGrid();
    this.drawBackmap();
    this.drawLayers();
    this.drawLabelling();
			
	}.observes('windowLocation', 'projector', 'graphLayout.virginDisplayed'),
  
  registerLandSel(id) {
    
    landSelSet.add(id);
    return `#f-path-${id}`;
    
  },
  
  drawLandSel() {

    let geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        features = this.getFeaturesFromBase("lands")
          .filter( f => landSelSet.has(f.feature.properties[geoKey]) );

    let sel = this.d3l().select("defs").selectAll("path.feature")
      .data(features)
      .attr("d", d => d.path(d.feature) );
      
    sel.enter()
      .append("path")
      .attr("d", d => d.path(d.feature))
      .attr("id", d => `f-path-${d.feature.properties[geoKey]}`)
      .classed("feature", true);
     
    sel.exit().remove();
    
  },

  reorderLayers() {

    let layers = this.get('graphLayers');

    this.d3l().select(".layers")
      .selectAll(".layer, g.borders")
      .sort((a,b) => {
          if (a.isBorderLayer && b.get('mapping.visualization.type') === "surface") {
            return 1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.type') === "surface") {
            return -1;
          } else if (a.isBorderLayer && b.get('mapping.visualization.type') === "symbol") {
            let idx = layers.indexOf(b);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.type') === "surface") ? 1 : -1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.type') === "symbol") {
            let idx = layers.indexOf(a);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.type') === "surface") ? -1 : 1;
          } else {
            return layers.indexOf(a) < layers.indexOf(b) ? 1 : -1;
          }
      });
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
   
  }.observes('title', 'dataSource', 'author', "$width", "$height",
    "graphLayout.margin._defferedChangeIndicator",
    "graphLayout.width", "graphLayout.height"),
   
  drawGrid: function() {
     
    let sphere = this.d3l().select("g.backmap").selectAll("use.sphere"),
        grid = this.d3l().select("g.backmap").selectAll("use.grid");

    sphere.style({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor'),
      "stroke-width": 3
    })
    .attr({
      "xlink:href": `#sphere`,
      "display": this.get('graphLayout.canDisplaySphere') ? null : "none"
    })
    .classed("sphere", true);
  
    grid.style({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor')
    })
    .attr({
      "xlink:href": `#grid`,
      "display": this.get('graphLayout.canDisplayGrid') ? null : "none"
    }).style({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    })
    .classed("grid", true);
     
   }.observes('graphLayout.gridColor', 'graphLayout.showGrid',
    'graphLayout.canDisplaySphere', 'graphLayout.canDisplayGrid'),
   
   drawBackmap: function() {
    
    let d3l = this.d3l();

    let sel = d3l.select("g.backmap")
      .selectAll("path.land")
      .data(this.get('base'));
      
    sel.enter()
      .append("path")
      .classed("land", true);

    sel.attr("d", d => this.getProjectedPath(d.projection)(d.land) )
      .style({
        "fill": this.get('graphLayout.backMapColor')
      });

    sel.exit().remove();

    /* squares */
    sel = d3l.select("#border-square-clip")
      .selectAll("path")
      .data(this.get('base'));

    sel.enter()
      .append("path");

    sel.attr("d", d => {
        let path = this.getProjectedPath(d.projection)(d.squares);
        return "M0,0H4000V4000H-4000z"+(path ? path : "")
      })
      .attr("clip-rule", "evenodd");

    sel.exit().remove();

    sel = d3l.select("g.borders")
      .selectAll("path.squares")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : []);

    sel.enter()
      .append("path")
      .classed("squares", true);

    sel.attr("d", d => this.getProjectedPath(d.projection)(d.squares))
      .style({
        "stroke-width": 1,
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });

    sel.exit().remove();

    /* borders */
    sel = d3l.select("g.borders")
      .selectAll("path.borders")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : []);

    sel.enter()
      .append("path")
      .classed("borders", true);

    sel.attr("d", d => this.getProjectedPath(d.projection)(d.borders) )
      .attr("clip-path", `url(#border-square-clip)`)
      .style({
        "stroke-width": 1,
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });

    sel.exit().remove();

    sel = d3l.select("g.borders")
      .selectAll("path.borders-disputed")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : []);
    
    sel.enter()
      .append("path")
      .classed("borders", true);

    sel.attr("d", d => this.getProjectedPath(d.projection)(d.bordersDisputed) )
      .attr("clip-path", `url(#border-square-clip)`)
      .style({
        "stroke-width": 1,
        "stroke-dasharray": "5,5",
        "stroke": this.get("graphLayout.stroke"),
        "fill": "none"
      });

    sel.exit().remove();

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
      self.mapData(d3.select(this), d);
    });
    
    this.drawLandSel();
    this.reorderLayers();
    
  }.observes('graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
	mapData: function(d3Layer, graphLayer) {
    
    let geoDef = graphLayer.get('mapping.geoDef'),
        varCol = graphLayer.get('mapping.varCol'),
        geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        data = [];
    
    if (geoDef.get('isGeoRef')) {
      
      data = varCol.get('body').map( (cell, index) => {
        
        let geoData = geoDef.get('geo').get('body').objectAt(index).get('postProcessedValue'),
            val = cell.get('postProcessedValue');
        if (geoData) {
          return {
            id: geoData.value[geoKey],
            value: val,
            cell: cell,
            index: index,
            surface: this.getFeaturesFromBase("lands").find( f => f.feature.properties[geoKey] === geoData.value[geoKey]),
            point: this.getFeaturesFromBase("centroids").find( f => f.feature.properties[geoKey] === geoData.value[geoKey])
          };
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );
      
      if (graphLayer.get('mapping.visualization.type') === "surface") {
        this.mapSurface(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    } else if (geoDef.get('isLatLon')) {

      data = varCol.get('body').map( (cell, index) => {
        
        let val = cell.get('postProcessedValue'),
            lon = geoDef.get('lon.body').objectAt(index).get('postProcessedValue'),
            lat = geoDef.get('lat.body').objectAt(index).get('postProcessedValue');
        
        if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          return {
            id: `coord-${index}`,
            value: val,
            cell: cell,
            index: index,
            point: {
              geometry: {
                type: "Point",
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
      } else if (graphLayer.get('mapping.visualization.type') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    }
    
  },
  
  mapSurface: function(d3Layer, data, graphLayer) {
    
    let svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn(),
        geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier');
		
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

    d3Layer.classed("surface", true);
    d3Layer.selectAll("*:not(.surface)").remove();
      
    let sel = d3Layer.selectAll(".feature")
      .data(data)
      .call(bindAttr);
    
    sel.enter()
      .append("use")
      .classed("feature", true)
      .classed("surface", true)
      .call(bindAttr);

		sel.exit().remove();
			
	},
  
  mapSymbol: function(d3Layer, data, graphLayer) {

    let svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn(),
        sortedData = data.sort((a, b) => d3.descending(converter(a.cell, "size"), converter(b.cell, "size")));
		
    let shapeFn = function(d) {
      
      let _ = d3.select(this),
          shape = converter(d.cell, "shape"),
          r = converter(d.cell, "size"),
          fill = converter(d.cell, "fill"),
          strokeColor = converter(d.cell, "strokeColor");
      
      if (shape && r > 0) {
        
        let symbol = SymbolMaker.symbol({name: shape});
      
        symbol.call(svg);
      
        let el = _.append("use").attr("xlink:href", symbol.url());
        
        if (shape === "bar") {
          
          el.attr({
              "width": mapping.get('visualization.maxSize'),
              "height": r*r,
              "x": -mapping.get('visualization.maxSize') / 2,
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

        if (shape === "line") {
          strokeColor = fill;
        }
        
        el.attr({
            "fill": fill,
            "stroke": strokeColor
          })
          .classed("shape", true);
          
      }
      
    };
    
   let bindAttr = (_) => {

      _.attr("transform", d => { 
        let [tx, ty] = this.getProjectedPath().centroid(d.point.geometry);
        
        return d3lper.translate({
          tx: tx,
          ty: ty
        })
        
      });
      
      _.selectAll(".shape").remove();
      
      _.each(shapeFn);
      
    };

    d3Layer.classed("surface", false);
    d3Layer.selectAll("*:not(.symbol)").remove();
    
    let centroidSel = d3Layer
			.selectAll("g.feature")
      .data(sortedData.filter( d => {
        let [tx, ty] = this.getProjectedPath().centroid(d.point.geometry);
        return !isNaN(tx) && !isNaN(ty);
      }))
      .call(bindAttr);
      
    centroidSel.enter()
      .append("g")
			.classed("feature", true)
			.classed("symbol", true)
      .call(bindAttr);
      
    centroidSel.order().exit().remove();


	}
	
});
