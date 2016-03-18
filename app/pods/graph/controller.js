import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import MappingFactory from 'mapp/models/layer-mapping';
import topojson from 'npm:topojson';

export default Ember.Controller.extend({
  
  state: null,
  
  basemapData: null,
  
  availableProjections: projector.projections,
  
  isInStateLayout: function() {
    return this.get('state') === "layout";
  }.property('state'),
  
  isInStateGeovars: function() {
    return this.get('state') === "geovars";
  }.property('state'),
  
  isInStateMapping: function() {
    return this.get('state') === "mapping";
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
    
      bindProjection(projId) {
        this.set('model.graphLayout.projection', projId);
        this.send('onAskVersioning', 'freeze');
      },
      
      addLayer(col) {
        this.get('model.graphLayers').addObject(GraphLayer.createDefault({
          varCol: col,
          geoCols: this.get('model.data.geoColumns')
        }));
      },
      
      removeLayer(layer) {
        this.get('model.graphLayers').removeObject(layer);
      },
      
      toggleLayerVisibility(layer) {
        layer.toggleProperty('visible');
      },
      
      bindLayerMapping(layer, type) {
        layer.set('mapping', MappingFactory.createInstance(type));
        if (type === "text") {
          layer.set('mapping.labelCol', layer.get('varCol'));
        }
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
      
      onAskVersioning(type) {
        console.log('onAskVersioning', type);
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
        
      },
      
      selectState(state) {
        this.transitionToRoute(`graph.${state}`, this.get('model._uuid'));
      },
      
      next() {
        this.transitionToRoute("graph.mapping", this.get('model._uuid'));
      },
      
      back() {
        if (this.get('isInStateLayout')) {
          this.transitionToRoute("project.step4", this.get('model._uuid'));
        } else if (this.get('isInStateMapping')) {
          this.transitionToRoute("graph.layout", this.get('model._uuid'));
        }
      }
    
    }
  
});
