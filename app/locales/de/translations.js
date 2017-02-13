export default {
  
  "general": {
    "next": "Weiter",
    "back": "Zurück",
    "submit": "submit",
    "cancel": "Abbrechen",
    "import": "Import",
    "continue": "OK",
    "validate": "Eingaben prüfen",
    "open": "Öffnen",
    "close": "Schließen",
    "or": "oder",
    "and": "und",
    "none": "none",
    "download": "Download",
    "loading": "Laden",
    "search": "Bitte wählen",
    "save": "Speichern",
    "yes": "Ja",
    "no": "Nein",
    "error": {
     "one": "Fehler",
     "other": "Fehler" 
    }
  },

  "d3.format": {
    "decimal": ".",
    "thousands": ","
  },

  "help.wiki": "Hilfe - Wiki Khartis",
  
  "project": {
   
    "resume": "Projekt wiederherstellen",
    
    "step1": {
      "title": {
        "import": "Importieren",
        "fileCsv": "Eine CSV-Datei",
        "testData": "Nutzen Sie einen Beispiel-Datensatz",
        "selectAMap": "Wählen Sie eine Karte"
      },
      "tooltip": {
        "csv": "Komma separierte CSV-Datei",
        "resumeProject": "Das letzte Projekt wiederherstellen",
        "importProject": "Importieren Sie ein Khartis Projekt"
      },
      "pasteCsv": "Daten aus der Zwischenablage einfügen oder mittels 'Drag & Drop' eine CSV-Datei einspielen",
      "downloadCsvModel": "Download des Modells (.csv)",
      "importPoject": {
        "title": "Khartis Projekt importieren",
        "loadError": "Fehler beim laden der Datei"
      }
    },
    
    "step2": {
      "title": {
        "preview": "Vorschau der Daten"
      },
      "import": {
        "success": "Importvorgang erfolgreich",
        "fatal": "Bearbeiten Sie bitte Ihre CSV-Datei und versuchen Sie es dann noch einmal.",
        "warningsMessage": {
          "one": "non-blocking anomaly",
          "other": "non-blocking anomalies"
        },
        "warning": {
          "trim": "Wir haben einige Zellen Ihrer CSV-Datei um unnötige Leerzeichen (am Anfang oder Ende eines Wertes) bereinigt."
        },
        "errorsMessage": {
          "one": "blocking anomaly",
          "other": "blocking anomalies"
        },
        "error": {
          "header.emptyCell": "Die Kopfzeile scheint Fehler zu enthalten: Einige Zellen sind Leer.",
          "oneColumn": "Wir konnten nur eine Spalte identifizieren",
          "colNumber": "CSV-Formatierunsfehler: Zeilen haben eine unterschiedliche Anzahl an Spalten."
        },
        "rowCount": {
          "one": "Zeile importiert",
          "other": "Zeilen importiert"
        },
        "colCount": {
          "one": "Spalte importiert",
          "other": "Spalten importiert"
        },
        "geoRefColumn": "Geograpische Referenz",
        "geoRefColumnNotFound": "Wir konnten in der Tabelle keine Spalte identifizieren welche eine geographischen Referenz enthält",
        "tooltip": {
          "geoRefColumn": "Die Spalte ihrer Tabelle welche die geographische Referenz enthält"
        }
      },
      "editColumn": {
        "unrecognizedColumns": "Einige Werte konnten wir nicht zuordnen"
      },
      "back": "Von vorne: Neue CSV-Datei importieren"
    }
    
  },
  
  "navigation": {

    "editColumn": "Spalte bearbeiten",

    "sidebar": {
      "data" : "Daten",
      "visualisations" : "Visualisierung",
      "export": "Export"
    }
    
  },

  "variable.meta": {
    "type": {
      "text": "Text",
      "numeric": "Numerisch",
      "geo": "Geographische Referenz",
      "lat": "Breitengrad",
      "lon": "Längengrad",
      "auto": "Automatisch"
    }
  },
  
  "projection": {
    "title": "Projektion",
    "settings": {
      "longitude": "Längengrad",
      "latitude": "Breitengrad",
      "rotation": "Rotation"
    },
    "rating": {
      "surface": "Fläche",
      "distance": "Distanz",
      "angle": "Winkel"
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
      "choose": "Wählen Sie eine Visualisierung",
      "categories": "Kategorien",
      "nodata": "fehlende Daten"
    },
    "settings": {
      "diagram": {
        "title": "Häufigkeitsverteilung",
        "frequencies": "Häufigkeit",
        "values": "Werte",
        "cumulatives": "Kumulativ",
        "classes": "klassifiziert",
        "tooltip": {
          "title": "Histogram zur Verteilung der Werte"
        }
      },
      "title" : "Einstellungen",
      "symbols": "Symbole",
      "discretization": {
        "title": "Diskretisierung",
        "tooltip": {
          "title": "Als Diskretisierung (engl. discretization) bezeichnet man die Gewinnung einer diskreten Teilmenge aus einer kontinuierlichen Daten- oder Informationsmenge. Diskretisierung ist ein zentrales Konzept in der numerischen Mathematik und in der Kartografie, wo damit die Zerlegung räumlicher Kontinua wie Oberflächen etc. in kleine Abschnitte bzw. einzelne Punkte bezeichnet wird. (Deutsche Wikipedia, 2017)"
        },
        "method": {
          "unique": "Proportional",
          "grouped": "Wertes in Klassen",
          "tooltip": {
            "grouped": "Werte werden in Klassen gruppiert"
          }
        },
        "type": {
          "regular": "Gleichmäßiges Intervall",
          "mean": "Verschachteltes Mittel",
          "quantile": "Quantile",
          "standardDeviation": "Standardabweichung",
          "jenks": "Jenks-Caspall-Algorithmus",
          "linear": "Linear"
        }
      },
      "classes": "Klassen",
      "breakValue": "Schwellwert",
      "shape": {
        "title": "Form",
        "rect": "Rechteck",
        "circle": "Kreis"
      },
      "size": "Größe",
      "contrast": "Kontrast",
      "color": {
        "one": "Farbe",
        "other": "Farben"
      },
      "pattern": {
        "one": "Schraffierend",
        "other": "Schraffierend"
      },
      "reverse": "Umkehren",
      "stroke": "Linie",
      "strokeSize": "Linienstärke",
      "opacity": "Opazität"
    },
    "type": {
      "quanti": {
        "val_surfaces": {
          "name": "Wert > Fläche",
          "description": "color gradient follows the values"
        },
        "val_symboles": {
          "name": "Wert > Symbol",
          "description": "symbols are proportionnal to the values"
        }
      },
      "quali": {
        "cat_surfaces": {
          "name": "Kategorie > Fläche",
          "description": "various colors separate categories"
        },
        "taille_valeur": {
          "name": "Kategorie auf 2 Flächen",
          "description": "l'ordre des symbols respecte celui des valeurs"
        },
        "cat_symboles": {
          "name": "Kategorie > Symbol",
          "description": "symbols separate categories"
        },
        "ordre_symboles": {
          "name": "Kategorie auf 2 Symbole",
          "description": "l'ordre des symbols respecte celui des valeurs"
        }
      }
    },
    "rule": {
      "no_value": "(k.A.)"
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
    },
    "alert": {
      "remove": {
        "title": "Entfernen bestätigen",
        "content": "Wollen Sie diese Ebene entfernen?"
      },
      "bigDataSet": {
        "title": "Warnung",
        "content": "Diese Ebene enthält eine große Menge an Daten. Die anstehenden Berechnungen könnten Ihren Browser stark belasten. Möchten Sie fortfahren?"
      }
    }
  },

  "export": {
    "title": {
      "labels": "Bezeichner",
      "styles": "Kartenstil",
      "sizes": "Größe",
      "export": "Export"
    },
    "placeholder": {
      "mapTitle": "Kartentitel",
      "dataSource": "Datenquelle",
      "author": "Autor*in",
      "comment": "Kommentar"
    },
    "settings": {
      "labelling": {
        "show": "Anzeigen",
        "size": "Größe",
        "color": "Farbe",
        "filter": "Filtern nach",
        "categories": "Kategorien",
        "chooseCategories": "Bitte auswählen",
        "threshold": "Schwellenwert",
        "selectAll": "Alles auswählen",
        "unselectAll": "Auswahl aufheben"
      },
      "legend": "Legende",
      "width": "Breite",
      "height": "Höhe",
      "borders": "Rand",
      "grid": "Raster",
      "background": "Basiskarte"
    }
  },

  "legend": {
    "editTitleHere": "Legendenüberschrift bearbeiten"
  },

  "basemap": {
    "world": "Welt > Länder (2016)",
    "brazil ufe 2015": "Brasilien > Bundesländer (2015)",
    "brazil mee 2015": "Brasilien > Mesoregions (2015)",
    "brazil mie 2015": "mesoregions > Microregions (2015)",
    "france dept": "Frankreich > Departments (2016)",
    "france reg 2015": "Frankreich > Regionen (2015)",
    "france reg 2016": "Frankreich > Regionen (2016)",
    "spain prov 2015": "Spanien > Provinzen (2015)",
    "spain auto 2015": "Spanien > Gemeinden (2015)",
    "us state 2015": "USA > Staaten (2015)",
    "eu nuts-2 2013": "Europa (2013)"
  },

  "examples": {
    "pop": "Bevölkerungstatistik der Länder (2010-2015)",
    "idh": "Human-Development-Index (1990-2014)",
    "alim": "Unterernährung (2014-2016)",
    "unesco": "UNESCO-Welterbe (2015)",
    "br_ufe-pop": "Bevölkerungstatistik (2015)",
    "fr_dpt-pop": "Bevölkerungstatistik (2013)",
    "fr_dpt-poverty": "Armutsstatistik (2013)",
    "fr_reg2015-pop": "Bevölkerungstatistik (2013)",
    "fr_reg2015-poverty": "Armutsstatistik (2013)",
    "fr_reg2016-pop": "Bevölkerungstatistik (2013)",
    "fr_reg2016-poverty": "Armutsstatistik (2013)",
    "es_prov-pop": "Bevölkerungstatistik (2000-2015)",
    "es_auto-pop": "Bevölkerungstatistik (2000-2015)",
    "us_state-pop": "Bevölkerungstatistik (2010-2015)"
  }
  
};
