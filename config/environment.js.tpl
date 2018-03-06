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

    symbolMinMaxSize: {
      proportional: 5,
      categorical: 5
    },
    symbolMaxMaxSize: {
      proportional: 56,
      categorical: 30
    },

    projectThumbnail: {
      width: 320,
      height: 90,
      quality: 0.68
    },

    mapThumbnail: {
      height: 41,
      color: "#90ABBD"
    },

    maps: [

      {
        id: "world",
        attribution: "basemap from Natural Earth (CC0)",
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
        id: "german states 2016",
        license: "GeoNutzV",
        attribution: "© GeoBasis-DE / BKG 2016 (data changed)",
        sources: [
          {
            source: "DE-2016/topojson/bkg-2500-basemap-de-states-q1e4.json",
            projection: "d3.geoConicConformal()",
            scale: 0.8, borders: ["l", "r", "t", "b"],
            transforms:{ rotate: [-10, -50], parallels: [ 47.3, 54.9 ] },
            zoning: [[0, 0], [1, 1]]
          }
        ],
        dictionary: {
          source: "DE-BKG-NUTS1-2016.json",
          identifier: "RS"
        },
        examples: [
          {
            id: "de_states_inhabitants_06_15",
            source: "04-DESTATIS-RS-NUTS1-Inhabitants-2006-2015.csv",
            attribution: "© Statistisches Bundesamt (Destatis), GV-ISys, 2017",
            license: "Datenlizenz Deutschland - Namensnennung - Version 2.0",
            license_url: "https://www.govdata.de/dl-de/by-2-0",
            description: "Inhabitants, 31.12.2015 based on Zensus 2011 (DeStatis, auf Basis von GV-ISys).",
            source_url: "https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Gemeindeverzeichnis.html"
          }
        ]
      },
      {
        id: "german districts 2016",
        license: "GeoNutzV",
        attribution: "© GeoBasis-DE / BKG 2016 (data changed)",
        sources: [
          {
            source: "DE-2016/topojson/bkg-2500-basemap-de-districts-q1e4.json",
            projection: "d3.geoConicConformal()",
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
            source: "04-DESTATIS-RS-NUTS-Inhabitants-formatted-numers.csv",
            attribution: "© Statistisches Bundesamt (Destatis), GV-ISys, 2017",
            license: "Datenlizenz Deutschland - Namensnennung - Version 2.0",
            license_url: "https://www.govdata.de/dl-de/by-2-0",
            description: "Inhabitants, 31.12.2015 based on Zensus 2011 (DeStatis, auf Basis von GV-ISys).",
            source_url: "https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Gemeindeverzeichnis.html"
          }
        ]
      },
      {
        id: "brazil ufe 2015",
        attribution: "basemap from IBGE",
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
        attribution: "basemap from IBGE",
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
        attribution: "basemap from IBGE",
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
        id: "canada prov 2016",
        attribution: "basemap from Statistics Canada",
        sources: [
          {source: "CA-prov-2016.json", projection: "d3.geoAzimuthalEqualArea()", scale: 1, transforms:{ rotate: [91.86, -63.39], parallels: [ 49, 77 ] }, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "CA-dico-PROV-2016.json",
          identifier: "ID"
        },
        examples: [
            {
                id: "ca-prov-life-2015",
                source: "ca-prov-life-2015.csv"
            }
        ]
      },
      {
        id: "eu country 2013",
        attribution: "basemap from GISCO - Eurostat (European Commission)",
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
        attribution: "basemap from GISCO - Eurostat (European Commission)",
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
        attribution: "basemap from GISCO - Eurostat (European Commission)",
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
        id: "spain prov 2015",
        attribution: "basemap from Instituto Geográfico Nacional",
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
        attribution: "basemap from Instituto Geográfico Nacional",
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
        id: "us state 2015",
        attribution: "basemap from U.S. Census Bureau",
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
      },
      {
        id: "france dept",
        attribution: "basemap from OpenStreetMap contributors (ODbl license)",
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
        attribution: "basemap from OpenStreetMap contributors (ODbl license)",
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
        attribution: "basemap from OpenStreetMap contributors (ODbl license)",
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
        id: "france circ 2017",
        attribution: "basemap from toxicode (ODbl license)",
        sources: [
          {source: "FR-circ-2017/france.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 0.85]]},
          {source: "FR-circ-2017/FRA100.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0, 0.85], [0.2, 1]], borders: ["l", "t"]},
          {source: "FR-circ-2017/FRA200.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.2, 0.85], [0.4, 1]], borders: ["l", "t"]},
          {source: "FR-circ-2017/FRA300.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.4, 0.85], [0.6, 1]], borders: ["l", "t"]},
          {source: "FR-circ-2017/FRA400.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.6, 0.85], [0.8, 1]], borders: ["l", "t"]},
          {source: "FR-circ-2017/FRA500.json", projection: "d3.geoMercator()", scale: 0.6, zoning: [[0.8, 0.85], [1, 1]], borders: ["l", "r", "t"]}
        ],
        dictionary: {
          source: "FR-dico-circ-2017.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "fr-pres-2012-t1",
            source: "fr-pres-2012-t1.csv"
          },
          {
            id: "fr-pres-2012-t2",
            source: "fr-pres-2012-t2.csv"
          },
          {
            id: "fr-pres-2017-t1",
            source: "fr-pres-2017-t1.csv"
          },
          {
            id: "fr-pres-2017-t2",
            source: "fr-pres-2017-t2.csv"
          }
        ]
      },
      {
        id: "FR-11 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-11.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-11.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-24 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-24.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-24.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-27 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-27.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-27.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-28 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-28.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-28.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-32 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-32.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-32.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-44 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-44.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-44.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-52 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-52.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-52.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-53 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-53.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-53.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-75 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-75.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-75.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-76 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-76.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-76.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-84 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-84.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-84.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-93 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-93.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-93.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-94 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FR-94.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FR-94.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA10 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FRA10.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FRA10.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA20 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FRA20.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FRA20.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA30 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FRA30.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FRA30.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA40 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FRA40.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FRA40.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA50 com 2016",
        attribution: "basemap from Geofla IGN 2016",
        sources: [
          {source: "FR-com-2016/FRA50.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2016/FRA50.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-11 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-11.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-11.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-24 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-24.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-24.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-27 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-27.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-27.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-28 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-28.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-28.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-32 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-32.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-32.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-44 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-44.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-44.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-52 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-52.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-52.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-53 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-53.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-53.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-75 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-75.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-75.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-76 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-76.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-76.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-84 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-84.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-84.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-93 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-93.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-93.json",
          identifier: "ID"
        }
      },
      {
        id: "FR-94 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FR-94.json", projection: "d3.geoConicConformal()", transforms:{rotate: [-3, -46.3], parallels: [44, 49]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FR-94.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA10 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FRA10.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FRA10.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA20 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FRA20.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FRA20.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA30 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FRA30.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FRA30.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA40 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FRA40.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FRA40.json",
          identifier: "ID"
        }
      },
      {
        id: "FRA50 com 2017",
        attribution: "basemap from Admin Express IGN 2017",
        sources: [
          {source: "FR-com-2017/FRA50.json", projection: "d3.geoMercator()", scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "FR-dico-COM-2017/FRA50.json",
          identifier: "ID"
        }
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
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_TRANSITIONS = false;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
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
