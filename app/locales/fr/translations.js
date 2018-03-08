export default {

  "general": {
    "next": "suivant",
    "back": "retour",
    "submit": "envoyer",
    "cancel": "annuler",
    "later": "plus tard",
    "import": "importer",
    "continue": "continuer",
    "validate": "valider",
    "open": "Ouvrir",
    "close": "Fermer",
    "or": "ou",
    "and": "et",
    "none": "aucune",
    "download": "télécharger",
    "overwrite": "écraser",
    "duplicate": "dupliquer",
    "loading": "chargement",
    "search": "rechercher",
    "save": "enregistrer le projet",
    "width": "largeur",
    "yes": "oui",
    "no": "non",
    "warning": "warning",
    "add": "ajouter",
    "error": {
     "one": "erreur",
     "other": "erreurs"
    }
  },

  "d3.format": {
    "decimal": ",",
    "thousands": " "
  },

  "help.wiki": "Aide - Wiki Khartis",

  "updater": {
    "title": "Une mise à jour est disponible",
    "installAndRestart": "Installer et relancer",
    "releaseNotes": "notes de mise à jour",
    "installation": "Installation en cours"
  },

  "project": {

    "resume": "reprendre le projet en cours",

    "step1": {
      "title": {
        "import": "importer les données par copier-coller depuis un tableur ou glisser-déposer",
        "fileCsv": "un fichier csv",
        "testData": "Essayer nos données test",
        "selectAMap": "Sélectionner un fond de carte"
      },
      "tooltip": {
        "csv": "Fichier d'extension .csv avec des virgules en séparateur de colonnes",
        "resumeProject": "Le dernier projet édité sur ce poste sera restauré",
        "importProject": "Importer un projet sauvegardé"
      },
      "pasteCsv": "coller ici votre tableau de données ou glisser un fichier csv",
      "downloadCsvModel": "télécharger le modèle (.csv)",
      "importPoject": {
        "title": "Importer ou glisser un projet Khartis",
        "loadError": "Imopssible de charger le fichier sélectionné",
        "projectExists": "Ce projet existe déjà dans votre historique"
      },
      "search" : "Rechercher un pays, une région, un département..."
    },

    "step2": {
      "title": {
        "preview": "aperçu des données"
      },
      "import": {
        "success": "importation réalisée avec succès",
        "fatal": "impossible de continuer, veuillez éditer et modifier votre csv",
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
          "header.emptyCell": "l'entête semble incorrecte : certaines cellules sont vides.",
          "oneColumn": "une seule colonne a été trouvée",
          "colNumber": "csv mal formaté : toutes les lignes ne possèdent pas le même nombre de colonnes."
        },
        "noError": "aucune erreur détectée",
        "correct": "corriger",
        "rowCount": {
          "one": "ligne importée",
          "other": "lignes importées"
        },
        "colCount": {
          "one": "colonnes importée",
          "other": "colonnes importées"
        },
        "geoRefColumn": "Colonne de référence géographique",
        "geoRefColumnNotFound": "Aucune colonne géoréférençable n'a été trouvée",
        "tooltip": {
          "geoRefColumn": "C'est la colonne de votre tableau qui servira à identifier la géographie de vos données"
        }
      },
      "editColumn": {
        "unrecognizedColumns": "Certaines cellules n'ont pas été reconnues",
        "autoCorrect": "correction auto."
      },
      "back": "importer de nouvelles données"
    }

  },

  "navigation": {

    "editColumn": "Édition d'une colonne",

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
    "bertin": {
      "name": "Bertin (1953)",
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
        "classes": "classes",
        "tooltip": {
          "title": "Il montre la répartition des occurrences selon les valeurs de la série"
        }
      },
      "title" : "réglages",
      "symbols": "symboles",
      "thresholds": "seuils",
      "discretization": {
        "title": "discrétisation",
        "tooltip": {
          "title": "La discrétisation consiste au découpage de données en classes homogènes"
        },
        "method": {
          "unique": "proportionnels",
          "grouped": "regroupés en classes",
          "tooltip": {
            "unique": "Chaque valeur est traduite par un symbole qui lui est strictement proportionnel",
            "grouped": "Les valeurs sont regroupées en classes ordonnées de symboles"
          }
        },
        "type": {
          "regular": "intervalles réguliers",
          "mean": "moyennes emboitées",
          "quantile": "quantiles",
          "standardDeviation": "standardisation",
          "jenks": "jenks",
          "linear": "aucune",
          "manual": "seuils manuels"
        }
      },
      "classes": "classes",
      "breakValue": "valeur de rupture",
      "shape": {
        "title": "forme",
        "rect": "carré",
        "circle": "cercle",
         "bar": "barre",
         "triangle": "triangle"
      },
      "size": "taille",
      "scale": "Échelle",
      "contrast": {
        "title": "contraste",
        "tooltip": "Comprime ou dilate la taille pour une « lecture » de l’information différente de la normale"
      },
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
      "strokeSize": "épaisseur du trait",
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
          "description": "le dégradé de couleurs suit l'ordre des valeurs"
        },
        "cat_symboles": {
          "name": "catégories > symboles",
          "description": "les symboles différencient les catégories"
        },
        "ordre_symboles": {
          "name": "catégories sur symboles 2",
          "description": "l'ordre des symboles suit celui des valeurs"
        }
      }
    },
    "rule": {
      "no_value": "(aucune valeur)"
    },
    "warning": {
      "rule.count": {
        "title": "anomalie non bloquante",
        "about": "",
        "explenation": "Êtes-vous sûr que vos données contiennent des catégories ?",
        "help": {
          "_": "Le nombre d'occurrences détectées laisse penser que vos données montrent plutôt des quantités.",
          "1": "Il serait alors plus approprié d'utiliser la proportionnalité ou l'ordre.",
          "2": "",
          "3": ""
        }
      }
    },
    "alert": {
      "remove": {
        "title": "Confirmation de suprression",
        "content": "Êtes vous sur de vouloir supprimer ce calque ?"
      },
      "bigDataSet": {
        "title": "Attention",
        "content": "Ce calque contient beaucoup de valeurs et cela pourrait entrainer des problèmes de performances. Voulez-vous continuer ?"
      },
      "threshold": {
        "title": "nouveau seuil",
        "extent": "borne en dehors de la série statistique",
        "valueUsed": "borne déjà utilisée"
      }
    }
  },

  "export": {
    "title": {
      "labels": "étiquettes",
      "legend": "légende",
      "styles": "personnaliser",
      "sizes": "dimensions",
      "export": "export",
      "drawings": "habillage",
    },
    "placeholder": {
      "mapTitle": "titre de la carte",
      "dataSource": "source des données",
      "author": "auteur / crédit",
      "comment": "commentaire"
    },
    "settings": {
      "labelling": {
        "size": "taille",
        "color": "couleur",
        "filter": "filtrer selon",
        "categories": "catégories",
        "chooseCategories": "choisir",
        "threshold": "seuil",
        "selectAll": "tout cocher",
        "unselectAll": "tout décocher",
      },
      "show": "afficher",
      "reset": "réinitialiser",
      "edit": "Éditer",
      "legend": {
        "stacking": "présentation",
        "chooseLegend": "choisir",
        "roundValue": "arrondir les valeurs",
        "valuePrecision": "chiffres après la virgules"
      },
      "title": "titre",
      "width": "largeur",
      "height": "hauteur",
      "orientation": {
        "title": "orientation",
        "horizontal": "horizontal",
        "vertical": "vertical"
      },
      "borders": "frontières ou limites",
      "grid": "graticules",
      "background": "fond de carte",
      "image": {
        "title": "image",
        "normal": "normale",
        "large": "grande (@2x)",
        "xLarge": "très grande (@3x)"
      },
      "vector": "vecteur",
      "optimised": "pour",
      "formatSelection": "au format"
    },
    "drawings": {
      "text": "text",
      "addDrawing": {
        "1": "Ajouter un texte",
        "2": "ou une flèche",
        "3": "à l’aide de la barre d’outils verticale à droite"
      },
      "addLine": "ajouter une flèche",
      "curve": "courbure",
      "strokeWidth": "Épaisseur",
      "dash": "pointillés",
      "shapes": "formes",
      "align": "alignement",
      "text": "text",
      "scale": "Échelle",
      "symbol": "symbole",
      "inherited": "héritée",
      "anchor": {
        "title": "ancrage",
        "onMap": "sur la carte",
        "onPage": "sur la page",
        "warning": "le dessin n'a pu être ancré sur la carte, il a été ancré sur la page",
        "tooltip": {
          "onMap": "L'objet suit la géographie de la carte",
          "onPage": "L'objet est fixe dans la page"
        }
      },
      "helper": {
        "text": "Cliquer sur la carte pour ajouter du texte",
        "arrow": "Cliquer sur la carte pour ajouter une flèche"
      }
    }
  },

  "legend": {
    "editTitleHere": "Éditez ici le titre de la légende"
  },

  "toolbar": {
    "blindness": {
      "menu.title": "Simulation de daltonisme",
      "type": {
        "protanopia": "protanopie (rouge-vert)",
        "protanomaly": "protanomalie (rouge-vert)",
        "deuteranopia": "deutéranopie (rouge-vert)",
        "deuteranomaly": "deutéranomalie (rouge-vert)",
        "tritanopia": "tritanopie (bleu-jaune)",
        "tritanomaly": "tritanomalie (bleu-jaune)",
        "achromatopsia": "achromatopsie",
        "achromatomaly": "achromatomalie"
      }
    },
    "tooltip": {
      "center": "Centrer la carte",
      "zoomin": "Zoom avant",
      "zoomout": "Zoom arrière",
      "info": "Information sur un élément de la carte",
      "blindness": "Simulation de daltonisme",
      "drawText": "Ajouter un texte",
      "drawArrow": "Ajouter une flèche"
    }
  },

  "basemap": {
    "world": "Monde > pays (2016)",
    "german states 2016": "Allemagne > Land (2016)",
    "german districts 2016": "Allemagne > Arrondissement (2016)",
    "brazil ufe 2015": "Brésil > États (2015)",
    "brazil mee 2015": "Brésil > mésorégions (2015)",
    "brazil mie 2015": "Brésil > microrégions (2015)",
    "canada prov 2016": "Canada > provinces (2016)",
    "canada cd 2016": "Canada > divisions de recensement (2016)", 
    "eu country 2013": "Europe > pays (2016)",
    "eu nuts-2 2013": "Europe > nuts 2 (2013)",
    "eu nuts-3 2013": "Europe > nuts 3 (2013)",
    "spain prov 2015": "Espagne > provinces (2015)",
    "spain auto 2015": "Espagne > communautés (2015)",    
    "us state 2015": "États-Unis > États (2015)",
    "france dept": "France > départements (2016)",
    "france reg 2015": "France > régions (2015)",
    "france reg 2016": "France > régions (2016)",
    "france circ 2017": "France > circonscriptions législatives (2012 & 2017)",
    "FR-11 com 2016": "France > communes (2016) > Île-de-France",
    "FR-24 com 2016": "France > communes (2016) > Centre-Val de Loire",
    "FR-27 com 2016": "France > communes (2016) > Bourgogne-Franche-Comté",
    "FR-28 com 2016": "France > communes (2016) > Normandie",
    "FR-32 com 2016": "France > communes (2016) > Hauts-de-France",
    "FR-44 com 2016": "France > communes (2016) > Grand Est",
    "FR-52 com 2016": "France > communes (2016) > Pays de la Loire",
    "FR-53 com 2016": "France > communes (2016) > Bretagne",
    "FR-75 com 2016": "France > communes (2016) > Nouvelle-Aquitaine",
    "FR-76 com 2016": "France > communes (2016) > Occitanie",
    "FR-84 com 2016": "France > communes (2016) > Auvergne-Rhône-Alpes",
    "FR-93 com 2016": "France > communes (2016) > Provence-Alpes-Côte d’Azur",
    "FR-94 com 2016": "France > communes (2016) > Corse",
    "FRA10 com 2016": "France > communes (2016) > Guadeloupe",
    "FRA20 com 2016": "France > communes (2016) > Martinique",
    "FRA30 com 2016": "France > communes (2016) > Guyane",
    "FRA40 com 2016": "France > communes (2016) > La Réunion",
    "FRA50 com 2016": "France > communes (2016) > Mayotte",
    "FR-11 com 2017": "France > communes (2017) > Île-de-France",
    "FR-24 com 2017": "France > communes (2017) > Centre-Val de Loire",
    "FR-27 com 2017": "France > communes (2017) > Bourgogne-Franche-Comté",
    "FR-28 com 2017": "France > communes (2017) > Normandie",
    "FR-32 com 2017": "France > communes (2017) > Hauts-de-France",
    "FR-44 com 2017": "France > communes (2017) > Grand Est",
    "FR-52 com 2017": "France > communes (2017) > Pays de la Loire",
    "FR-53 com 2017": "France > communes (2017) > Bretagne",
    "FR-75 com 2017": "France > communes (2017) > Nouvelle-Aquitaine",
    "FR-76 com 2017": "France > communes (2017) > Occitanie",
    "FR-84 com 2017": "France > communes (2017) > Auvergne-Rhône-Alpes",
    "FR-93 com 2017": "France > communes (2017) > Provence-Alpes-Côte d’Azur",
    "FR-94 com 2017": "France > communes (2017) > Corse",
    "FRA10 com 2017": "France > communes (2017) > Guadeloupe",
    "FRA20 com 2017": "France > communes (2017) > Martinique",
    "FRA30 com 2017": "France > communes (2017) > Guyane",
    "FRA40 com 2017": "France > communes (2017) > La Réunion",
    "FRA50 com 2017": "France > communes (2017) > Mayotte"
  },

  "examples": {
    "pop": "Population des États (2010-2015)",
    "idh": "Évolution de l'IDH (1990-2014)",
    "alim": "Sous-alimentation (2014-2016)",
    "unesco": "Sites de l'Unesco (2015)",
    "br_ufe-pop": "Population (2015)",
    "fr_dpt-pop": "Population (2013)",
    "fr_dpt-poverty": "Pauvreté (2013)",
    "fr_reg2015-pop": "Population (2013)",
    "fr_reg2015-poverty": "Pauvreté (2013)",
    "fr_reg2016-pop": "Population (2013)",
    "fr_reg2016-poverty": "Pauvreté (2013)",
    "fr-pres-2012-t1": "Élection présidentielle, 1er tour (2012)",
    "fr-pres-2012-t2": "Élection présidentielle, 2nd tour (2012)",
    "fr-pres-2017-t1": "Élection présidentielle, 1er tour (2017)",
    "fr-pres-2017-t2": "Élection présidentielle, 2nd tour (2017)",
    "es_prov-pop": "Population (2000-2015)",
    "de_district_inhabitants": "Population (31/12/2015)",
    "de_states_inhabitants_06_15": "Population (2006 - 2015)",
    "es_auto-pop": "Population (2000-2015)",
    "us_state-pop": "Population (2010-2015)",
    "eu_country-energie": "Énergie renouvelable dans la consommation finale brute d'énergie (2005-2014)",
    "eu_country-ecommerce": "Achats effectués sur internet par des particuliers dans les 12 mois (2004-2016)",
    "eu_nuts2-travail": "Heures moyennes travaillées par semaine (2015)",
    "eu_nuts2-agriculture": "Surperficie agricole utilisée (SAU) selon la taille des exploitations (2013)",
    "eu_nuts3-pop": "Densité de population (2015)",
    "ca-prov-life-2015": "Espérance de vie (2013-2015)",
    "ca-cd-pop-2017": "Population (2011-2017)"
  },

  "importMap": {
    "title": "Importer une carte",
    "success": "Les fichiers ont bien été traités, voulez-vous les importer ?",
    "selectLayer": "Choisissez les couches à importer.",
    "withId": "avec l'identifiant",
    "error": {
      "title": "erreur",
      "noFile": "Aucun fichier valide trouvé",
      "unknow": "Impossible de traiter les fichiers sélectionnés",
      "unknownProjection": "projection non reconnue",
      "layersOnError": "des couches contiennent des erreurs"
    }
  }

};
