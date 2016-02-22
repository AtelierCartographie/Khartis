import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function () {
    this.render("new-project.help", {outlet: "help"});
    this.render({outlet: "main"});
  },
  
  redirect() {
    this.transitionTo('/new-project/import');
  },

  setupController: function (controller, model) {
    controller.set('model', model);
    this.controllerFor('application').set('isSidebarVisible', false);
  },

  actions: {
    
    createDataSet(){
      this.transitionTo('/spreadsheet')
    },
    
    navigateTo(state) {
      this.transitionTo('/new-project/'+state);
    }
    
  }
});
