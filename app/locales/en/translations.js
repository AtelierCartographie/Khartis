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
        "testData": "Try our sample datasets"
      },
      "pasteCsv": "past your data here or drop a csv file"
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
      }
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
        "values": "values"
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
  }
  
  
    /*"gradientOf": "Dégradé de",
    "pageLayout": "Mise en page",
    "varMapping": "Couplage des variables",
    "addAVariable": "ajouter une variable",
    "contextualHelp": "Aide contextuelle",
    "chooseMap": "Choisir une carte",
    "dataType": "type de données",
    "label": "libellé",
    "none": "aucun",
    "summary": "summary",
    "mappingType": "type de couplage",
    "backMap": "Fond de carte",
    "mapTitle": "Titre de la carte"*/
  
 /* 
  "navigation": {
    "openMap": "Ourvir la carte",
    "chooseProjection": "Choisir une projection",
    "chooseVisualization": "Choix d'une visualisation",
    "editColumn": "Edition d'une colonne",

    "sidebar": {
      "data" : "Données",
      "visualisations" : "Visualisations",
      "variables": "Variables",
      "layout": "Mise en page",
      "layers": "Calques",
      "legend": "Légende",
      "export": "Export"
    }
    
  },
  
  "variable.meta": {
    "type": {
      "text": "text",
      "numeric": "numérique",
      "geo": "code géographique",
      "lat": "latitude",
      "lon": "longitude",
      "auto": "automatique"
    }
  },
  
  "variable.mapping": {
    "type": {
      "shape": "forme",
      "surface": "surface",
      "text": "text"
    },
    "scaleOf": {
      "size": "taille",
      "fill": "couleur"
    },
    "pattern": {
      "solid": "plein",
      "horizontal": "hachurage horizontal",
      "vertical": "hachurage vertical",
      "diagonal": "hachurage diagonal"
    },
    "shape": {
      "point": "point",
      "rect": "carré",
      "text": "text"
    },
    "interval": {
      "type": {
        "regular": "intervalles réguliers",
        "mean": "moyennes emboitées",
        "quantile": "quantiles",
        "linear": "aucune"
      }
    },
    "rule": {
      "no_value": "(aucune valeur)"
    },
    "contrast": {
      "sqrt": "racine carrée",
      "cube_root": "racine cubique",
      "identity": "linéaire",
      "square": "carré"
    }
  },
  
  "visualization": {
    "quanti": {
      "val_surfaces": {
        "name": "valeurs sur surfaces",
        "description": "L'ordre des nuances respecte celui des valeurs"
      },
      "val_symboles": {
        "name": "valeurs sur symboles",
        "description": "Taille de symboles proportionnelles aux valeurs"
      }
    },
    "quali": {
      "cat_surfaces": {
        "name": "catégories sur surfaces 1",
        "description": "Les figurés choisis différencient les valeurs"
      },
      "taille_valeur": {
        "name": "catégories sur surfaces 2",
        "description": "L'ordre des symbols respecte celui des valeurs"
      },
      "cat_symboles": {
        "name": "catégories sur symboles 1",
        "description": "Les figurés choisis différencient les valeurs"
      },
      "ordre_symboles": {
        "name": "catégories sur symboles 2",
        "description": "L'ordre des symbols respecte celui des valeurs"
      }
    }
  },
  
  "graph": {
    "displayedVars": "Variables représentées"
  },
  
  "success": {
    "typeCoherency": "Toutes les cellules sont correctement formatées"
  },
  
  "warning": {
    "typeCoherency": "Certaines cellules contiennent des données incompatibles avec le type de colonne sélectionné"
  },
  
  "error": {
    "noGeoColumn": "Aucune colonne géo-référencée ou lat / lon n'a été trouvée. Veuillez qualifier vos données"
  },
  
  "import": {
    "preview": "Aperçu",
    "report": "Rapport d'importation",
    "editor.paste.csv": "collez ici le csv à importer",
    "editor.upload.file": "téléversez un fichier",
    "editor.importTitle": "Importer un fichier csv",
    "testDataSetTitle" : "Jeux de données test",
    "startImport": "Lancer l'importation",
    "qualifyData": "Qualifier les données",
    "success": "Importation réalisée avec succés",
    "fatal": "Impossible de continuer, veuillez éditer votre csv",
    "warningsMessage": {
      "one": "anomalie non bloquante",
      "other": "anomalies non bloquantes"
    },
    "warning": {
      "trim": "Certaines cellules contiennent des espaces inutiles en début ou en fin de mot. Ils ont été supprimés lors de l'importation"
    },
    "errorsMessage": {
      "one": "anomalie bloquante",
      "other": "anomalies bloquantes"
    },
    "error": {
      "header.emptyCell": "L'entête semble incorrecte : certaines cellules sont vides.",
      "oneColumn": "Une seule colonne a été trouvée",
      "colNumber": "Csv incorrectement formaté : toutes les lignes ne possèdent pas le même nombre de colonnes."
    },
    "rowCount": "lignes importées",
    "colCount": "colonnes importées"
    
  },
  "spreadsheet": {
    "sidebar.title": "Edition des données",
    "sidebar.p1": "Cette interface vous permet d'éditer les données qui serviront de base à votre création graphique."
  }*/
  // "some.translation.key": "Text for some.translation.key",
  //
  // "a": {
  //   "nested": {
  //     "key": "Text for a.nested.key"
  //   }
  // },
  //
  // "key.with.interpolation": "Text with {{anInterpolation}}"
};
