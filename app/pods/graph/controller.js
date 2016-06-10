import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import Mapping from 'mapp/models/mapping/mapping';
import Projection from 'mapp/models/projection';
import topojson from 'npm:topojson';

export default Ember.Controller.extend({
  
  queryParams: ['currentTab'],
  currentTab: null,

  states: [
    "visualizations",
    "export"
  ],
  state: "visualizations",
  
  basemapData: null,

  sidebarSubExpanded: false,
  
  editedLayer: null,
  editedColumn: null,

  onCurrentTabChange: function() {
    if (this.get('states').indexOf(this.get('currentTab')) !== -1) {
      this.set('state', this.get('currentTab'));
    }
  }.observes('currentTab').on("init"),
  
  availableProjections: function() {
    return this.get('Dictionnary.data.projections')
      .filter( p => p.id !== "lambert_azimuthal_equal_area");
  }.property('Dictionnary.data.projections'),
  
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
  
  setup() {
    this.loadBasemap(this.get('model.graphLayout.basemap'))
      .then( (json) => {
        let j = JSON.parse(json);
        this.set('basemapData', {
          land: topojson.merge(j, j.objects.land.geometries),
          lands: topojson.feature(j, j.objects.land),
          borders: topojson.mesh(j, j.objects.border, function(a, b) {
              return a.properties.featurecla === "International"; 
            }),
          bordersDisputed: topojson.mesh(j, j.objects.border, function(a, b) { 
              return a.properties.featurecla === "Disputed"; 
            }),
          centroids: topojson.feature(j, j.objects.centroid)
        });
      });
  },
  
  //TODO : basemap selection
  loadBasemap(basemap) {
    
    return new Promise((res, rej) => {
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${config.baseURL}data/map/${basemap}`, true);

      xhr.onload = (e) => {
        
        if (e.target.status == 200) {
          res(e.target.response);
        }
        
      };

      xhr.send();
      
    });
    
  },
  
  layoutChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayout.width', 'model.graphLayout.height', 'model.graphLayout.zoom',
    'model.graphLayout.tx', 'model.graphLayout.ty',
    'model.graphLayout.backgroundColor', 'model.graphLayout.backMapColor',
    'graphLayout.showGrid', 'graphLayout.showLegend', 'graphLayout.showBorders',
    'model.graphLayout.title', 'model.graphLayout.author', 'model.graphLayout.dataSource', 'model.graphLayout.comment'),
  
  layersChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayers.[]', 'model.graphLayers.@each._defferedChangeIndicator'),
  
  exportSVG() {
    var blob = new Blob([this.exportAsHTML()], {type: "image/svg+xml"});
    saveAs(blob, "export_mapp.svg");
  },

  exportPNG() {

    let data = new FormData();
    data.append("content", this.exportAsHTML());

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://slave.apyx.fr:9876/', true);
    xhr.responseType="blob";
    xhr.onload = function () {
        saveAs(this.response, "export_mapp.png");
    };
    xhr.send(data);

  },

  exportAsHTML() {
    
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    let node = d3.select("svg.map-editor")
        .node().cloneNode(true);
        
    let d3Node = d3.select(node);
    
    let x = d3Node.selectAll("g.offset line.vertical-left").attr("x1"),
        y = d3Node.selectAll("g.offset line.horizontal-top").attr("y1"),
        w = this.get('model.graphLayout.width'),
        h = this.get('model.graphLayout.height');
    
    d3Node.attr({
      width: this.get('model.graphLayout.width'),
      height: this.get('model.graphLayout.height'),
      viewBox: `${x} ${y} ${w} ${h}`
    });

    d3Node.selectAll("g.margin,g.offset").remove();
    d3Node.selectAll("rect.fg").remove();
    
    /*d3Node.select("defs")
      .append("clipPath")
      .attr("id", "view-clip")
      .append("rect")
      .attr({
        x: 0,
        y: 0,
        width: w,
        height: h
      });*/
      
    d3Node.select(".map")
      .attr("clip-path", "url(#viewport-clip)");
              
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
      this.transitionToRoute('graph.layer.edit', this.get('model.graphLayers').objectAt(layerIndex).get('_uuid'));
    },
    
    removeLayer(layer) {
      this.get('ModalManager')
        .show('confirm', "Êtes vous sur de vouloir supprimer ce calque ?",
          "Confirmation de suppression", 'Oui', 'Annuler')
        .then(() => {
          this.get('model.graphLayers').removeObject(layer);
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
    },
    
    bindMappingScaleOf(layer, type) {
      layer.set('mapping.scaleOf', type);
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
      if (id === "linear-tab") {
        this.send('bindScaleIntervalType', this.get('editedLayer.mapping.scale'), 'linear');
      } else if (this.get('editedLayer.mapping.scale.intervalType') === "linear") {
        this.send('bindScaleIntervalType', this.get('editedLayer.mapping.scale'), 'regular');
      }
    },

    onValueBreakFocusOut() {
      this.get('editedLayer.mapping').clampValueBreak();
    },
    
    export(format) {
      if (format === "svg") {
        this.exportSVG();
      } else {
        this.exportPNG();
      }
    },
    
    selectState(state) {
      this.set('state', state);
      this.transitionToRoute('graph');
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
