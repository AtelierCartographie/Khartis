import Ember from 'ember';
import Project from 'khartis/models/project';
import {DataStruct} from 'khartis/models/data';

export default Ember.Route.extend({

  store: Ember.inject.service(),

  renderTemplate: function () {
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
      return this.get('store').select(params.uuid)
        .then( p => {
          if (p) {
            return Ember.Object.create({
              csv: null,
              project: p
            });
          } else {
            this.transitionTo('/');
          }
        });
    }

  },

  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('project').set('currentState', 'import');
  },


  actions: {
    next(){
      
    }
  }

});
