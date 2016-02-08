import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    
    this.route("index", {path: "/"});
    
    this.route("spreadsheet", {path: "spreadsheet"}, function() {
        this.route("import", function() {
          this.route("step1");
        });
    });
    
    this.route("graph", function() {
        
    });
    
});

export default Router;
