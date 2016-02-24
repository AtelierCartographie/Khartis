import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

    this.route("index", {path: "/"});

    this.route("new-project", {path:"new-project"}, function(){
      this.route("import", function() {
        this.route("step1");
        this.route("step2");
      });
      this.route("test-data");
    });

    this.route("spreadsheet", {path: "spreadsheet/:uuid"}, function() {
        this.route("import", function() {
          this.route("step1");
        });
    });

    this.route("graph", {path: "graph/:uuid"}, function() {

    });

});

export default Router;
