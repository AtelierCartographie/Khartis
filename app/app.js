import Ember from 'ember';
import Resolver from 'magic-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import d3 from 'd3';
/* global Em */

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

Ember.debouncedObserver = function() {
  let args = Array.prototype.slice.call(arguments),
      fn = args.reverse()[1],
      time = args.reverse()[0],
      keys = args.slice(0, args.length-2);

  let debouncer = function() {
    Em.run.debounce(this, fn, time);
  };
  
  return Em.observer.apply(this, keys.concat([debouncer]));
};

export default App;
