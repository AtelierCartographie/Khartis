export default {
  
  "general": {
    "next": "suivant",
    "back": "retour",
    "submit": "envoyer",
    "cancel": "annuler",
    "import": "importer",
    "continue": "continuer",
    "validate": "valider",
    "open": "Ouvrir",
    "close": "Fermer",
    "or": "ou",
    "and": "et",
    "none": "aucune",
    "download": "télécharger",
    "loading": "chargement",
    "error": {
     "one": "erreur",
     "other": "erreurs" 
    }
  },
  
  "project": {
   
    "resume": "reprendre le projet en cours",
    
    "step1": {
      "title": {
        "import": "importer",
        "fileCsv": "un fichier csv",
        "testData": "Essayer nos données test"
      },
      "pasteCsv": "coller ici vos données ou glisser un fichier csv"
    },
    
    "step2": {
      "title": {
        "preview": "aperçu des données"
      },
      "import": {
        "success": "importation réalisée avec succès",
        "fatal": "impossible de continuer, veuillez éditer votre csv",
        "warningsMessage": {
          "one": "anomalie non bloquante",
          "other": "anomalies non bloquantes"
        },
        "warning": {
          "trim": "certaines cellules contiennent des espaces inutiles en début ou en fin de mot. Ils ont été supprimés lors de l'importation"
        },
        "errorsMessage": {
          "one": "anomalie bloquante",
          "other": "anomalies bloquantes"
        },
        "error": {
          "header.emptyCell": "l'entête semble incorrecte : certaines cellules sont vides.",
          "oneColumn": "une seule colonne a été trouvée",
          "colNumber": "csv incorrectement formaté : toutes les lignes ne possèdent pas le même nombre de colonnes."
        },
        "rowCount": {
          "one": "ligne importée",
          "other": "lignes importées"
        },
        "colCount": {
          "one": "colonnes importée",
          "other": "colonnes importées"
        }
      },
      "back": "importer de nouvelles données"
    }
    
  },
  
  "navigation": {

    "editColumn": "Edition d'une colonne",

    "sidebar": {
      "data" : "données",
      "visualisations" : "visualisations",
      "export": "export"
    }
    
  },

  "variable.meta": {
    "type": {
      "text": "texte",
      "numeric": "numérique",
      "geo": "code géographique",
      "lat": "latitude",
      "lon": "longitude",
      "auto": "automatique"
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
      "surface": "surface",
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
      "name": "Orthographique",
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
      "choose": "choix d'une visualisation",
      "categories": "catégories",
      "nodata": "absence de données"
    },
    "settings": {
      "diagram": {
        "title": "diagramme de fréquences",
        "frequencies": "fréquences",
        "values": "valeurs"
      },
      "title" : "réglages",
      "symbols": "symboles",
      "discretization": {
        "title": "discrétisation",
        "method": {
          "unique": "proportionnels",
          "grouped": "regroupés en classes"
        },
        "type": {
          "regular": "intervalles réguliers",
          "mean": "moyennes emboitées",
          "quantile": "quantiles",
          "linear": "aucune"
        }
      },
      "classes": "classes",
      "breakValue": "valeur de rupture",
      "shape": "forme",
      "size": "taille",
      "contrast": "contraste",
      "color": {
        "one": "couleur",
        "other": "couleurs"
      },
      "pattern": {
        "one": "hachure",
        "other": "hachures"
      },
      "reverse": "inverser",
      "stroke": "contour",
      "opacity": "opacité"
    },
    "type": {
      "quanti": {
        "val_surfaces": {
          "name": "valeurs > surfaces",
          "description": "le dégradé de couleurs suit les valeurs"
        },
        "val_symboles": {
          "name": "valeurs > symboles",
          "description": "les symboles sont proportionnels aux valeurs"
        }
      },
      "quali": {
        "cat_surfaces": {
          "name": "catégories > surfaces",
          "description": "les couleurs différencient les catégories"
        },
        "taille_valeur": {
          "name": "catégories sur surfaces 2",
          "description": "l'ordre des symbols respecte celui des valeurs"
        },
        "cat_symboles": {
          "name": "catégories > symboles",
          "description": "les symboles différencient les catégories"
        },
        "ordre_symboles": {
          "name": "catégories sur symboles 2",
          "description": "l'ordre des symbols respecte celui des valeurs"
        }
      }
    },
    "rule": {
      "no_value": "(aucune valeur)"
    },
    "warning": {
      "rule.count": {
        "title": "anomalie non bloquante",
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
      "legend": "légende",
      "labels": "étiquettes",
      "styles": "habillage de la carte",
      "sizes": "dimensions",
      "export": "export"
    },
    "placeholder": {
      "mapTitle": "titre de la carte",
      "dataSource": "source des données",
      "author": "auteur / crédit",
      "comment": "commentaire"
    },
    "settings": {
      "showLegend": "afficher",
      "width": "largeur",
      "height": "hauteur",
      "borders": "frontières",
      "grid": "graticules",
      "background": "fond de carte"
    }
  },

  "legend": {
    "editTitleHere": "editez ici le titre de la légende"
  },

  "examples": {
    "eco2": "Emissions CO2",
    "surface_forets": "Surfaces de forêts"
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
