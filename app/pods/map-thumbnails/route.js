import Ember from 'ember';
import Basemap from 'khartis/models/basemap';
import GraphLayout from 'khartis/models/graph-layout';
import config from 'khartis/config/environment';

export default Ember.Route.extend({

  dictionary: Ember.inject.service(),

  _model: null,
  
  model() {
    
    let promises = this.get('dictionary.data.maps').map( m => {
      let gl = GraphLayout.createDefault();
      gl.set('backmapColor', config.mapThumbnail.color);
      gl.set('backgroundColor', "#FFFFFF");
      return gl.setBasemap(Basemap.create({id: m.id}))
        .then( () => gl );
    });
    return Promise.all(promises).then( vals => this.set('_model', vals) );
  },

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, function() {
        window.__mapThumbnails = this.get('_model').map( l => ({id: l.get('basemap.id')}) );
      });
    }
  }
  
});
