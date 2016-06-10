import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function() {
    this.render({ outlet: "main" });
    this.render("header", { outlet: "header" });
  },

  redirect(model) {
    this.transitionTo('project.step1', 'new');
  }

});
