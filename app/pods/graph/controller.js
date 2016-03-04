import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import MappingFactory from 'mapp/models/layer-mapping';
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
  
  autoDetectGeoCols() {
    
   let sortedCols = this.get('model.data.columns').filter( 
    col => ["geo", "lat", "lon", "lat_dms", "lon_dms"].indexOf(col.get('meta.type')) >= 0
   ).sort( (a,b) => a.get('probability') > b.get('probability') ? 1 : -1 );
   
   if (sortedCols[0]) {
     switch (sortedCols[0].get('meta.type')) {
       case "geo":
        return [sortedCols[0]];
       case "lat":
        let lon = sortedCols.find( c => c.get('meta.type') === "lon" );
        return [lon, sortedCols[0]];
       case "lon":
        let lat = sortedCols.find( c => c.get('meta.type') === "lat" );
        return [sortedCols[0], lat];
       case "lat_dms":
        let lonDms = sortedCols.find( c => c.get('meta.type') === "lon_dms" );
        return [lonDms, sortedCols[0]];
       case "lon_dms":
        let latDms = sortedCols.find( c => c.get('meta.type') === "lat_dms" );
        return [sortedCols[0], latDms];
       default:
        throw new Error(`Unknow geo colum type ${sortedCols[0].get('meta.type')}`);
     }
   }
   
   return [];
    
  },
  
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
          geoCols: this.autoDetectGeoCols()
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
