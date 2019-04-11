/*jshint node:true*/
/* global require, module */
var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = require('./config/environment');

module.exports = function(defaults) {
  var conf = env(EmberApp.env()),
      app = new EmberApp(defaults, {
        nodeModulesToVendor: [
          'node_modules/bootstrap-sass/assets/javascripts/bootstrap',
          'node_modules/normalize-scss/sass',
        ],
        babel: {
          plugins: [
            'transform-object-rest-spread'
          ]
        },
        "ember-cli-babel": {
          includePolyfill: true
        },
        fingerprint: {
          exclude: ['assets/images/', 'assets/web-workers', 'documentation']
        },
        replace: {
          files: [
            '.htaccess'
          ],
          patterns: [{
            match: /\{\{rootURL\}\}/g,
            replacement: conf.rootURL
          }],
          enabled: true // can be set to false to disable 
        }
      });

  app.import("vendor/modal.js");
  
  app.import("vendor/FileSaver.js");
  app.import("vendor/_normalize.scss");
  app.import("vendor/codemirror-placeholder.js");
  app.import("vendor/canvas-to-blob-polyfill.js");
  app.import("vendor/lz-string.js");

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

  return app.toTree();

};
