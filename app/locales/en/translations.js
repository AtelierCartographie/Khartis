export default {
  
  "general": {
    "welcomeTo": "Welcome to",
    "onlineEditor": "online map editor",
    "Next": "Next",
    "Back": "Back",
    "Submit": "Submit",
    "Cancel": "Cancel",
    "Import": "Importe",
    "Continue": "Continue",
    "Validate": "Validate",
    "open": "Open",
    "close": "Close",
    "or": "or",
    "and": "and",
    "gradientOf": "Gradient of",
    "pageLayout": "Page layout",
    "varMapping": "Variable mapping",
    "addAVariable": "add a variable",
    "contextualHelp": "Contextual help",
    "chooseMap": "Choose a map",
    "dataType": "data type",
    "label": "label",
    "none": "none",
    "summary": "summary",
    "mappingType": "mapping type",
    "backMap": "Back map"
  },

  "project": {

    "resume": "reprendre le projet en cours",

    "step1": {
      "title": {
        "importCsv": "importer un fichier csv",
        "testData": "jeux de données de test"
      },
      "pasteCsv": "coller ici vos données ou glisser un fichier csv"
    },

    "step2": {
      "title": {
        "preview": "aperçu des données"
      },
      "import": {
        "success": "importation réalisée avec succés",
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
      }
    }

  },

  "navigation": {
    "openMap": "Open the map",
    "chooseProjection": "Choose a projection",
    "chooseVisualization": "Choose a visualization",
    "editColumn": "Column Editing",

    "sidebar": {
      "data" : "Data",
      "visualisations" : "Visualizations",
      "variables": "variables",
      "layout": "Layout",
      "layers": "Layers",
      "legend": "Legend",
      "export": "Export"
    }

  },
  
  "variable.meta": {
    "type": {
      "text": "text",
      "numeric": "numeric",
      "geo": "geographic code",
      "lat": "latitude",
      "lon": "longitude",
      "auto": "auto"
    }
  },
  
  "variable.mapping": {
    "type": {
      "shape": "shape",
      "surface": "surface",
      "text": "text"
    },
    "scaleOf": {
      "size": "size",
      "fill": "color"
    },
    "pattern": {
      "solid": "solid",
      "horizontal": "horizontal strip",
      "vertical": "vertical strip",
      "diagonal": "diagonal strip"
    },
    "shape": {
      "point": "point",
      "rect": "rect",
      "text": "text"
    }
  },
  
  "projection": {
    "naturalEarth": {
      "name": "Natural earth",
      "description": "Natural earth's description"
    },
    "orthographic": {
      "name": "Orhtographic",
      "description": ""
    },
    "mercator": {
      "name": "Mercator",
      "description": ""
    }
  },
  
  "graph": {
    "displayedVars": "Displayed variables"
  },
  
  "success": {
    "typeCoherency": "All cells are corectly formatted"
  },
  
  "warning": {
    "typeCoherency": "Some cells contains data that differs from the selected column type"
  },
  
  "error": {
    "noGeoColumn": "You must specify at least one georeferenced column or lat / lon columns. Please qualify your data."
  },
  
  "import": {
    "preview": "Preview",
    "report": "Import report",
    "editor.paste.csv": "paste here the csv to import",
    "editor.upload.file": "upload a file",
    "editor.importTitle": "Import a csv file",
    "testDataSetTitle" : "Test Dataset",
    "startImport": "Start import",
    "qualifyData": "Qualify data",
    "success": "Import has been successfull. Data are ready to be processed.",
    "fatal": "Import can be processed, please edit your csv",
    "warningsMessage": {
      "one": "non blocking warning",
      "other": "non blocking warnings"
    },
    "warning": {
      "trim": "Some cells contained spaces which has been supressed by the process."
    },
    "errorsMessage": {
      "one": "blocking issue",
      "other": "blocking issues"
    },
    "error": {
      "header.emptyCell": "Header is incorrect : come cells are empty.",
      "oneColumn": "Only one column has been found",
      "colNumber": "Csv format is incorrect. Some rows have different column count"
    },
    "rowCount": "lines imported",
    "colCount": "columns imported"
    
  },
  "spreadsheet": {
    "sidebar.title": "Data edition",
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
