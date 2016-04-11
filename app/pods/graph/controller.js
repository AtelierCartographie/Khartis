import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import Projection from 'mapp/models/projection';
import topojson from 'npm:topojson';

export default Ember.Controller.extend({
  
  states: [
    "variables",
    "layout",
    "layers",
    "legend",
    "export"
  ],
  state: "variables",
  
  basemapData: null,
  
  editedLayer: null,
  editedColumn: null,
  displayProjection: true,
  
  availableProjections: function() {
    return this.get('Dictionnary.data.projections');
  }.property('Dictionnary.data.projections'),
  
  isInStateLayout: function() {
    return this.get('state') === "layout";
  }.property('state'),
  
  isInStateVariables: function() {
    return this.get('state') === "variables";
  }.property('state'),
  
  isInStateMapping: function() {
    return this.get('state') === "layers";
  }.property('state'),
  
  isInStateLegend: function() {
    return this.get('state') === "legend";
  }.property('state'),
  
  isInStateExport: function() {
    return this.get('state') === "export";
  }.property('state'),
  
  sidebarPartial: function() {
    return `graph/sidebar/${this.get('state')}`;
  }.property('state'),
  
  setup() {
    this.loadBasemap(this.get('model.graphLayout.basemap'))
      .then( (json) => {
        let j = JSON.parse(json);
        this.set('basemapData', {
          lands: topojson.feature(j, j.objects.land),
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
    'model.graphLayout.backgroundColor', 'model.graphLayout.backMapColor'),
  
  layersChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayers.[]', 'model.graphLayers.@each._defferedChangeIndicator'),
  
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
    
    bindColumnType(column, type) {
      if (type != null) {
        column.set('meta.type', type);
        column.set('meta.manual', true);
      } else {
        column.set('meta.manual', false);
      }
    },
    
    addLayer(col) {
      let layer = GraphLayer.createDefault(col, this.get('model.data.geoColumns'));
      this.get('model.graphLayers').unshiftObject(layer);
      this.transitionToRoute('graph.layer', layer.get('_uuid'));
    },
    
    editLayer(layer) {
      this.transitionToRoute('graph.layer.edit', layer.get('_uuid'));
    },
    
    removeLayer(layer) {
      this.get('model.graphLayers').removeObject(layer);
    },
    
    toggleLayerVisibility(layer) {
      layer.toggleProperty('visible');
    },
    
    bindLayerMapping(type) {
      this.set('editedLayer.mapping.type', type);
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
    
    resetTranslate() {
      this.get('model.graphLayout').setProperties({
        tx: 0,
        ty: 0
      });
      this.send("onAskVersioning", "freeze");
    },
    
    selectState(state) {
      this.set('state', state);
    },
    
    next() {
      this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))+1]);
    },
    
    back() {
      this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))-1]);
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
          this.get('store').versions().freeze(this.get('model').export());
          break;
      }
    }
    
  }
  
});
