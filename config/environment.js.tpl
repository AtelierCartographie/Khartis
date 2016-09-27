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

<<<<<<< HEAD
    maps: [

      {
        id: "world",
        sources: [
          {source: "W-110m-2015-modified.json"}
        ],
        dictionary: {
          source: "Dictionary-country-territory.json",
          identifier: "iso_a2"
        },
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
        sources: [
          {source: "FR-dpt-2016/france.json", projection: "d3.geo.conicConformal()", scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-dpt-2016/FRA10.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA20.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA30.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA40.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA50.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-DPT-2016.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_dpt",
            source: "fr-dpt-naissances.csv"
          }
        ]
      },
      
    ],

=======
>>>>>>> 8c3719873baeea3bd445fc7d50d223c3bd4ef2cd
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
            id: "fr_dpt",
            source: "fr-dpt-naissances.csv"
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
      "graph$visualizations": "Map editor - visualizations",
      "graph$export": "Map editor - export",
      "graph.projection": "Map editor - choose projection",
      "graph.layer.edit": "Map editor - layer configuration",
      "project.step1": "Step 1 - Data import",
      "project.step2": "Step 2 - Data configuration",
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
