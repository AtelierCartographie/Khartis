import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render("spreadsheet.import.step1.footer", { outlet: "footer" });
    this.render({ outlet: "main" });
  },
  
  model() {
    return this.modelFor('spreadsheet');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
    controller.setup();
  }
  
});
