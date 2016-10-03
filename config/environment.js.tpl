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
            id: "pop",
            source: "01-population-etats.csv"
          },
          {
            id: "idh",
            source: "02-evolution-idh-1990-2014.csv"
          },
          {
            id: "alim",
            source: "03-sous-alimentation-2014-2016.csv"
          },
          {
            id: "unesco",
            source: "05-sites-unesco-2015.csv"
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
      {
        id: "france reg 2015",
        sources: [
          {source: "FR-reg-2015/france.json", projection: "d3.geo.conicConformal()", scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-reg-2015/FRA1.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA2.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA3.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA4.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA5.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-REG-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_dpt",
            source: "fr-dpt-naissances.csv"
          }
        ]
      },
      {
        id: "france reg 2016",
        sources: [
          {source: "FR-reg-2016/france.json", projection: "d3.geo.conicConformal()", scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-reg-2016/FRA1.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA2.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA3.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA4.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA5.json", projection: "d3.geo.mercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-REG-2016.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_dpt",
            source: "fr-dpt-naissances.csv"
          }
        ]
      }
      
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
