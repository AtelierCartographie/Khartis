import Ember from 'ember';
import d3 from 'd3';
import config from 'khartis/config/environment';
import GraphLayer from 'khartis/models/graph-layer';
import Mapping from 'khartis/models/mapping/mapping';
import FilterFactory from 'khartis/models/mapping/filter/factory';
import Projection from 'khartis/models/projection';
import {concatBuffers, uint32ToStr, calcCRC, build_pHYs, build_tEXt, tracePNGChunks} from 'khartis/utils/png-utils';
import {isSafari} from 'khartis/utils/browser-check';

export default Ember.Controller.extend({
  
  queryParams: ['currentTab'],
  currentTab: "visualizations",

  dictionary: Ember.inject.service(),

  states: [
    "visualizations",
    "export"
  ],
  state: "visualizations",
  
  sidebarSubExpanded: false,
  
  editedLayer: null,
  editedColumn: null,

  onCurrentTabChange: function() {
    if (this.get('states').indexOf(this.get('currentTab')) !== -1) {
      this.set('state', this.get('currentTab'));
    }
  }.observes('currentTab').on("init"),

  projectionConfigurable: function() {
     return !this.get('model.graphLayout.basemap.projectionProvided'); 
  }.property('model.graphLayout.basemap.projectionProvided'),
  
  availableProjections: function() {
    return this.get('model.graphLayout.basemap.availableProjections')
      .filter( p => p.id !== "lambert_azimuthal_equal_area");
  }.property('model.graphLayout.availableProjections'),
  
  isInStateVisualization: function() {
    return this.get('state') === "visualizations";
  }.property('state'),
  
  isInStateExport: function() {
    return this.get('state') === "export";
  }.property('state'),
  
  sidebarPartial: function() {
    return `graph/_sidebar/${this.get('state')}`;
  }.property('state'),

  sidebarActiveTab: function() {
    return this.get('state');
  }.property('state'),

  hasNextState: function() {
    return this.get('states').indexOf(this.get('state')) < (this.get('states').length - 1);
  }.property('state'),

  helpTemplate: function() {
    return `help/{locale}/graph/${this.get('state')}`;
  }.property('state'),
  
  layoutChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayout.width', 'model.graphLayout.height', 'model.graphLayout.zoom',
    'model.graphLayout.tx', 'model.graphLayout.ty',
    'model.graphLayout.backgroundColor', 'model.graphLayout.backmapColor',
    'model.graphLayout.showGrid', 'model.graphLayout.showLegend', 'model.graphLayout.showBorders',
    'model.graphLayout.title', 'model.graphLayout.author', 'model.graphLayout.dataSource', 'model.graphLayout.comment',
    'model.graphLayout.margin._defferedChangeIndicator'),
  
  layersChange: function() {

    if (this.get('model.graphLayout.showLegend') === null && this.get('model.graphLayers').length) {
      this.set('model.graphLayout.showLegend', true);
    } else if (!this.get('model.graphLayers').length) {
      this.set('model.graphLayout.showLegend', null);
    }
    this.send('onAskVersioning', 'freeze');

  }.observes('model.graphLayers.[]', 'model.graphLayers.@each._defferedChangeIndicator',
    'model.labellingLayers.[]', 'model.labellingLayers.@each._defferedChangeIndicator'),

  exportSVG(targetIllustrator) {
    let compatibility = targetIllustrator ? {illustrator: true} : undefined,
        blob = new Blob([this.exportAsHTML(compatibility)], {type: isSafari() ? "application/octet-stream" : "image/svg+xml"});
    saveAs(blob, "export_khartis.svg");
  },

  exportPNG() {

    let _this = this;

    var svgString = this.exportAsHTML();

    var fact = 4.16;
    var canvas = document.getElementById("export-canvas");
    canvas.width = this.get('model.graphLayout.width')*fact;
    canvas.height = this.get('model.graphLayout.height')*fact;
    var ctx = canvas.getContext("2d");
    ctx.scale(fact, fact);
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml"});
    var url = DOMURL.createObjectURL(svg);

    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(function(blob) {

        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function() {

            arrayBuffer = this.result;
            let dv = new DataView(arrayBuffer),
                firstIDATChunkPos = undefined,
                pos = 8,
                getUint32 = function() {
                  var data = dv.getUint32(pos, false);
                  pos += 4;
                  return data;
                };
            
            //find first IDAT chunk
            while (pos < dv.buffer.byteLength) {
              let size = getUint32(),
                  name = uint32ToStr(getUint32());
              if (name === "IDAT" && !firstIDATChunkPos) {
                firstIDATChunkPos = pos - 8;
                break;
              } else {
                pos += size;
              }
              getUint32(); //crc
            }

            let left = arrayBuffer.slice(0, firstIDATChunkPos),
                right = arrayBuffer.slice(firstIDATChunkPos);

            let extraBuffer = build_pHYs(300);

            let meta = {
              "Comment": "Made with Khartis",
              "Software": "Khartis"
            };

            for (let k in meta) {
              extraBuffer = concatBuffers(build_tEXt(k, meta[k]), extraBuffer);
            }

            let pngBuffer = concatBuffers(concatBuffers(left, extraBuffer), right);

            //tracePNGChunks(pngBuffer);

          saveAs(new Blob([pngBuffer], {type: isSafari() ? "application/octet-stream" :  "image/png"}), "export_khartis.png");
          DOMURL.revokeObjectURL(url);

        };
        fileReader.readAsArrayBuffer(blob);

      }, "image/png", 1);

        
    };
    img.src = url;

  },

  exportAsHTML(compatibility = {}) {
    
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    let node = d3.select("svg.map-editor")
        .node().cloneNode(true);
        
    let d3Node = d3.select(node);
    
    let x = parseInt(d3Node.selectAll("g.offset line.vertical-left").attr("x1")),
        y = parseInt(d3Node.selectAll("g.offset line.horizontal-top").attr("y1")),
        w = this.get('model.graphLayout.width'),
        h = this.get('model.graphLayout.height');
    
    d3Node.attr({
      width: this.get('model.graphLayout.width'),
      height: this.get('model.graphLayout.height'),
      viewBox: `${x} ${y} ${w} ${h}`,
      title: d3Node.attr('title') || "Khartis project"
    });

    d3Node.selectAll("g.margin,g.offset,g.margin-resizer").remove();
    d3Node.selectAll("rect.fg").remove();

    d3Node.append("text")
      .text("Made with Khartis")
      .attr({
        "x": x+w,
        "y": y+h,
        "dy": "-0.81em",
        "dx": "-0.81em",
        "font-size": "0.8em",
        "text-anchor": "end"
      });
      
    d3Node.select("#outerMap")
      .attr("clip-path", "url(#viewport-clip)");

    //netooyage des attributs internes
    let khartisAttrs = [
      {ns: "kis", attr: "flow-css", fn: null},
      {ns: "kis", attr: "tx", fn: null},
      {ns: "kis", attr: "ty", fn: null},
      {ns: "kis", attr: "height", fn: null},
      {ns: "kis", attr: "width", fn: null}
    ];

    if (compatibility.illustrator) {
      khartisAttrs.push({
        ns: "i",
        attr: "stroke-width",
        fn: (node) => node.attr({
              "stroke-width": node.attr(`i:i:stroke-width`),
              "i:i:stroke-width": null
            })
      });

      d3Node.select(".legend").attr("i:i:layer", "yes").attr("id", "legend");
      d3Node.select("#outerMap").attr("i:i:layer", "yes");
      d3Node.selectAll("*[display='none']").remove();

      d3Node.selectAll("g.layer.surface").each( function(d, i) {
        d3.select(this).attr("id", `viz-surface${i > 0 ? '-'+i: ''}`);
      });

      d3Node.selectAll("g.layer.symbol").each( function(d, i) {
        d3.select(this).attr("id", `viz-symbol${i > 0 ? '-'+i: ''}`);
      });

      //remove #map node
      let mapChilds = d3Node.selectAll("#map > *").remove().nodes();
      mapChilds.forEach( node => d3Node.select("#outerMap").append( () => node) );
      d3Node.select("#map").remove();

      //wrap nodes
      let wrapper = d3Node.append("g")
            .attr({
              "id": "view-box",
              "i:i:extraneous": "self",
              "transform": `translate(${-x}, ${-y})`
            });

      [].slice.call(d3Node.node().children).forEach( node => {
        if (node != wrapper.node() && ['g', 'text', 'rect'].indexOf(node.tagName)+1) {
          wrapper.append(() => d3.select(node).remove().node());
        }
      });

      //rewrite viewport because illustrator doesn't read x y
      d3Node.attr("viewBox", `0 0 ${w} ${h}`);

    }

    khartisAttrs.forEach(kAttr => {
      d3Node.selectAll(`[${kAttr.ns}\\:${kAttr.attr}]`)[0]
        .forEach( (node) => {
          kAttr.fn || (kAttr.fn = (node) => node.attr(`${kAttr.ns}:${kAttr.ns}:${kAttr.attr}`, null));
          kAttr.fn(node = d3.select(node));
        });
    });
              
    let html = d3Node.node()
      .outerHTML
      .replace(/http:[^\)"]*?#/g, "#")
      .replace(/&quot;/, "")
      .replace(/NS\d+\:/g, "xlink:");

    d3Node.remove();

    return html;
    
  },
  
  freeze: function() {
    this.get('store').versions().freeze(this.get('model').export());
  },
  
  invertSliderFn: function() {
    let fn = function(val) {
      return -val;
    }
    fn.invert = function(val) {
      return -val;
    }

    return fn;
  }.property(),
  
  actions: {
    
    bindProjection(proj) {
      this.set('model.graphLayout.projection', Projection.create(proj.export()));
      this.send('onAskVersioning', 'freeze');
    },
    
    editColumn(col) {
      if (col.get('incorrectCells.length')) {
        this.transitionToRoute('graph.column', col.get('_uuid'));
      }
    },
    
    addLayer(col) {
      let layer = GraphLayer.createDefault(col, this.get('model.geoDef'));
      this.get('model.graphLayers').unshiftObject(layer);
      this.transitionToRoute('graph.layer', layer.get('_uuid'));
    },
    
    editLayer(layerIndex) {
      let layer = this.get('model.graphLayers').objectAt(layerIndex);
      if (layer != this.get('editedLayer')) {
        this.transitionToRoute('graph.layer.edit', layer.get('_uuid'));
      } else {
        this.transitionToRoute('graph');
      }
    },
    
    removeLayer(layer) {
      this.get('ModalManager')
        .show('confirm', Ember.String.capitalize(this.get('i18n').t('visualization.alert.remove.content').string),
          Ember.String.capitalize(this.get('i18n').t('visualization.alert.remove.title').string),
          Ember.String.capitalize(this.get('i18n').t('general.yes').string),
          Ember.String.capitalize(this.get('i18n').t('general.cancel').string))
        .then(() => {
          this.get('model.graphLayers').removeObject(layer);
        });
    },

    removeLabellingLayer(layer) {
      this.get('ModalManager')
         .show('confirm', Ember.String.capitalize(this.get('i18n').t('visualization.alert.remove.content').string),
          Ember.String.capitalize(this.get('i18n').t('visualization.alert.remove.title').string),
          Ember.String.capitalize(this.get('i18n').t('general.yes').string),
          Ember.String.capitalize(this.get('i18n').t('general.cancel').string))
        .then(() => {
          this.get('model.labellingLayers').removeObject(layer);
        });
    },
    
    toggleLayerVisibility(layer) {
      layer.toggleProperty('visible');
    },
    
    bindLayerMapping(type) {
      this.set('editedLayer.mapping', Mapping.create({
        type: type,
        varCol: this.get('editedLayer.mapping.varCol'),
        geoDef: this.get('editedLayer.mapping.geoDef')
      }));
      if (type === "quali.cat_surfaces" || type === "quanti.val_surfaces") {
        this.set('editedLayer.opacity', 1);
      }
    },

    alignLabels(to) {
      this.get('model.labellingLayers')[0].set('mapping.visualization.anchor', to);
    },
    
    bindMappingPattern(layer, pattern) {
      layer.set('mapping.pattern', pattern);
    },
    
    bindMappingShape(layer, shape) {
      layer.set('mapping.shape', shape);
    },
    
    bindMappingLabelCol(layer, col) {
      layer.set('mapping.labelCol', col);
    },
    
    bindScaleIntervalType(scale, type) {
      scale.set('intervalType', type);
    },
    
    bind(root, prop, value) {
      root.set(prop, value);
    },
    
    toggleRuleVisibility(rule) {
      rule.toggleProperty('visible');
    },

    toggleBordersVisibility() {
      this.toggleProperty('model.graphLayout.showBorders');
    },

    toggleGridVisibility() {
      this.toggleProperty('model.graphLayout.showGrid');
    },

    toggleLegendVisibility() {
      this.toggleProperty('model.graphLayout.showLegend');
    },

    toggleLabellingVisibility() {
      if (this.get('model.labellingLayers') && this.get('model.labellingLayers').length) {
        this.get('model.labellingLayers').forEach( ll => ll.toggleProperty('visible') );
      } else {
        let col = this.get('model.data.columns')[0],
            layer = GraphLayer.createDefault(col, this.get('model.geoDef'));
        this.get('model.labellingLayers').unshiftObject(layer);
        layer.set('mapping.type', "labelling");
      }
    },

    setLabellingCol(layer, col) {
      layer.set('mapping.varCol', col);
    },

    setLabellingFilterCol(layer, col) {
      if (col) {
        layer.set('mapping.filter', FilterFactory.createInstance(
          col.get('meta.type') === "numeric" ? "range" : "category",
          {varCol: col}
        ));
      } else {
        layer.set('mapping.filter', null);
      }
    },

    toggleLabellingFilterCategory(filter, cat) {
      filter.toggleCategory(cat);
    },

    selectAllLabellingFilterCategory(filter, mod) {
      filter.selectAllCategory(mod);
    },
    
    resetTranslate() {
      this.get('model.graphLayout').setProperties({
        zoom: 1,
        tx: 0,
        ty: 0
      });
    },
    
    zoomPlus() {
      if (this.get('model.graphLayout.zoom') < 12) {
        this.incrementProperty('model.graphLayout.zoom');
      }
    },
    
    zoomMoins() {
      if (this.get('model.graphLayout.zoom') > 0) {
        this.decrementProperty('model.graphLayout.zoom');
      }
    },

    onIntervalTypeTabChange(id) {
      this.set('editedLayer.mapping.scale.usesInterval', !(id === "linear-tab"));
    },

    updateValueBreak(val) {
      if (Ember.isEmpty(val)) {
        this.set('editedLayer.mapping.scale.valueBreak', null);
      } else {
        this.set('editedLayer.mapping.scale.valueBreak', val);
        this.get('editedLayer.mapping').clampValueBreak();
      }
    },

    randomizeRules() {
      this.get('editedLayer.mapping').generateRules(true);
    },
    
    export(format, target = undefined) {
      if (format === "svg") {
        this.exportSVG(target === "illustrator");
      } else {
        this.exportPNG();
      }
    },
    
    selectState(state) {
      this.transitionToRoute('graph', this.get('model._uuid'), { queryParams: { currentTab: state }});
    },

    setBlindnessMode(mode) {
      this.set('model.blindnessMode', mode);
    },
    
    next() {
      this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))+1]);
    },
    
    back() {
      if (this.get('states').indexOf(this.get('state')) > 0) {
        this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))-1]);
      } else {
        this.send('navigateToProject');
      }
    },

    closeSidebarSub() {
      this.transitionToRoute('graph');
    },

    navigateToProject() {
      this.transitionToRoute('project.step2', this.get('model._uuid'));
    },

    navigateToVisualizations() {
      this.send('selectState', 'visualizations');
    },

    navigateToExport() {
      this.send('selectState', 'export');
    },
    
    onAskVersioning(type) {
      switch (type) {
        case "undo":
          this.get('store').versions().undo();
          break;
        case "redo": 
          this.get('store').versions().redo();
          break;
        case "freeze":
          Ember.run.debounce(this, this.freeze, 1000);
          break;
      }
    }
    
  }
  
});
