import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import topojson from 'npm:topojson';

export default Ember.Controller.extend({
  
  basemapData: null,
  
  availableProjections: projector.projections,
    
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
  
  actions: {
    
      projectionChange() {
        this.send('onAskVersioning');
      },
      
      addLayer(col) {
        this.get('model.graphLayers').addObject(GraphLayer.create({
          varCol: col
        }));
      },
      
      bindLayerType(layer, type) {
        layer.set('type', type);
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
