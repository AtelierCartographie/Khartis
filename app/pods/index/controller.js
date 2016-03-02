import Ember from 'ember';

export default Ember.Controller.extend({

  hasProject:function(){
    return this.get('store').has()
  }.property('store'),

  actions: {
    resumeProject() {
      this.transitionToRoute('spreadsheet', this.get('store').list().get('lastObject._uuid'));
    },

    newProject(){
      this.transitionToRoute('new-project')
    }
  }

});
