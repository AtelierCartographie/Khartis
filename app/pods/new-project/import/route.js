import Ember from 'ember';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';

export default Ember.Route.extend({
  
  newProject() {
    let project = Project.create({
      data: DataStruct.createFromRawData([])
    });
    return project;
  },
  
  redirect() {
    this.transitionTo('/new-project/import/step1');
  },
  
  model() {
    let project = this.newProject();
    this.get('store').persist(project.export());
    return project;
  },
  
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('new-project').set('currentState', 'import');
  }
  
});
