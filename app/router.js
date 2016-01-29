import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    
    this.route("spreadsheet", {path: "/"}, function() {
        this.route("import");
    });
    
    this.route("graph", function() {
        
    });
    
});

export default Router;
