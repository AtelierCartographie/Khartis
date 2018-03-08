import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import PatternMaker from 'khartis/utils/pattern-maker';
import SymbolMaker from 'khartis/utils/symbol-maker';
import ViewportFeature from './viewport';
import MappingFeature from './mapping';
import LegendFeature from './legend';
import ZoomFeature from './zoom';
import LabellingFeature from './labelling';
import CompositionBordersFeature from './composition-borders';
import CreditsFeature from './credits';
import DocumentMaskFeature from './document-mask';
import HoverFeature from './hover';
import DrawingFeature from './drawing';
import { EventNotifierFeature } from './event-notifier';

/* global Em */

export default Ember.Component.extend(EventNotifierFeature, {
  
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
  
  dataSource: null,
  title: null,
  author: null,

  labellingLayers: [],

  _resizeInterval: null,
  _landSelSet: null,

  /* traits */
  hasMappingFeature: false,
  hasViewportFeature: true,
  hasLegendFeature: true,
  hasZoomFeature: true,
  hasLabellingFeature: true,
  hasCompositionBordersFeature: true,
  hasCreditsFeature: true,
  hasDocumentMaskFeature: true,
  hasHoverFeature: false,
  hasDrawingFeature: false,
  /* ---- */

  windowLocation: function() {
    return window.location;
  }.property(),
  
  init() {
    this._super();
    this.set('_landSelSet', new Set());
  },

  getFeaturesFromBase(ns, ns2 = "features") {
    return this.get('base').reduce( (out, base) => {
      let path = this.getProjectedPath(base.projection);
      return out.concat(
        base[ns][ns2].map(f => ({path: path, feature: f}))
      );
    }, []);
  },

  getFeaturesIndexFromBase(geoKey, ns, ns2 = "features") {
    return this.get('base').reduce( (index, base) => {
      let path = this.getProjectedPath(base.projection);
      base[ns][ns2].forEach(f => {
        index[`${f.properties[geoKey]}`] = {path: path, feature: f}
      });
      return index;
    }, {});
  },
  
	draw: function() {
    
		var d3g = this.d3l();
    
    d3g.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    d3.namespaces.illustrator = 'http://ns.adobe.com/AdobeIllustrator/10.0/';
    d3g.attr("xmlns:i", d3.namespaces.illustrator);
    d3.namespaces.khartis = 'http://www.sciencespo.fr/cartographie/khartis/';
    d3g.attr("xmlns:kis", d3.namespaces.khartis);
    d3.namespaces.flowcss = 'http://www.apyx.fr/flowcss/';
    d3g.attr("xmlns:flow", d3.namespaces.flowcss);
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
      let $width = this.element.parentElement.clientWidth,
          $height = this.element.parentElement.clientHeight;
      
      if ($width != this.get('$width') || $height != this.get('$height')) {
        this.setProperties({
          '$width': this.element.parentElement.clientWidth,
          '$height': this.element.parentElement.clientHeight
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
      .classed("zoomable", true)
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

    if (this.get('hasMappingFeature')) {
      this.reopen(MappingFeature, {graphLayers: this.get('graphLayers')});
    }
    if (this.get('hasViewportFeature')) {
      this.reopen(ViewportFeature, {displayOffsets: this.get('displayDocumentMask')});
      this.viewportInit(defs, d3g);
    }
    if (this.get('hasCreditsFeature')) {
      this.reopen(CreditsFeature);
      this.creditsInit(d3g);
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
    if (this.get('hasDrawingFeature')) {
      this.reopen(DrawingFeature);
      this.drawingInit(defs, mapG);
    }
    if (this.get('hasCompositionBordersFeature')) {
      this.reopen(CompositionBordersFeature);
      this.compositionBordersInit(mapG);
    }
    if (this.get('hasDocumentMaskFeature')) {
      this.reopen(DocumentMaskFeature, {displayDocumentMask: this.get('displayDocumentMask')});
      this.documentMaskInit(defs, d3g);
    }
    if (this.get('hasHoverFeature')) {
      this.reopen(HoverFeature, {defaultGeoDef: this.get('defaultGeoDef')});
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
          projection.initialTranslate[0]*this.get('graphLayout.zoom')+tx,
          projection.initialTranslate[1]*this.get('graphLayout.zoom')+ty
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
       projs = this.get('projector').projectionsForLatLon(
        latLon,
        this.get('graphLayout.zoom'),
        this.get('graphLayout.tx')*this.getSize().w,
        this.get('graphLayout.ty')*this.getSize().h
      );
    if (projs.length) {
      return path.projection(projs[0]);
    } else {
      return null;
    }
  },

  assumePathForXY(xy) {
    let path = d3.geoPath(),
       projs = this.get('projector').projectionsForXY(
        xy,
        this.get('graphLayout.zoom'),
        this.get('graphLayout.tx')*this.getSize().w,
        this.get('graphLayout.ty')*this.getSize().h
      );
    if (projs.length) {
      return path.projection(projs[0]);
    } else {
      return null;
    }
  },

  redraw: function() {
    this.projectAndDraw();
  }.observes('windowLocation', 'projector'),
	
	projectAndDraw() {
    
    let {w, h} = this.getSize();
    
    let path = this.getProjectedPath(),
        precision = this.get('graphLayout.precision'),
        defs = this.d3l().select("defs");
    
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

	},
  
  registerLandSel(id) {
    this.get('_landSelSet').add(`${id}`);
    return `#f-path-${id}`;
  },
  
  drawLandSel() {

    
    let geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        features = this.getFeaturesFromBase("lands")
          .filter( f => this.get('_landSelSet').has(`${f.feature.properties[geoKey]}`) );
    
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

    

  }.observes('graphLayout.backmapColor', 'graphLayout.showBorders', 'graphLayout.stroke')
  
});
