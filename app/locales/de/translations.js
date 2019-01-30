export default {

  "general": {
    "next": "Weiter",
    "back": "Zurück",
    "submit": "Absenden",
    "cancel": "Abbrechen",
    "later": "Later",
    "import": "Import",
    "continue": "OK",
    "validate": "Eingaben prüfen",
    "open": "Öffnen",
    "close": "Schließen",
    "or": "oder",
    "and": "und",
    "none": "Keine",
    "download": "Download",
    "overwrite": "overwrite",
    "duplicate": "duplicate",
    "loading": "Laden",
    "search": "Bitte wählen",
    "save": "Speichern",
    "yes": "Ja",
    "no": "Nein",
    "warning": "warning",
    "add": "ajouter",
    "error": {
     "one": "Fehler",
     "other": "Fehler"
    }
  },

  "d3.format": {
    "decimal": ".",
    "thousands": ","
  },

  "help.wiki": "Hilfe - Khartis Wiki (Französisch)",

  "updater": {
    "title": "An update is available",
    "installAndRestart": "Install and restart",
    "releaseNotes": "release notes",
    "installation": "Install..."
  },

  "project": {

    "resume": "Projekt wiederherstellen",

    "step1": {
      "title": {
        "import": "Importieren",
        "fileCsv": "Eine CSV-Datei",
        "testData": "Nutzen Sie einen Beispiel-Datensatz",
        "selectAMap": "Wählen Sie eine Karte",
        "orImportMap": "Importiere deine eigene Karte"
      },
      "tooltip": {
        "csv": "Komma separierte CSV-Datei",
        "resumeProject": "Das letzte Projekt wiederherstellen",
        "importProject": "Importieren Sie ein Khartis Projekt"
      },
      "pasteCsv": "Daten aus der Zwischenablage einfügen oder einfach per 'Drag & Drop' eine CSV-Datei einspielen.",
      "downloadCsvModel": "Download des Modells (.csv)",
      "importPoject": {
        "title": "Khartis Projekt importieren",
        "loadError": "Fehler beim laden der Datei",
        "projectExists": "Project already exists"
      },
      "search" : "Search by country, region or department",
      "useImportedData": "Use data from base map"
    },

    "step2": {
      "title": {
        "preview": "Vorschau der Daten"
      },
      "import": {
        "success": "Importvorgang erfolgreich",
        "fatal": "Bearbeiten Sie bitte Ihre CSV-Datei und versuchen Sie es dann noch einmal.",
        "warningsMessage": {
          "one": "Vernachlässigbarer Fehler",
          "other": "Vernachlässigbare Fehler"
        },
        "warning": {
          "trim": "Wir haben einige Zellen Ihrer CSV-Datei um unnötige Leerzeichen (am Anfang oder Ende eines Wertes) bereinigt."
        },
        "errorsMessage": {
          "one": "Es ist ein Fehler aufgetreten",
          "other": "Es sind mehrere Fehler aufgetreten"
        },
        "error": {
          "header.emptyCell": "Die Kopfzeile scheint Fehler zu enthalten: Einige Zellen sind Leer.",
          "oneColumn": "Wir konnten nur eine Spalte identifizieren",
          "colNumber": "CSV-Formatierunsfehler: Zeilen haben eine unterschiedliche Anzahl an Spalten."
        },
        "noError": "OK",
        "correct": "Korrektur benötigt",
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
        "unrecognizedColumns": "Einige Werte konnten wir nicht zuordnen",
        "autoCorrect": "auto correct"
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
      "description": "(Transverse Mollweide) Pseudozylindrisch, Flächentreu, John Bartholomew (1948) (Quelle: csiss.org, Public Domain, Paul B. Andersson)"
    },
    "bertin": {
      "name": "Bertin (1953)",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "briesemeister": {
      "name": "Briesemeister",
      "description": "Schiefachsige und neu skalierte Version der Hammer Projektion, William A. Briesemeister (1953) (Quelle: kartenprojektionen.de, CC-BY-SA-4.0)"
    },
    "interrupted_goode_homolosine": {
      "name": "Goode H.",
      "description": "Pseudozylindrisch, Flächentreu. Diese Methode der Kartenprojektion wurde in den 1920er Jahren von John Paul Goode entwickelt. (Quelle: Deutsche Wikipedia, 2017, CC-BY-SA)"
    },
    "lambert_azimuthal_equal_area": {
      "name": "LAEA",
      "description": "Lambertsche Azimutalprojektion. Die Kartenabbildung ist weder längen- noch winkeltreu. Das Kartenzentrum wird verzerrungsfrei dargestellt, jedoch nimmt die Verzerrung zum Rand hin so stark zu, dass diese Bereiche sehr unanschaulich werden. Deshalb wird meist nur maximal eine Halbkugeloberfläche mit dieser Abbildung wiedergegeben. (Quelle: Deutsche Wikipedia, 2017)"
    },
    "mollweide": {
      "name": "Mollweide",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "natural_earth": {
      "name": "Natural Earth",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "orthographic": {
      "name": "Orthographic",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "plate_carree": {
      "name": "Plate carrée",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "waterman_butterfly": {
      "name": "Waterman",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "mercator": {
      "name": "Mercator",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    },
    "armadillo": {
      "name": "Armadillo",
      "description": "Bitte einen Beschreibungstext für diese Projektion einpflegen."
    }
  },

  "visualization": {
    "new": "Add a visualization",
    "title": {
      "choose": "Wählen Sie eine Visualisierung",
      "categories": "Kategorien",
      "nodata": "fehlende Daten",
      "chooseVar": "Choix des variables",
      "chooseOrderedSurf": {
        "title": "You would like",
        "classes": {
          "title": "make classes with your data?",
          "description": "Similar or homogeneous values are grouped into classes to simplify the message. They must be numbers (stocks, dates)."
        },
        "cat": {
          "title": "show pre-existing categories?",
          "description": "Each color is a category in the series. The data can be numbers (dates) or text (e.g. high, medium, low)."
        }
      }
    },
    "variables": {
      "choose": "choose a variable",
      "noneAvailable": "no compatible variable is available",
      "checkTheTypes": "check types at data step.",
      "transform": "use another variable to put color into symbols or compare two symbols"
    },
    "settings": {
      "diagram": {
        "title": "Häufigkeitsverteilung",
        "frequencies": "Häufigkeit",
        "values": "Werte",
        "cumulatives": "Kumulativ",
        "classes": "Klassifiziert",
        "tooltip": {
          "title": "Histogram zur Verteilung der Werte"
        }
      },
      "title" : "Darstellungsoptionen",
      "symbols": "Symbole",
      "surfaces": "surfaces",
      "thresholds": "thresholds",
      "discretization": {
        "title": "Diskretisierung",
        "tooltip": {
          "title": "Als Diskretisierung bezeichnet man die Gewinnung einer diskreten Teilmenge aus einer kontinuierlichen Daten- oder Informationsmenge. Diskretisierung ist ein zentrales Konzept in der numerischen Mathematik und in der Kartografie, wo damit die Zerlegung räumlicher Kontinua wie Oberflächen etc. in kleine Abschnitte bzw. einzelne Punkte bezeichnet wird. (Deutsche Wikipedia, 2017)"
        },
        "method": {
          "unique": "Proportional",
          "grouped": "Werte in Klassen",
          "tooltip": {
            "unique": "Jeder einzelne Wert wird durch ein Symbol dargestellt",
            "grouped": "Werte werden in Klassen gruppiert und jede Klasse erhält ein Symbol"
          }
        },
        "type": {
          "regular": "Gleichmäßiges Intervall",
          "mean": "Verschachteltes Mittel",
          "quantile": "Quantile",
          "standardDeviation": "Standardabweichung",
          "jenks": "Jenks-Caspall-Algorithmus",
          "linear": "Linear",
          "manual": "manual"
        }
      },
      "classes": "Klassen",
      "breakValue": "Schwellwert",
      "shape": {
        "title": "Form",
        "rect": "Rechteck",
        "circle": "Kreis",
        "triangle": "triangle"
      },
      "size": "Größe",
      "scale": "scale",
      "contrast": {
        "title": "Kontrast",
        "tooltip": "Einstellungen zu Kontrast"
      },
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
          "description": "Farbverlauf entlang der Werte"
        },
        "val_symboles": {
          "name": "Wert > Symbol",
          "description": "Symbolgröße proportional zum Wert"
        }
      },
      "quali": {
        "cat_surfaces": {
          "name": "Kategorie > Fläche",
          "description": "Farbe je Kategorie"
        },
        "taille_valeur": {
          "name": "Kategorie auf 2 Flächen",
          "description": "Die Reihenfolge der Farben entspricht denen der Werte"
        },
        "cat_symboles": {
          "name": "Kategorie > Symbol",
          "description": "Symbol je Kategorie"
        },
        "ordre_symboles": {
          "name": "Kategorie auf 2 Symbole",
          "description": "Die Reihenfolge der Symbole entspricht denen der Werte"
        }
      }
    },
    "rule": {
      "no_value": "(k.A.)"
    },
    "warning": {
      "rule.count": {
        "title": "Vernachlässigbarer Fehler",
        "about": "Details",
        "explenation": "Achtung: Es gibt jetzt mehr als 8 Ebenen. Derart viele Ebenen einzusetzen kann die Klarheit bzw. Lesbarkeit der Karte beeinträchtigen.",
        "help": {
          "_": "Bitte achten Sie auf:",
          "1": "1 / den Text (Nominal)",
          "2": "2 / die Zahlen (Ordinal)",
          "3": "3 / bis zu insgesamt max. 12 Kategorien"
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
      },
      "threshold": {
        "title": "new threshold",
        "extent": "threshold is outside of the statistical series",
        "valueUsed": "threshold is already used"
      }
    }
  },

  "export": {
    "title": {
      "labels": "Bezeichner",
      "styles": "customize",
      "sizes": "Größe",
      "legend": "legende",
      "export": "Export",
      "drawings": "drawings"
    },
    "placeholder": {
      "mapTitle": "Kartentitel",
      "dataSource": "Lizenzhinweise",
      "author": "Autor/innen",
      "comment": "Kommentar"
    },
    "settings": {
      "labelling": {
        "text": "text",
        "filter": "Filtern nach",
        "categories": "Kategorien",
        "chooseCategories": "Bitte auswählen",
        "threshold": "Schwellenwert",
        "selectAll": "Alles auswählen",
        "unselectAll": "Auswahl aufheben",
      },
      "show": "Anzeigen",
      "reset": "reset",
      "edit": "edit",
      "legend": {
        "stacking": "presentation",
        "chooseLegend": "choose",
        "roundValue": "round values",
        "valuePrecision": "decimals"
      },
      "title": "titre",
      "width": "Breite",
      "height": "Höhe",
      "orientation": {
        "title": "orientation",
        "horizontal": "horizontal",
        "vertical": "vertical"
      },
      "borders": "Rand",
      "grid": "Raster",
      "background": "Basiskarte",
      "image": {
        "title": "image",
        "normal": "normal",
        "large": "large (@2x)",
        "xLarge": "extra large (@3x)"
      },
      "vector": "vectoriel",
      "optimised": "for",
      "formatSelection": "with format"
    },
    "drawings": {
      "text": "text",
      "addDrawing": {
        "1": "Add text",
        "2": "or an arrows",
        "3": "using the toolbar on the right side of the screen"
      },
      "curve": "curve",
      "strokeWidth": "stroke",
      "dash": "dash",
      "shapes": "shapes",
      "align": "align",
      "text": "text",
      "scale": "scale",
      "symbol": "symbol",
      "inherited": "inherited",
      "anchor": {
        "title": "ancrage",
        "onMap": "on the map",
        "onPage": "on page",
        "warning": "this drawing can't be anchored on the map, it has been anchored on the page",
        "tooltip": {
          "onMap": "Object follows map's geography",
          "onPage": "Object's postiion is fixed in page"
        }
      },
      "helper": {
        "text": "Click on the map to add text",
        "arrow": "Click on the map to add an arrow"
      }
    }
  },

  "legend": {
    "editTitleHere": "Legendenüberschrift bearbeiten"
  },

  "toolbar": {
    "blindness": {
      "menu.title": "Farbblindheitssimulation",
      "type": {
        "protanopia": "Protanopia (Rot-Grün)",
        "protanomaly": "Protanomaly (Rot-Grün)",
        "deuteranopia": "Deuteranopia (Rot-Grün)",
        "deuteranomaly": "Deuteranomaly (Rot-Grün)",
        "tritanopia": "Tritanopia (Blau-Gelb)",
        "tritanomaly": "Tritanomaly (Blau-Gelb)",
        "achromatopsia": "Achromatopsia",
        "achromatomaly": "Achromatomaly"
      }
    },
    "tooltip": {
      "center": "Center the map",
      "zoomin": "Zoom in",
      "zoomout": "Zoom out",
      "info": "Information on a map object",
      "blindness": "Color blindness simulation",
      "drawText": "Add a text",
      "drawArrow": "Add an arrow"
    }
  },

  "basemap": {
    "world": "Welt > Länder (2016)",
    "german states 2016": "Deutschland > Länder (2016)",
    "german districts 2016": "Deutschland > Landkreise (2016)",
    "brazil ufe 2015": "Brasilien > Bundesländer (2015)",
    "brazil mee 2015": "Brasilien > Mesoregions (2015)",
    "brazil mie 2015": "Brasilien > Microregions (2015)",
    "canada prov 2016": "Kanada > provinzen (2016)",
    "canada cd 2016": "Canada > census division (2016)",
    "eu country 2013": "Europa > Staaten (2016)",
    "eu nuts-2 2013": "Europa > Regionen (NUTS-2, 2013)",
    "eu nuts-3 2013": "Europa > Gemeinden (NUTS-3, 2013)",
    "france dept": "Frankreich > Departments (2016)",
    "spain prov 2015": "Spanien > Provinzen (2015)",
    "spain auto 2015": "Spanien > Gemeinden (2015)",
    "us state 2015": "USA > Staaten (2015)",
    "france reg 2015": "Frankreich > Regionen (2015)",
    "france reg 2016": "Frankreich > Regionen (2016)",
    "france circ 2017": "France > Wahlkreis (2012 & 2017)",
    "FR-11 com 2016": "France > gemeinde (2016) > Île-de-France",
    "FR-24 com 2016": "France > gemeinde (2016) > Centre-Val de Loire",
    "FR-27 com 2016": "France > gemeinde (2016) > Bourgogne-Franche-Comté",
    "FR-28 com 2016": "France > gemeinde (2016) > Normandie",
    "FR-32 com 2016": "France > gemeinde (2016) > Hauts-de-France",
    "FR-44 com 2016": "France > gemeinde (2016) > Grand Est",
    "FR-52 com 2016": "France > gemeinde (2016) > Pays de la Loire",
    "FR-53 com 2016": "France > gemeinde (2016) > Bretagne",
    "FR-75 com 2016": "France > gemeinde (2016) > Nouvelle-Aquitaine",
    "FR-76 com 2016": "France > gemeinde (2016) > Occitanie",
    "FR-84 com 2016": "France > gemeinde (2016) > Auvergne-Rhône-Alpes",
    "FR-93 com 2016": "France > gemeinde (2016) > Provence-Alpes-Côte d’Azur",
    "FR-94 com 2016": "France > gemeinde (2016) > Corse",
    "FRA10 com 2016": "France > gemeinde (2016) > Guadeloupe",
    "FRA20 com 2016": "France > gemeinde (2016) > Martinique",
    "FRA30 com 2016": "France > gemeinde (2016) > Guyane",
    "FRA40 com 2016": "France > gemeinde (2016) > La Réunion",
    "FRA50 com 2016": "France > gemeinde (2016) > Mayotte",
    "FR-11 com 2017": "France > gemeinde (2017) > Île-de-France",
    "FR-24 com 2017": "France > gemeinde (2017) > Centre-Val de Loire",
    "FR-27 com 2017": "France > gemeinde (2017) > Bourgogne-Franche-Comté",
    "FR-28 com 2017": "France > gemeinde (2017) > Normandie",
    "FR-32 com 2017": "France > gemeinde (2017) > Hauts-de-France",
    "FR-44 com 2017": "France > gemeinde (2017) > Grand Est",
    "FR-52 com 2017": "France > gemeinde (2017) > Pays de la Loire",
    "FR-53 com 2017": "France > gemeinde (2017) > Bretagne",
    "FR-75 com 2017": "France > gemeinde (2017) > Nouvelle-Aquitaine",
    "FR-76 com 2017": "France > gemeinde (2017) > Occitanie",
    "FR-84 com 2017": "France > gemeinde (2017) > Auvergne-Rhône-Alpes",
    "FR-93 com 2017": "France > gemeinde (2017) > Provence-Alpes-Côte d’Azur",
    "FR-94 com 2017": "France > gemeinde (2017) > Corse",
    "FRA10 com 2017": "France > gemeinde (2017) > Guadeloupe",
    "FRA20 com 2017": "France > gemeinde (2017) > Martinique",
    "FRA30 com 2017": "France > gemeinde (2017) > Guyane",
    "FRA40 com 2017": "France > gemeinde (2017) > La Réunion",
    "FRA50 com 2017": "France > gemeinde (2017) > Mayotte"
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
    "de_district_inhabitants": "Einwohnerzahlen (31.12 2015)",
    "de_states_inhabitants_06_15": "Einwohnerzahlen (2006 - 2015)",
    "us_state-pop": "Bevölkerungstatistik (2010-2015)",
    "eu_country-energie": "Anteil erneuerbarer Energien am Brutto-Endenergieverbrauch (2005-2014)",
    "eu_country-ecommerce": "Internet-Einkäufe von Einzelpersonen innerhalb von 12 Monaten (2004-2016)",
    "eu_nuts2-travail": "Durchschnittliche Arbeitsstunden pro Woche (2015)",
    "eu_nuts2-agriculture": "Landwirtschaftliche Fläche nach Größe der landwirtschaftlichen Betriebe (2013)",
    "eu_nuts3-pop": "Bevölkerungsdichte (2015)",
    "ca-prov-life-2015": "Life expectancy (2013-2015)",
    "ca-cd-pop-2017": "Population (2011-2017)"
  },

  "importMap": {
    "title": "Import your own map",
    "success": "Files have been successfuly processed. Do you want to import ?",
    "selectLayer": "Select layers to import",
    "nonUniqueKey": "Warning : different objects will share the same id",
    "tooBig": "Basemap file seems very large! This could slow down Khartis.",
    "askSimplify": "Do you want to simplify the polygon layout automatically?",
    "askKeepVars": {
      "title": "Keep the other variables ?",
      "true": "yes (to visualize them later)",
      "false": "no (only the ID will be kept)"
    },
    "withId": "with identifier",
    "error": {
      "title": "error",
      "noFile": "No valid file found",
      "unknow": "Unable to process selected files",
      "unknownProjection": "Unknow projection",
      "layersOnError": "Some layers have errors"
    }
  }

};
