import Ember from 'ember';
import Resolver from 'magic-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import d3 from "npm:d3";
import geoProjections from "npm:d3-geo-projection";
import "./utils/d3-selection-multi";
import {isEverGreen} from 'khartis/utils/browser-check'
import './utils/composite-projection';
import './utils/d3proto';
/* global Em */

/* attach d3 geo projection */
Object.assign(d3, geoProjections);
console.log(geoProjections);
let App;

if( isEverGreen() === false){

  let message = $(`<div class="browser-check">
    <h1>Votre navigateur n'est pas supporté.</h1>      
    <h2>Liste des navigateurs supportés</h2>
    <ul>
        <li>Chrome</li>
        <li>Firefox</li>
        <li>IE 11</li>
        <li>Edge</li>
        <li>Safari</li>
        <li>Opera</li>
    </ul>
  </div>`);

  $('body').html(message);

} else {

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
    let args = (Array.prototype.slice.call(arguments)).reverse(),
      fn = args[1],
      time = args[0],
      keys = args.slice(2);

    let debouncer = function() {
      Em.run.debounce(this, fn, time);
    };

    return Em.observer.apply(this, keys.concat([debouncer]));
  };
  
  Ember.debouncedObserverImmediate = function() {
    let args = (Array.prototype.slice.call(arguments)).reverse(),
      fn = args[1],
      time = args[0],
      keys = args.slice(2);

    let debouncer = function() {
      Em.run.debounce(this, fn, time, true);
    };

    return Em.observer.apply(this, keys.concat([debouncer]));
  };

}



export default App;
