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

    symbolMinMaxSize: 5,
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

    maps: [

      {
        id: "world",
        source: "W-110m-2015-modified.json",
        dictionary: {
          source: "Dictionary-country-territory.json",
          identifier: "iso_a2"
        },
        compositeProjection: null,
        examples: [
          {
            id: "eco2",
            source: "01_WB_emissions_CO2_structureOK_ISO-Latin-1.txt"
          },
          {
            id: "surface_forets",
            source: "02_WB_surfaces_forets_Km2_EN_milliers-virgule_decimal-point_ISO-Latin-1.txt"
          }
        ]
      },
      {
        id: "france dept",
        source: "FR-dpt-2016.json",
        dictionary: {
          source: "FR-dico-DPT-2016.json",
          identifier: "NUTS"
        },
        compositeProjection: "conicConformalFrance",
        examples: [
          {
            id: "eco2",
            source: "01_WB_emissions_CO2_structureOK_ISO-Latin-1.txt"
          }
        ]
      },
      
    ],

    //configure here analytics services. view ember-metrics for more info
    metricsAdapters: [
 /*     {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: {
          id: 'UA-XXXX-Y'
        }
      }, */
 /*     {
        name: 'Piwik',
        environments: ['production'],
        config: {
          piwikUrl: 'http://piwik.my.com',
          siteId: 42
        }
      } */
    ],

    metricsRouteLabels: {
      "graph.index$visualizations": "Map editor - visualizations",
      "graph.index$export": "Map editor - export",
      "graph.projection": "Map editor - choose projection",
      "graph.layer.edit": "Map editor - layer configuration",
      "project.step1.index": "Step 1 - Data import",
      "project.step2.index": "Step 2 - Data configuration",
      "project.step2.column": "Step 2 - Column data edition"
    },

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
