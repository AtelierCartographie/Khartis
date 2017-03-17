export default {
  
  "general": {
    "next": "next",
    "back": "back",
    "submit": "submit",
    "cancel": "cancel",
    "import": "import",
    "continue": "continue",
    "validate": "validate",
    "open": "Open",
    "close": "Close",
    "or": "or",
    "and": "and",
    "none": "none",
    "download": "download",
    "loading": "chargement",
    "search": "rechercher",
    "save": "save",
    "width": "width",
    "yes": "yes",
    "no": "no",
    "error": {
     "one": "error",
     "other": "errors" 
    }
  },

  "d3.format": {
    "decimal": ".",
    "thousands": ","
  },

  "help.wiki": "Help - Wiki Khartis",
  
  "project": {
   
    "resume": "resume last project",
    
    "step1": {
      "title": {
        "import": "import",
        "fileCsv": "a csv file",
        "testData": "Try our sample datasets",
        "selectAMap": "Select a map"
      },
      "tooltip": {
        "csv": "Comma separated values files that ends with .csv",
        "resumeProject": "Will resume the last project edited on this computer ",
        "importProject": "Import a saved project"
      },
      "pasteCsv": "paste your data here or drop a csv file",
      "downloadCsvModel": "download model (.csv)",
      "importPoject": {
        "title": "Import Khartis project",
        "loadError": "Unable to load selected file"
      }
    },
    
    "step2": {
      "title": {
        "preview": "data preview"
      },
      "import": {
        "success": "Import completed successfully",
        "fatal": "impossible to continue, please edit your csv",
        "warningsMessage": {
          "one": "non-blocking anomaly",
          "other": "non-blocking anomalies"
        },
        "warning": {
          "trim": "some cells have unnecessary spaces at the beginning or end of a word. They were removed when importing"
        },
        "errorsMessage": {
          "one": "blocking anomaly",
          "other": "blocking anomalies"
        },
        "error": {
          "header.emptyCell": "the header seems incorrect: some cells are empty.",
          "oneColumn": "only one column was found",
          "colNumber": "csv format error: all rows don't have the same number of columns."
        },
        "noError": "aucune erreur détectée",
        "correct": "corriger",
        "rowCount": {
          "one": "row imported",
          "other": "rows imported"
        },
        "colCount": {
          "one": "column imported",
          "other": "columns imported"
        },
        "geoRefColumn": "Geographic column",
        "geoRefColumnNotFound": "No geographic column has been found",
        "tooltip": {
          "geoRefColumn": "The column from your imported data that maps to a geographic zone"
        }
      },
      "editColumn": {
        "unrecognizedColumns": "Some cells have not been recognized"
      },
      "back": "start over by importing new data"
    }
    
  },
  
  "navigation": {

    "editColumn": "Edit a column",

    "sidebar": {
      "data" : "data",
      "visualisations" : "visualizations",
      "export": "export"
    }
    
  },

  "variable.meta": {
    "type": {
      "text": "text",
      "numeric": "numeric",
      "geo": "geographic code",
      "lat": "latitude",
      "lon": "longitude",
      "auto": "automatic"
    }
  },
  
  "projection": {
    "title": "projection",
    "settings": {
      "longitude": "longitude",
      "latitude": "latitude",
      "rotation": "rotation"
    },
    "rating": {
      "surface": "area",
      "distance": "distance",
      "angle": "angle"
    },
    "atlantis": {
      "name": "Atlantis",
      "description": "Ceci est une description"
    },
    "briesemeister": {
      "name": "Briesemeister",
      "description": "Ceci est une description"
    },
    "interrupted_goode_homolosine": {
      "name": "Goode H.",
      "description": "Ceci est une description"
    },
    "lambert_azimuthal_equal_area": {
      "name": "LAEA",
      "description": "Ceci est une description"
    },
    "mollweide": {
      "name": "Mollweide",
      "description": "Ceci est une description"
    },
    "natural_earth": {
      "name": "Natural Earth",
      "description": "Ceci est une description"
    },
    "orthographic": {
      "name": "Orthographic",
      "description": "Ceci est une description"
    },
    "plate_carree": {
      "name": "Plate carrée",
      "description": "Ceci est une description"
    },
    "waterman_butterfly": {
      "name": "Waterman",
      "description": "Ceci est une description"
    },
    "mercator": {
      "name": "Mercator",
      "description": "Ceci est une description"
    }
  },
  
  "visualization": {
    "title": {
      "choose": "choose a visualization",
      "categories": "categories",
      "nodata": "missing data"
    },
    "settings": {
      "diagram": {
        "title": "frequency diagram",
        "frequencies": "frequencies",
        "values": "values",
        "cumulatives": "aggregated",
        "classes": "classed",
        "tooltip": {
          "title": "Histogram that represents the distribution of the data"
        }
      },
      "title" : "settings",
      "symbols": "symbols",
      "discretization": {
        "title": "discretization",
        "tooltip": {
          "title": "Discretization concerns the process of transferring continuous functions, models, and equations into discrete counterparts"
        },
        "method": {
          "unique": "proportional",
          "grouped": "grouped into classes",
          "tooltip": {
            "grouped": "Values are grouped into classes"
          }
        },
        "type": {
          "regular": "regular intervals",
          "mean": "nested means",
          "quantile": "quantiles",
          "standardDeviation": "standard deviation",
          "jenks": "jenks",
          "linear": "none"
        }
      },
      "classes": "classes",
      "breakValue": "breaking value",
      "shape": {
        "title": "shape",
        "rect": "rect",
        "circle": "circle",
        "bar": "bar"
      },
      "size": "size",
      "contrast": "contrast",
      "color": {
        "one": "color",
        "other": "colors"
      },
      "pattern": {
        "one": "hatching",
        "other": "hatching"
      },
      "reverse": "reverse",
      "stroke": "stroke",
      "strokeSize": "stroke size",
      "opacity": "opacity"
    },
    "type": {
      "quanti": {
        "val_surfaces": {
          "name": "values > areas",
          "description": "color gradient follows the values"
        },
        "val_symboles": {
          "name": "values > symbols",
          "description": "symbols are proportionnal to the values"
        }
      },
      "quali": {
        "cat_surfaces": {
          "name": "categories > areas",
          "description": "various colors separate categories"
        },
        "taille_valeur": {
          "name": "categories on areas 2",
          "description": "l'ordre des symbols respecte celui des valeurs"
        },
        "cat_symboles": {
          "name": "categories > symbols",
          "description": "symbols separate categories"
        },
        "ordre_symboles": {
          "name": "categories on symbols 2",
          "description": "l'ordre des symbols respecte celui des valeurs"
        }
      }
    },
    "rule": {
      "no_value": "(no value)"
    },
    "warning": {
      "rule.count": {
        "title": "non-blocking anomaly",
        "about": "read more",
        "explenation": "attention, il existe plus de 8 catégories. Cela peut entrainer des difficultés à visualiser clairement les données.",
        "help": {
          "_": "Veuillez vous assurer de visualiser :",
          "1": "1 / du texte (données nominales)",
          "2": "2 / des nombres (données ordinales)",
          "3": "3 / moins de 12 catégories à la fois"
        }
      }
    },
    "alert": {
      "remove": {
        "title": "Confirm delete",
        "content": "Are you sure you want to delete this layer ?"
      },
      "bigDataSet": {
        "title": "Warning",
        "content": "This layer contains a large data set. This could result in performance issues. Do you want to continue ?"
      }
    }
  },

  "export": {
    "title": {
      "labels": "labels",
      "styles": "map layout",
      "sizes": "dimensions",
      "export": "export"
    },
    "placeholder": {
      "mapTitle": "map title",
      "dataSource": "data source",
      "author": "author / copyright",
      "comment": "comment"
    },
    "settings": {
      "labelling": {
        "show": "show",
        "size": "size",
        "color": "color",
        "filter": "filter by",
        "categories": "categories",
        "chooseCategories": "choose",
        "threshold": "threshold",
        "selectAll": "select all",
        "unselectAll": "unselect all"
      },
      "legend": "legend",
      "width": "width",
      "height": "height",
      "borders": "borders",
      "grid": "graticules",
      "background": "basemap"
    }
  },

  "legend": {
    "editTitleHere": "edit legend's title"
  },

  "blindness": {
    "menu.title": "Color blindness simulation",
    "type": {
      "protanopia": "protanopia (red-green)",
      "protanomaly": "protanomaly (red-green)",
      "deuteranopia": "deuteranopia (red-green)",
      "deuteranomaly": "deuteranomaly (red-green)",
      "tritanopia": "tritanopia (blue-yellow)",
      "tritanomaly": "tritanomaly (blue-yellow)",
      "achromatopsia": "achromatopsia",
      "achromatomaly": "achromatomaly"
    }
  },

  "basemap": {
    "world": "World > countries (2016)",
    "brazil ufe 2015": "Brésil > States (2015)",
    "brazil mee 2015": "Brésil > mesoregions (2015)",
    "brazil mie 2015": "Brésil > microregions (2015)",
    "france dept": "France > departments (2016)",
    "france reg 2015": "France > regions (2015)",
    "france reg 2016": "France > regions (2016)",
    "spain prov 2015": "Spain > provinces (2015)",
    "spain auto 2015": "Spain > communities (2015)",
    "german states 2016": "Germany > States (2016)",
    "german districts 2016": "Germany > Districts (2016)",
    "us state 2015": "United States > States (2015)",
    "eu country 2013": "Europe > States (2016)",
    "eu nuts-2 2013": "Europe > nuts 2 (2013)",
    "eu nuts-3 2013": "Europe > nuts 3 (2013)"
  },

  "examples": {
    "pop": "Population of States (2010-2015)",
    "idh": "Evolution of HDI (1990-2014)",
    "alim": "Undernourishment (2014-2016)",
    "unesco": "Unesco sites (2015)",
    "br_ufe-pop": "Population (2015)",
    "fr_dpt-pop": "Population (2013)",
    "fr_dpt-poverty": "Poverty (2013)",
    "fr_reg2015-pop": "Population (2013)",
    "fr_reg2015-poverty": "Poverty (2013)",
    "fr_reg2016-pop": "Population (2013)",
    "fr_reg2016-poverty": "Poverty (2013)",
    "de_district_inhabitants": "Population (31/12/2015)",
    "es_prov-pop": "Population (2000-2015)",
    "es_auto-pop": "Population (2000-2015)",
    "us_state-pop": "Population (2010-2015)",
    "eu_country-energie": "Share of renewable energy in gross final energy consumption (2005-2014)",
    "eu_country-ecommerce": "Internet purchases by individuals in the 12 months (2004-2016)",
    "eu_nuts2-travail": "Average hours worked per week (2015)",
    "eu_nuts2-agriculture": "Agricultural area by size of agricultural holdings (2013)",
    "eu_nuts3-pop": "Population density (2015)"
  }
  
};
