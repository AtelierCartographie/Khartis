import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import GraphLayout from 'khartis/models/graph-layout';
import PatternMaker from 'khartis/utils/pattern-maker';
import SymbolMaker from 'khartis/utils/symbol-maker';
import ViewportFeature from './viewport';
import LegendFeature from './legend';
import ZoomFeature from './zoom';
import LabellingFeature from './labelling';
import CompositionBordersFeature from './composition-borders';
import CreditsFeature from './credits';
import DocumentMaskFeature from './document-mask';

/* global Em */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'height', 'xmlns', 'version'],
  classNames: ["map-editor"],
  width: "100%",
  height: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
  
  $width: null,
  $height: null,
	
	graphLayout: null,
	base: function() {
    return this.get('graphLayout.basemap.mapData');
  }.property('graphLayout.basemap.mapData'),
  
  title: null,
  dataSource: null,
  author: null,

  labellingLayers: [],
  graphLayers: [],
  
  _resizeInterval: null,
  _landSelSet: null,

  /* traits */
  hasViewportFeature: true,
  hasLegendFeature: true,
  hasZoomFeature: true,
  hasLabellingFeature: true,
  hasCompositionBordersFeature: true,
  hasCreditsFeature: true,
  hasDocumentMaskFeature: true,
  /* ---- */

  windowLocation: function() {
    return window.location;
  }.property(),
  
  init() {
    this._super();
    this.set('_landSelSet', new Set());
  },

  getFeaturesFromBase(ns, ns2 = "features") {
    
    return this.get('base').reduce( (col, base) => {
      let path = this.getProjectedPath(base.projection);
      return col.concat(
        base[ns][ns2].map(f => ({path: path, feature: f}))
      );
    }, []);
  },
  
	draw: function() {
    
		var d3g = this.d3l();
    
    d3g.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    d3.namespaces.illustrator = 'http://ns.adobe.com/AdobeIllustrator/10.0/';
    d3g.attr("xmlns:i", d3.namespaces.illustrator);
    d3.namespaces.illustrator = 'http://www.sciencespo.fr/cartographie/khartis/';
    d3g.attr("xmlns:kis", d3.namespaces.illustrator);
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
    this.set('_resizeInterval', setInterval($size, 500));
    $size();
    // ---------
    
		d3g.append("rect")
			.classed("bg", true)
      .attr("fill", this.get("graphLayout.backgroundColor"));
		
    let mapG = d3g.append("g")
      .attr("id", "outerMap", true)
      .append("g")
      .classed("map", true)
      .attr("id", "map");
    
    let backMap = mapG.append("g")
      .attr("id", "backmap");
      
    backMap.append("use")
      .classed("sphere", true);
      
    backMap.append("use")
      .classed("grid", true);
      
		let layers = mapG.append("g")
      .attr("id", "layers");
    
    let bordersMap = layers.append("g")
      .attr("id", "borders")
      .datum({isBorderLayer: true});
    
    if (this.get('hasViewportFeature')) {
      this.reopen(ViewportFeature, {displayOffsets: this.get('displayDocumentMask')});
      this.viewportInit(defs, d3g);
    }
    if (this.get('hasLegendFeature')) {
      this.reopen(LegendFeature);
      this.legendInit();
    }
    if (this.get('hasZoomFeature')) {
      this.reopen(ZoomFeature);
      this.zoomInit(d3g);
    }
    if (this.get('hasLabellingFeature')) {
      this.reopen(LabellingFeature);
      this.labellingInit(mapG);
    }
    if (this.get('hasCompositionBordersFeature')) {
      this.reopen(CompositionBordersFeature);
      this.compositionBordersInit(mapG);
    }
    if (this.get('hasCreditsFeature')) {
      this.reopen(CreditsFeature);
      this.creditsInit(d3g);
    }
    if (this.get('hasDocumentMaskFeature')) {
      this.reopen(DocumentMaskFeature, {displayDocumentMask: this.get('displayDocumentMask')});
      this.documentMaskInit(defs, d3g);
    }
    
		this.projectAndDraw();
		this.updateColors();
          
	}.on("didInsertElement"),
  
  cleanup: function() {
    clearInterval(this.get('_resizeInterval'));
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

  /* may be overrided by viewport feature */
  updateViewport: function() {
    
    // ===========
		// = VIEWBOX =
		// ===========
		let {w, h} = this.getSize(),
        d3l = this.d3l();
		
		d3l.attr("viewBox", "0 0 "+w+" "+h);
		// ===========

  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'displayOffsets', 'projector'),
	
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
      let bbox = d3lper.scaleCoords(this.get('graphLayout.zoom'), projection.bboxPx[0], projection.bboxPx[1]),
          tx = this.get('graphLayout.tx')*this.getSize().w,
          ty = this.get('graphLayout.ty')*this.getSize().h;
      bbox = [
        d3lper.sumCoords([tx, ty], bbox[0]),
        d3lper.sumCoords([tx, ty], bbox[1])
      ];
      projection
      .translate([
          projection.initialTranslate[0]*this.get('graphLayout.zoom')+this.get('graphLayout.tx')*this.getSize().w,
          projection.initialTranslate[1]*this.get('graphLayout.zoom')+this.get('graphLayout.ty')*this.getSize().h
        ])
      .scale(projection.resolution * this.get('graphLayout.zoom'))
      .clipExtent(bbox);
    });
    
  },
  
  getProjectedPath(idx) {
    
    let path = d3.geoPath(),
        proj = idx ? this.projectionFor(idx) : this.get('projector');
    
    path.projection(proj);
    
    return path;
     
  },

  assumePathForLatLon(latLon) {
    
    let path = d3.geoPath(),
       projs = this.get('projector').projectionsForLatLon(latLon);
    if (projs.length) {
      path.projection(projs[0]);
    } else {
      path.projection(this.get('projector'));
    }
    
    return path;
  },

  redraw: function() {
    this.projectAndDraw();
  }.observes('windowLocation', 'projector'),
	
	projectAndDraw() {
    
    let {w, h} = this.getSize();
    
    let path = this.getProjectedPath(),
        precision = this.get('graphLayout.precision'),
        defs = this.d3l().select("defs"),
        ε = 1e-1;
    
    if (this.get('graphLayout.canDisplaySphere') || this.get('graphLayout.canDisplayGrid')) {

      defs.select("#sphere")
        .datum({type: "Sphere"})
        .attr("d", path);
    
      defs.select("#grid")
        .datum(d3.geoGraticule())
        .attr("d", path)
        .attr("clip-path", `url(#clip)`);

      defs.select("#clip use")
        .attr("xlink:href", `#sphere`);
    
      this.d3l().select("#map").attr("clip-path", `url(#clip)`);

      this.drawGrid();

    } else {
      this.d3l().select("#map").attr("clip-path", null);
    }
      
    this.drawBackmap();
    this.drawLayers();
			
	},
  
  registerLandSel(id) {
    this.get('_landSelSet').add(id);
    return `#f-path-${id}`;
  },
  
  drawLandSel() {

    let geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        features = this.getFeaturesFromBase("lands")
          .filter( f => this.get('_landSelSet').has(f.feature.properties[geoKey]) );

    let sel = this.d3l().select("defs")
      .selectAll("path.feature")
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

    this.d3l().select("#layers")
      .selectAll(".layer, #borders")
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
  
  drawGrid: function() {
     
    let sphere = this.d3l().select("#backmap").selectAll("use.sphere"),
        grid = this.d3l().select("#backmap").selectAll("use.grid");

    sphere.styles({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor'),
      "stroke-width": 3
    })
    .attrs({
      "xlink:href": `#sphere`,
      "display": this.get('graphLayout.canDisplaySphere') ? null : "none"
    })
    .classed("sphere", true);
  
    grid.styles({
      "fill": "none",
      "stroke": this.get('graphLayout.gridColor')
    })
    .attrs({
      "xlink:href": `#grid`,
      "display": this.get('graphLayout.canDisplayGrid') ? null : "none"
    }).styles({
      "opacity": this.get('graphLayout.showGrid') ? 1 : 0
    })
    .classed("grid", true);
     
   }.observes('graphLayout.gridColor', 'graphLayout.showGrid',
    'graphLayout.canDisplaySphere', 'graphLayout.canDisplayGrid'),
   
   drawBackmap: function() {

    let d3l = this.d3l(),
        backmap = d3l.select("#backmap");

    backmap
      .selectAll("path.backland")
      .data(this.get('base'))
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("backland", true)
            .attr("id","backland")
            //.attr("mask", d => `url(#composition-mask-${d.projection})`);
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.backLands) )
            .styles({
              "fill": this.get('graphLayout.backlandsColor')
            });
        }
      });

    backmap
      .selectAll("path.land")
      .data(this.get('base'))
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("land", true)
            .attr("id","land");
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.land) )
            .styles({
              "fill": this.get('graphLayout.backmapColor')
            });
        }
      });

    backmap
      .selectAll("path.land-squares")
      .data(this.get('base'))
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("land-squares", true);
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.squares) )
            .styles({
              "stroke": "none",
              "fill": this.get('graphLayout.backmapColor')
            });
        }
      });

    /* squares clip */
    d3l.select("#border-square-clip")
      .selectAll("path")
      .data(this.get('base'))
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path");
        },
        update: (sel) => {
          return sel.attr("d", d => {
              let path = this.getProjectedPath(d.projection)(d.squares);
              return "M0,0H4000V4000H-4000z"+(path ? path : "")
            })
            .attr("clip-rule", "evenodd");
        }
      });

    /*squares borders*/
    d3l.select("#borders")
      .selectAll("path.squares")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : [])
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("squares", true);
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.squares))
            .styles({
              "stroke-width": 1,
              "stroke": this.get("graphLayout.stroke"),
              "fill": "none"
            });
        }
      });

    /* borders */
    d3l.select("#borders")
      .selectAll("path.linesUp")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : [])
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("linesUp", true)
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.linesUp) )
            .styles({
              "stroke-width": this.get('graphLayout.strokeWidth')+1,
              "stroke": this.get("graphLayout.stroke"),
              "fill": "none"
            });
        }
      });

    d3l.select("#borders")
      .selectAll("path.linesUp-disputed")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : [])
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("linesUp-disputed", true)
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.linesUpDisputed) )
            .styles({
              "stroke-width": this.get('graphLayout.strokeWidth')+1,
              "stroke-dasharray": "5,5",
              "stroke": this.get("graphLayout.stroke"),
              "fill": "none"
            });
        }
      });

    d3l.select("#borders")
      .selectAll("path.borders")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : [])
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("borders", true);
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.borders) )
            .attr("clip-path", `url(#border-square-clip)`)
            .styles({
              "stroke-width": 1,
              "stroke": this.get("graphLayout.stroke"),
              "fill": "none"
            });
        }
      });

    d3l.select("#borders")
      .selectAll("path.borders-disputed")
      .data(this.get('graphLayout.showBorders') ? this.get('base') : [])
      .enterUpdate({
        enter: function(sel) {
          return sel.append("path").classed("borders", true);
        },
        update: (sel) => {
          return sel.attr("d", d => this.getProjectedPath(d.projection)(d.bordersDisputed) )
            .attr("clip-path", `url(#border-square-clip)`)
            .styles({
              "stroke-width": 1,
              "stroke-dasharray": "5,5",
              "stroke": this.get("graphLayout.stroke"),
              "fill": "none"
            });
        }
      });

    

  }.observes('graphLayout.backmapColor', 'graphLayout.showBorders', 'graphLayout.stroke'),
  
  drawLayers: function() {
    
    let self = this,
        data = this.get('graphLayers')
          .filter( gl => gl.get('displayable') )
          .reverse();
          
    let bindAttr = (_) => {
      _.attr("stroke-width", d => d.get("mapping.visualization.stroke"))
       .style("opacity", d => d.get('opacity'));
    };
    
    let sel = this.d3l().select("#layers")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();

    this.d3l().select("#layers").selectAll("g.layer").each(function(d, index) {
      self.mapData(d3.select(this), d);
    });
    
    this.drawLandSel();
    this.reorderLayers();
    
  }.observes('graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
	mapData(d3Layer, graphLayer) {
    
    let mapping = graphLayer.get('mapping'),
        geoDef = mapping.get('geoDef'),
        geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        data = [];

    if (geoDef.get('isGeoRef')) {

      let lands = this.getFeaturesFromBase("lands"),
          centroids = this.getFeaturesFromBase("centroids");
          
      data = mapping.get('filteredBody').map( (cell) => {
        
        let geoData = cell.get('row.cells')
          .find( c => c.get('column') == geoDef.get('geo') )
          .get('postProcessedValue');

        return {
          id: geoData.value[geoKey],
          value: cell.get('postProcessedValue'),
          cell: cell,
          surface: lands.find( f => f.feature.properties[geoKey] === geoData.value[geoKey]),
          point: centroids.find( f => f.feature.properties[geoKey] === geoData.value[geoKey])
        };
        
      });
      
      if (graphLayer.get('mapping.visualization.type') === "surface") {
        this.mapSurface(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    } else if (geoDef.get('isLatLon')) {

      data = mapping.get('filteredBody').map( (cell, index) => {
        
        let val = cell.get('postProcessedValue'),
            lon = cell.get('row.cells').find( c => c.get('column') == geoDef.get('lon') ).get('postProcessedValue'),
            lat = cell.get('row.cells').find( c => c.get('column') == geoDef.get('lat') ).get('postProcessedValue');

        if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          return {
            id: `coord-${index}`,
            value: val,
            cell: cell,
            point: {
              path: this.assumePathForLatLon([lat, lon]),
              feature: {
                geometry: {
                  type: "Point",
                  coordinates: [
                    lon,
                    lat
                  ]
                }
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
        converter = mapping.fn();
		
    let bindAttr = (_) => {

      _.attrs({
          "xlink:href": d => this.registerLandSel(d.id),
          "fill": d => {
            let pattern = converter(d.cell, "texture");
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, converter(d.cell, "fill"));
              fn.init(svg);
              return `url(${fn.url()})`;
            } else {
              return converter(d.cell, "fill");
            }
          }
        });
      
    };

    d3Layer.classed("surface", true);
    d3Layer.classed("symbol", false);
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
          sign = Math.sign(d.cell.get('postProcessedValue')),
          fill = converter(d.cell, "fill"),
          strokeColor = converter(d.cell, "strokeColor");
      
      if (shape && r > 0) {
        
        let symbol = SymbolMaker.symbol({
          name: shape,
          size: r*2,
          sign: sign,
          barWidth: mapping.get('visualization.barWidth')
        });
      
        let el = symbol.insert(_);
        
        _.select("*").attrs({
          "stroke-width": symbol.unscale(mapping.get('visualization.stroke'))
        })
        .attr("i:i:stroke-width", mapping.get('visualization.stroke'));

        if (shape === "line") {
          strokeColor = fill;
        }
        
        el.attrs({
            "fill": fill,
            "stroke": strokeColor
          })
          .classed("shape", true);
          
      }
      
    };
    
   let bindAttr = (_) => {

      _.attr("transform", d => { 
        let [tx, ty] = d.point.path.centroid(d.point.feature.geometry);
        
        return d3lper.translate({
          tx: tx,
          ty: ty
        })
        
      });
      
      _.selectAll(".shape").remove();
      
      _.each(shapeFn);
      
    };

    d3Layer.classed("surface", false);
    d3Layer.classed("symbol", true);
    d3Layer.selectAll("*:not(.symbol)").remove();
    
    let centroidSel = d3Layer
			.selectAll("g.feature")
      .data(sortedData.filter( d => {
        let [tx, ty] = d.point.path.centroid(d.point.feature.geometry);
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
