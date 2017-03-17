/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'khartis',
    podModulePrefix: 'khartis/pods',
    environment: environment,
    rootURL: process.env.EMBER_CLI_ELECTRON ? '' : '/',
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
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

    visualization: {
      values: {
        surface: {
          default: {
            intervalType: "mean", //mean, regular, quantile
            classes: 4
          }
        }
      }
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
          source: "world-dico-2016.json",
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
        id: "eu country 2013",
        sources: [
          {source: "EU-country.json", projection: "d3.geoAzimuthalEqualArea()", transforms:{rotate: [-10, -52]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "EU-dico-COUNTRY-2013.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "eu_country-energie",
            source: "eu-country-energie.csv"
          },
          {
            id: "eu_country-ecommerce",
            source: "eu-country-ecommerce.csv"
          },
        ]
      },
      {
        id: "eu nuts-2 2013",
        sources: [
          {source: "EU-nuts-2/EU.json", projection: "d3.geoAzimuthalEqualArea()", transforms:{rotate: [-10, -52]}, scale: 1, zoning: [[0, 0], [1, 0.8]]},
          {source: "EU-nuts-2/acores.json", projection: "d3.geoMercator()", scale: 0.8, zoning: [[0, 0.8], [0.25, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-2/canarias.json", projection: "d3.geoMercator()", scale: 0.8, zoning: [[0.25, 0.8], [0.5, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-2/guadeloupe.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.25, 0.9], [0.5, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-2/guyane.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.5, 0.9], [0.75, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-2/madeira.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.9], [0.25, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-2/martinique.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.5, 0.8], [0.75, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-2/mayotte.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.75, 0.9], [1, 1]], borders: ["t"]},
          {source: "EU-nuts-2/reunion.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.75, 0.8], [1, 0.9]], borders: ["t"]}
        ],
        dictionary: {
          source: "EU-dico-NUTS-2-2013.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "eu_nuts2-travail",
            source: "eu-nuts2-travail.csv"
          },
          {
            id: "eu_nuts2-agriculture",
            source: "eu-nuts2-agriculture.csv"
          },
        ]
      },
      {
        id: "eu nuts-3 2013",
        sources: [
          {source: "EU-nuts-3/EU.json", projection: "d3.geoAzimuthalEqualArea()", transforms:{rotate: [-10, -52]}, scale: 1, zoning: [[0, 0], [1, 0.8]]},
          {source: "EU-nuts-3/acores.json", projection: "d3.geoMercator()", scale: 0.8, zoning: [[0, 0.8], [0.25, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-3/canarias.json", projection: "d3.geoMercator()", scale: 0.8, zoning: [[0.25, 0.8], [0.5, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-3/guadeloupe.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.25, 0.9], [0.5, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-3/guyane.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.5, 0.9], [0.75, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-3/madeira.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.9], [0.25, 1]], borders: ["r", "t"]},
          {source: "EU-nuts-3/martinique.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.5, 0.8], [0.75, 0.9]], borders: ["r", "t"]},
          {source: "EU-nuts-3/mayotte.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.75, 0.9], [1, 1]], borders: ["t"]},
          {source: "EU-nuts-3/reunion.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.75, 0.8], [1, 0.9]], borders: ["t"]}
        ],
        dictionary: {
          source: "EU-dico-NUTS-3-2013.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "eu_nuts3-pop",
            source: "eu-nuts3-pop.csv"
          },
        ]
      },
      {
        id: "brazil ufe 2015",
        sources: [
          {source: "BR-ufe-2015.json", projection: "d3.geoPolyconic()", transforms:{rotate: [54, 0]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "BR-dico-UFE-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "br_ufe-pop",
            source: "br-ufe-pop-2010.csv"
          },
        ]
      },
      {
        id: "brazil mie 2015",
        sources: [
          {source: "BR-mie-2015.json", projection: "d3.geoPolyconic()", transforms:{rotate: [54, 0]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "BR-dico-MIE-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "",
            source: ""
          },
        ]
      },
      {
        id: "brazil mee 2015",
        sources: [
          {source: "BR-mee-2015.json", projection: "d3.geoPolyconic()", transforms:{rotate: [54, 0]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "BR-dico-MEE-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "",
            source: ""
          },
        ]
      },
      {
        id: "france dept",
        sources: [
          {source: "FR-dpt-2016/france.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-dpt-2016/FRA10.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA20.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA30.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA40.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-dpt-2016/FRA50.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-DPT-2016.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_dpt-pop",
            source: "fr-dpt-pop-2013.csv"
          },
          {
            id: "fr_dpt-poverty",
            source: "fr-dpt-pauvrete-2013.csv"
          }
        ]
      },
      {
        id: "france reg 2015",
        sources: [
          {source: "FR-reg-2015/france.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-reg-2015/FRA1.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA2.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA3.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA4.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2015/FRA5.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-REG-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_reg2015-pop",
            source: "fr-reg2015-pop-2013.csv"
          },
          {
            id: "fr_reg2015-poverty",
            source: "fr-reg2015-pauvrete-2013.csv"
          }
        ]
      },
      {
        id: "france reg 2016",
        sources: [
          {source: "FR-reg-2016/france.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-reg-2016/FRA1.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA2.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA3.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA4.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-reg-2016/FRA5.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-REG-2016.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr_reg2016-pop",
            source: "fr-reg2016-pop-2013.csv"
          },
          {
            id: "fr_reg2016-poverty",
            source: "fr-reg2016-pauvrete-2013.csv"
          }
        ]
      },
      {
        id: "spain prov 2015",
        sources: [
          {source: "ES-prov-2015/spain.json", projection: "d3.geoConicConformal()", transforms:{rotate: [3, -40], parallels: [40, 40]}, scale: 0.8, zoning: [[0, 0], [1, 0.85]]},
          {source: "ES-prov-2015/spain-islands.json", projection: "d3.geoConicConformal()", transforms:{rotate: [15, -28], parallels: [28, 28]}, scale: 0.8, zoning: [[0, 0.85], [0.4, 1]], borders: ["r", "t"]}
        ],
        dictionary: {
          source: "ES-dico-PROV-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "es_prov-pop",
            source: "es-prov-pop-2015.csv"
          }
        ]
      },
      {
        id: "spain auto 2015",
        sources: [
          {source: "ES-auto-2015/spain.json", projection: "d3.geoConicConformal()", transforms:{rotate: [3, -40], parallels: [40, 40]}, scale: 0.8, zoning: [[0, 0], [1, 0.85]]},
          {source: "ES-auto-2015/spain-islands.json", projection: "d3.geoConicConformal()", transforms:{rotate: [15, -28], parallels: [28, 28]}, scale: 0.8, zoning: [[0, 0.85], [0.4, 1]], borders: ["r", "t"]}
        ],
        dictionary: {
          source: "ES-dico-AUTO-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "es_auto-pop",
            source: "es-auto-pop-2015.csv"
          }
        ]
      },
      {
        id: "german states 2016",
        license: "GeoNutzV",
        attribution: "© GeoBasis-DE / BKG 2016 (data changed)",
        sources: [
          {
            source: "DE-2016/topojson/bkg-2500-basemap-de-states-q1e4.json",
            projection: "d3.geo.conicConformal()",
            scale: 0.8, borders: ["l", "r", "t", "b"],
            transforms:{ rotate: [-10, -50], parallels: [ 47.3, 54.9 ] },
            zoning: [[0, 0], [1, 1]]
          }
        ],
        dictionary: {
          source: "DE-BKG-NUTS1-2016.json",
          identifier: "RS"
        },
        examples: []
      },
      {
        id: "german districts 2016",
        license: "GeoNutzV",
        attribution: "© GeoBasis-DE / BKG 2016 (data changed)",
        sources: [
          {
            source: "DE-2016/topojson/bkg-2500-basemap-de-districts-q1e4.json",
            projection: "d3.geo.conicConformal()",
            scale: 0.8, borders: ["l", "r", "t", "b"],
            transforms:{ rotate: [-10, -50], parallels: [ 47.3, 54.9 ] },
            zoning: [[0, 0], [1, 1]]
          }
        ],
        dictionary: {
          source: "DE-STATIS-NUTS3-2016.json",
          identifier: "RS"
        },
        examples: [
          {
            id: "de_district_inhabitants",
            source: "de-destatis-Inhabitants-nuts3-2016.csv",
            attribution: "© Statistisches Bundesamt (Destatis), GV-ISys, 2017",
            license: "Datenlizenz Deutschland - Namensnennung - Version 2.0",
            license_url: "https://www.govdata.de/dl-de/by-2-0",
            description: "Inhabitants, 31.12.2015 based on Zensus 2011 (DeStatis, auf Basis von GV-ISys).",
            source_url: "https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Gemeindeverzeichnis.html"
          }
        ]
      },
      {
        id: "us state 2015",
        sources: [
          {source: "US-state-2015/usa.json", projection: "d3.geoAlbers()", transforms:{rotate: [96, 0], parallels: [29.5, 45.5]}, scale: 1, zoning: [[0, 0], [1, 0.9]]},
          {source: "US-state-2015/alaska.json", projection: "d3.geoConicEqualArea()", transforms:{rotate: [154, 0], parallels: [55, 65]}, scale: 1, zoning: [[0, 0.8], [0.33, 1]], borders: ["r", "t"]},
          {source: "US-state-2015/hawai.json", projection: "d3.geoConicEqualArea()", transforms:{rotate: [157, 0], parallels: [8, 18]}, scale: 0.7, zoning: [[0.33, 0.9], [0.5, 1]], borders: ["r", "t"]},
          {source: "US-state-2015/porto-rico.json", projection: "d3.geoConicEqualArea()", transforms:{rotate: [67, 0], parallels: [18, 18]}, scale: 0.45, zoning: [[0.5, 0.95], [0.65, 1]], borders: ["r", "t"]}
        ],
        dictionary: {
          source: "US-dico-ST-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "us_state-pop",
            source: "us-state-pop-2015.csv"
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
