import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),
  
  setup() {
    this.set('selectedColumn', null);
  },
  
  selectedColumn: null,

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
