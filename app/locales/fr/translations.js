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
        "values": "valeurs",
        "cumulatives": "cumulées",
        "classes": "classes"
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
    "surface_forets": "Surfaces de forêts",
    "fr_dpt": "France département test"
  }
  
};
