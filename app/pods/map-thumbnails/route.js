import Ember from 'ember';
import Basemap from 'khartis/models/basemap';
import GraphLayout from 'khartis/models/graph-layout';

export default Ember.Route.extend({

  dictionary: Ember.inject.service(),
  
  model() {
    let promises = this.get('dictionary.data.maps').map( m => {
      let gl = GraphLayout.createDefault();
      return gl.setBasemap(Basemap.create({id: m.id}))
        .then( () => gl );
    });
    return Promise.all(promises);
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
