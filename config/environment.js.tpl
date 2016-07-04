/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mapp',
    podModulePrefix: 'mapp/pods',
    environment: environment,
    rootURL: '/',
    locationType: /*process.env.EMBER_CLI_ELECTRON ? 'hash' : */'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    i18n: {
      defaultLocale: 'fr'
    },
    
    projection: {
      default: "natural_earth"
    },

    symbolMaxMinSize: 5,
    symbolMaxMaxSize: 56,

    examples: [
      {
        id: "eco2",
        source: "01_WB_emissions_CO2_structureOK_ISO-Latin-1.txt"
      },
      {
        id: "surface_forets",
        source: "02_WB_surfaces_forets_Km2_EN_milliers-virgule_decimal-point_ISO-Latin-1.txt"
      }
    ],

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
