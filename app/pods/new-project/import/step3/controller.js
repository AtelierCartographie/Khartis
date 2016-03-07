import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),

  actions: {

    back() {
      this.transitionToRoute('new-project.import.step2');
    },

    next(){
      this.transitionToRoute('new-project.import.step4');
    }
  }

});
