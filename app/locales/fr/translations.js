export default {
  
  "general": {
    "welcomeTo": "Bienvenue dans",
    "onlineEditor": "outil de création de cartes en ligne",
    "Next": "Suivant",
    "Back": "Retour",
    "Submit": "Envoyer",
    "Cancel": "Annuler",
    "Import": "Importer",
    "Continue": "Continuer",
    "Validate": "Valider",
    "or": "ou",
    "gradientOf": "Dégradé de",
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
    "backMap": "Fond de carte"
  },
  
  "navigation": {
    "openMap": "Ourvir la carte",
    "chooseProjection": "Choisir une projection"
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
    }
  },
  
  "projection": {
    "atlantis": {
      "name": "Atlantis",
      "description": "Ceci est une description"
    },
    "briesemeister": {
      "name": "Briesemeister",
      "description": "Ceci est une description"
    },
    "interrupted_goode_homolosine": {
      "name": "Interrupted Goode Homolosine",
      "description": "Ceci est une description"
    },
    "lambert_azimuthal_equal_area": {
      "name": "Lambert Azimuthal Equal-Area",
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
      "name": "Waterman butterfly",
      "description": "Ceci est une description"
    },
    "mercator": {
      "name": "Mercator",
      "description": "Ceci est une description"
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
    "report": "Rapport d'importation",
    "editor.paste.csv": "collez ici le csv à importer",
    "editor.upload.file": "téléversez un fichier",
    "startImport": "Lancer l'importation",
    "qualifyData": "Qualifier les données",
    "success": "L'importation a été réalisée avec succés. Les données sont prêtes à être intégrées.",
    "fatal": "Impossible d'importer les données, veuillez éditer votre csv",
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
  }
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
