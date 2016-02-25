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

Ember.debouncedObserver = function() {
  var args = Array.prototype.slice.call(arguments),
      fn = args[0],
      time = args.reverse()[0],
      keys = args.slice(1, args.length-1);

  var debouncer = function() {
    Em.run.debounce(this, fn, time);
  };
  var newArgs = [debouncer];

  keys.forEach(function(item){
    newArgs.push(item);
  });
  
  return Em.observer.apply(this, newArgs);
};

export default App;
