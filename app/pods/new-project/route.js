import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    this.render("new-project.help", {outlet: "help"});
    this.render({outlet: "main"});
  },

  actions: {
    createDataSet(){
      this.transitionTo('/spreadsheet')
    }
  }
});
