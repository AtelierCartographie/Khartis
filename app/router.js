import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

    this.route("index", {path: "/"});

    this.route("project", {path:"project/:uuid"}, function(){
        this.route("step1");
        this.route("step2");
        this.route("step3");
        this.route("step4");
    });

    /*this.route("spreadsheet", {path: "spreadsheet/:uuid"}, function() {
        this.route("import", function() {
          this.route("step1");
        });
    });*/

    this.route("graph", {path: "graph/:uuid"}, function() {
        this.route("geovars");
        this.route("layout");
        this.route("mapping");
    });

});

export default Router;
