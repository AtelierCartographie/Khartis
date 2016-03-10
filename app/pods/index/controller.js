import Ember from 'ember';

export default Ember.Controller.extend({

  testValue: 2,

  hasProject:function(){
    return this.get('store').has()
  }.property('store'),

  actions: {
    resumeProject() {
      this.transitionToRoute('graph', this.get('store').list().get('lastObject._uuid'));
    },

    newProject(){
      this.transitionToRoute('project', 'new');
    }
  }

});
