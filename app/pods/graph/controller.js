import Ember from 'ember';
import ExportMixin from './export-mixin';
import d3 from 'npm:d3';
import GraphLayer from 'khartis/models/graph-layer';
import Mapping from 'khartis/models/mapping/mapping';
import MultiMapping from 'khartis/models/mapping/multi-mapping';
import FilterFactory from 'khartis/models/mapping/filter/factory';
import Projection from 'khartis/models/projection';
import {HOOK_BEFORE_SAVE_PROJECT} from 'khartis/services/store';
import { DRAWING_EVENT } from '../components/map-editor/drawing';
import EventNotifier from '../components/map-editor/event-notifier';

export default Ember.Controller.extend(ExportMixin, {
  
  store: Ember.inject.service(),

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

  tooltipEnabled: false,
  hoveredData: null,
  drawingToolsEnabled: true,
  selectedDrawingFeature: null,

  mapEditorEventNotifier: EventNotifier.create(),

  init() {
    this._super();
    this.get('store').addHook(HOOK_BEFORE_SAVE_PROJECT, this.onBeforeSaveProject.bind(this));
    this.get('mapEditorEventNotifier').on(DRAWING_EVENT, this, function(type) {
      if (type === "pre-awake") {
        !this.get('drawingToolsEnabled') && this.set('drawingToolsEnabled', true);
        !this.get('isInStateExport') && this.send('navigateToExport');
      }
    });
  },

  onBeforeSaveProject(project) {
    return this.makeThumbnail().then( data => {
      if (project.set) {
        project.set('thumbnail', data);
      } else {
        project.thumbnail = data;
      }

    });
  },

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
      //.filter( p => p.id !== "lambert_azimuthal_equal_area");
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

  shouldDisplayDrawingTools: function() {
    return this.get('state') === "export" && this.get('drawingToolsEnabled');
  }.property('state', 'drawingToolsEnabled'),
  
  layoutChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayout.width', 'model.graphLayout.height', 'model.graphLayout.zoom',
    'model.graphLayout.tx', 'model.graphLayout.ty',
    'model.graphLayout.backgroundColor', 'model.graphLayout.backmapColor',
    'model.graphLayout.showGrid', 'model.graphLayout.showLegend', 'model.graphLayout.showBorders',
    'model.graphLayout.margin._defferedChangeIndicator',
    'model.graphLayout.legendLayout._defferedChangeIndicator',
    'model.graphLayout.drawings.@each._defferedChangeIndicator',
    'model.title', 'model.author', 'model.dataSource', 'model.comment',
    'model.titleStyle', 'model.authorStyle', 'model.dataSourceStyle', 'model.commentStyle'),
  
  layersChange: function() {

    if (this.get('model.graphLayout.showLegend') === null && this.get('model.graphLayers').length) {
      this.set('model.graphLayout.showLegend', true);
    } else if (!this.get('model.graphLayers').length) {
      this.set('model.graphLayout.showLegend', null);
    }
    this.send('onAskVersioning', 'freeze');

  }.observes('model.graphLayers.[]', 'model.graphLayers.@each._defferedChangeIndicator',
    'model.labellingLayers.[]', 'model.labellingLayers.@each._defferedChangeIndicator'),

  freeze: function() {
    this.get('store').versions().freeze(this.get('model'));
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
    
    addLayer() {
      let layer = GraphLayer.createDefault(null, this.get('model.geoDef'));
      this.get('model.graphLayers').unshiftObject(layer);
      this.get('model.graphLayout.legendLayout').addLayer(layer);
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
          this.get('model.graphLayout.legendLayout').removeLayer(layer);
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
    
    bindLayerMapping(type, ordered) {
      if (type.split(".").indexOf("combined") !== -1) {
        this.set('editedLayer.mapping', MultiMapping.create({
          type,
          geoDef: this.get('editedLayer.mapping.geoDef')
        }));
      } else {
        this.set('editedLayer.mapping', Mapping.create({
          type,
          ordered,
          varCol: this.get('editedLayer.mapping.varCol'),
          geoDef: this.get('editedLayer.mapping.geoDef')
        }));
        if (type === "quali.cat_surfaces" || type === "quanti.val_surfaces") {
          this.set('editedLayer.opacity', 1);
        }
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
    
    bind(root, prop, value) {
      root.set(prop, value);
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

    toggleTooltip() {
      this.toggleProperty('tooltipEnabled');
    },

    export(format, opts = undefined) {
      if (format === "svg") {
        this.exportSVG(opts === "illustrator");
      } else {
        this.exportPNG(opts);
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

    onMapElementOver(data) {
      if (data) {
        this.set("hoveredData", data);
      }
    },

    onMapElementOut() {
      this.set("hoveredData", null);
    },

    toggleDrawingTools() {
      this.toggleProperty('drawingToolsEnabled');
      if (this.get('drawingToolsEnabled')) {
        this.get('mapEditorEventNotifier').trigger(DRAWING_EVENT, "activate");
      } else {
        this.get('mapEditorEventNotifier').trigger(DRAWING_EVENT, "deactivate");
      }
    },

    onDrawingFeatureSelected(feature) {
      this.set('selectedDrawingFeature', feature);
    },

    activateDrawingTool(type) {
      this.set('drawingToolsEnabled', true);
      this.get('mapEditorEventNotifier').triggerThen(DRAWING_EVENT, "activate")
        .then( eventNotifier => eventNotifier.trigger(DRAWING_EVENT, type) );
    },
    
    onDeleteDrawingFeature(feature) {
      this.get('model.graphLayout.drawings').removeObject(feature);
      this.set('selectedDrawingFeature', null);
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
          Ember.run.debounce(this, this.freeze, 1500);
          break;
      }
    }
    
  }
  
});
