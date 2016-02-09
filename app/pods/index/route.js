import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function() {
    this.render("index.help", { outlet: "help" });
    this.render({ outlet: "main" });
  },

  actions:{
    resumeProject(){
      this.transitionTo('/spreadsheet')
    },
    newProject(){
      this.transitionTo('/new-project')
    }
  }

});
