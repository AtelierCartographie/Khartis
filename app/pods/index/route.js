import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function() {
    this.render("index.help", { outlet: "help" });
    this.render({ outlet: "main" });
  },
  //
  //afterModel(model, transition) {
  //  if (!(this.get('store').list().length > 0)) {
  //    this.transitionTo('/new-project')
  //  }
  //}

});
