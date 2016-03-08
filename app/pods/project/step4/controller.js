import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),

  actions: {
    
    selectMap(map) {
      this.transitionToRoute('graph', this.get('model.project._uuid'));
    },

    back() {
      this.transitionToRoute('project.step3');
    },

    next(){
      this.transitionToRoute('project.step4');
    }
  }

});
