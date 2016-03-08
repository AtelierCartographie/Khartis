import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),
  
  setup() {
    this.set('selectedColumn', null);
  },
  
  selectedColumn: null,
  
  //TODO : rewrite this method
  hasGeoColumns: function() {
    let cols = this.get('model.project.data.geoColumns');
    return (cols.length > 0 && cols.some( c => c && c.get('meta.type') === "geo" ))
      || (cols.length === 2 && cols[0] && cols[0].get('meta.type') === "lat" && cols[1] && cols[1].get('meta.type') === "lon")
      || (cols.length === 2 && cols[0] && cols[0].get('meta.type') === "lon" && cols[1] && cols[1].get('meta.type') === "lat");
  }.property('model.project.data.geoColumns'),
  
  displayWarningForType: function() {
    return this.get('selectedColumn.inconsistency') > 0;
  }.property('selectedColumn.inconsistency'),

  actions: {
    
    selectColumn(column) {
      this.set('selectedColumn', column);
    },
    
    removeColumn(column) {
      this.get('model.project').removeLayerMappedToColumn(column);
      this.get('model.project.data').removeColumn(column);
      this.set('selectedColumn', null);
      this.get('store').versions().freeze(this.get('model.project').export());
    },
    
    editColumnType(column) {
      
    },
    
    bindColumnType(column, type) {
      if (type != null) {
        column.set('meta.type', type);
        column.set('meta.manual', true);
      } else {
        column.set('meta.manual', false);
      }
    },

    back() {
      this.transitionToRoute('project.step2');
    },

    next(){
      this.transitionToRoute('project.step4');
    }
  }

});
