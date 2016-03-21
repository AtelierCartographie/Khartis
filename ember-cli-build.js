/*jshint node:true*/
/* global require, module */
var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    babel: {
      includePolyfill: true
    }
  });
  
  app.import("bower_components/d3-geo-projection/d3.geo.projection.min.js");
  app.import("bower_components/jquery-minicolors/jquery.minicolors.min.js");
  app.import("bower_components/jquery-minicolors/jquery.minicolors.css");
  app.import("vendor/d3.geo.polyhedron.min.js");
  
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  
  // Resources to be included in public folder
  var dicts = new Funnel('ressources', {
      srcDir: '/',
      include: ['**/Projection-list.csv', '**/Dictionary-country-territory.json'],
      destDir: '/data'
   });
   
   var maps = new Funnel('ressources/basemap', {
      srcDir: '/',
      include: ['**/*.json'],
      destDir: '/data/map'
   });

  return app.toTree([maps, dicts]);
  
};
