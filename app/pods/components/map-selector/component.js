import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['map-selector'],
  queryMaps:Ember.computed('maps', function(){
    return this.get('maps');
  }),

  // Basemap.create({id: mapId}

  actions: {
    select(id){
      this.sendAction('onSelect', id)
    }
  }

});