import Ember from 'ember';
import Resolver from 'magic-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import d3 from 'd3';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

Ember.Component.reopen({
   
   d3l: function() {
       return d3.select(this.$()[0]);
   }
    
});

export default App;
