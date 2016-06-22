import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

    this.route("index", {path: "/"});

    this.route("project", {path:"project/:uuid"}, function(){
        this.route("step1");
        this.route("step2", function() {
          this.route("column", {path: "column/:columnId"});
        });
    });

    this.route("graph", {path: "graph/:uuid"}, function() {
        this.route("projection");
        this.route("layer", {path: "layer/:layerId"}, function() {
          this.route("edit");
        });
    });

});

export default Router;
