import Ember from 'ember';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';

export default Ember.Route.extend({
  
  renderTemplate: function () {
    this.render("new-project.import.help", {into: "application", outlet: "help"});
    this.render({outlet: "main"});
  },
  
  redirect() {
    this.transitionTo('/new-project/import/step1');
  },
  
  model() {
    let project = Project.createEmpty();
    return {
      csv: null,
      project: project
    };
  },
  
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('new-project').set('currentState', 'import');
  }
  
});
