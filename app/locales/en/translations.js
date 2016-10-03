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
    "error": {
     "one": "error",
     "other": "errors" 
    }
  },
  
  "project": {
   
    "resume": "resume last project",
    
    "step1": {
      "title": {
        "import": "import",
        "fileCsv": "a csv file",
        "testData": "Try our sample datasets",
        "selectAMap": "Select a map"
      },
      "pasteCsv": "past your data here or drop a csv file",
      "downloadCsvModel": "download model (.csv)"
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
        "rowCount": {
          "one": "row imported",
          "other": "rows imported"
        },
        "colCount": {
          "one": "column imported",
          "other": "columns imported"
        }
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
        "classes": "classed"
      },
      "title" : "settings",
      "symbols": "symbols",
      "discretization": {
        "title": "discretization",
        "method": {
          "unique": "proportional",
          "grouped": "grouped into classes"
        },
        "type": {
          "regular": "regular intervals",
          "mean": "nested means",
          "quantile": "quantiles",
          "linear": "none"
        }
      },
      "classes": "classes",
      "breakValue": "breaking value",
      "shape": "shape",
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
        "explenation": "attention, il existe plus de 8 catégories. Cela peut entrainer des difficultés à visualiser clairement les données.",
        "help": {
          "_": "Veuillez vous assurer de visualiser :",
          "1": "1 / du texte (données nominales)",
          "2": "2 / des nombres (données ordinales)",
          "3": "3 / moins de 12 catégories à la fois"
        }
      }
    }
  },

  "export": {
    "title": {
      "legend": "legend",
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
      "showLegend": "show",
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

  "basemap": {
    "world": "World countries",
    "france dept": "France > departments (2016)",
    "france reg 2015": "France > regions (2015)",
    "france reg 2016": "France > regions (2016)"
  },

  "examples": {
    "pop": "Population of States (2010-2015)",
    "idh": "Evolution of HDI (1990-2014)",
    "alim": "Undernourishment (2014-2016)",
    "unesco": "Unesco sites (2015)",
    "fr_dpt": "France departments test"
  }
  
};
