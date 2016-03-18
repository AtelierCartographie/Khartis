import Ember from 'ember';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';

export default Ember.Route.extend({
  
  renderTemplate: function () {
    this.render("project.help", {into: "application", outlet: "help"});
    this.render("index.header", { outlet: "header" });
    this.render({outlet: "main"});
  },
  
  redirect(model) {
    if (model.get('project.data.rows').length === 0) {
      this.transitionTo('project.step1', 'new');
    }
  },
  
  model(params) {
    
    if (params.uuid === "new") {
      let project = Project.createEmpty();
      return Ember.Object.create({
        csv: null,
        project: project
      });
    } else {
      let p = this.get('store').select(params.uuid);
      if (p) {
        return Ember.Object.create({
          csv: null,
          project: p
        });
      } else {
        this.transitionTo('/');
      }
    }
    
  },
  
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('project').set('currentState', 'import');
  },
  
  
  actions: {
    
  }
  
});
