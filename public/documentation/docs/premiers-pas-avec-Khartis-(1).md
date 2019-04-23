Nous allons réaliser cette carte du monde des émissions de CO2 en 2013.
![résultat tutoriel](./assets/export_tuto-CO2.png)

## Récupérer les données

Nous avons téléchargé les données au format csv depuis le site de la [Banque mondiale](http://databank.worldbank.org/data/reports.aspx?source=2&series=EN.ATM.CO2E.KT&country=) et vous pouvez [les récupérer directement ici](./assets/CO2-emissions-2013-world-bank.csv) (clic droit 'enregistrer le lien sous').

### Que contiennent les données ?

* Deux indicateurs :

   * les émissions de CO2 (en milliers de tonnes)

   * les émissions de CO2 (en tonnes par habitant)

* à différentes dates : 1960, 1970, 1980, 1990, 2000, 2005, et de 2010 à 2013

## Choisir le fond de carte

Les données sont à l’échelle des pays du monde alors nous choisissons ‘Monde > pays (2016)’
![choix du fond de carte](./assets/02_01-select-basemap.gif)

Une fois sélectionné, une vignette du fond de carte s’affiche accompagné d’un aperçu du [dictionnaire](../definitions#dictionnaire-dun-fond-de-carte)

## Importer les données

Dans Khartis il existe trois manières de charger des données :

* copier-coller les données directement depuis un logiciel de tableur ouvert

* cliquer sur ‘Importer’ et sélectionner le [fichier csv](../definitions#fichier-csv) là où il est situé sur votre ordinateur

* glisser le fichier csv depuis son dossier directement dans le cadre

Pour cette fois nous utiliserons la troisième option. Cliquer ensuite sur ‘suivant’

![import des données](./assets/02_02-drop-data.gif)


## Géoréférencer les données

Il faut maintenant s’assurer que nos données ont bien été reconnues, particulièrement la colonne du tableau qui fait le lien avec le fond de carte. Nous l’appelons ‘colonne de référence géographique’.

Khartis reconnaît et identifie automatiquement les colonnes susceptibles de faire ce lien. Dans le cas présent la colonne "Country Name". Nous pouvons au besoin corriger les cellules de la colonne qui n’auraient pas été reconnues, dans ce cas, le nombre d'erreur s'affiche en rouge et il nous est possible de les corriger en cliquant sur le bouton, hors ici, tous les pays ont étés automatiquement reconnus.

 ![georef](./assets/02_03-georef.png)


Passons à l’étape suivante

![étape 2](./assets/step-2.gif)

## Visualiser les données

Nous voulons représenter les émissions de CO2 par pays en 2013 à l’aide de symboles proportionnels aux valeurs (des points plus ou moins gros selon que les émissions sont plus ou moins fortes).

Cliquez sur ‘Ajouter une visualisation’ puis sélectionnez le type de visualisation le plus approprié, à savoir les symboles proportionnels.

![choix visualisation](./assets/02_04-choose-viz.gif)

Sélectionner ensuite la variable à représenter "2013 - CO2 emissions (kt)".

![choix visualisation](./assets/02_04-choose-variable.gif)

Maintenant des cercles proportionnels aux émissions de CO2 sont placés dans tous les pays et un volet de réglage de la visualisation est ouvert.

Nous allons améliorer la lisibilité de la carte en renforçant la taille des symboles : par exemple passer de 10 à 40 et nous ajoutons un léger contour aux points. On aperçoit alors les plus petits cercles et les zones denses en cercles restent lisibles.

![taille 40](./assets/symbol-settings.png)

Passons à la dernière étape

![étape 3](./assets/step-3.gif)

## Export

### Habillage

Cette nouvelle étape tout aussi fondamentale que la précédente permet d’ajouter tous les éléments textuels nécessaires à la bonne compréhension de la carte. Notamment un titre, une source, un entête de légende, et un crédit.

Voici une proposition qui répond à une série de questions que l’on peut se poser devant une carte :

* Quel est le sujet de la carte ?

    * Titre : Émissions de CO2, 2013

* D’où proviennent les données ?

    * Source : Banque mondiale, d’après le Carbon Dioxide Information Analysis Center, [http://data.worldbank.org](http://data.worldbank.org)

* Quelle est l’unité des données ?

    * l’entête de légende est modifiable en cliquant dessus   
![titre légende](./assets/legend-edit-title.gif)

* Qui à fait cette carte et peut-on la réutiliser ?

    * le crédit renseigne sur l’auteur de la carte et sur ce qui est possible de faire avec celle-ci en appliquant par exemple [une licence creative commons](https://creativecommons.org/choose/)

### Mise en page

Maintenant que nous sommes assurés que la carte contient les éléments essentiels à sa bonne lecture, nous pouvons améliorer rapidement la mise en page.

Nous allons ici utiliser trois moyens à notre disposition :

* les dimensions du document sont matérialisées en blanc et se distinguent du fond gris. Ce sont la largeur et la hauteur en pixels modifiables depuis le panneau de réglage à gauche.   
![dimensions](./assets/export-dimensions.png)

* les marges de la carte matérialisées par un tireté bleu

* le placement de la légende qui peut être déplacée par cliquer-glisser

On peut par exemple réduire la hauteur du document à 700px car le fond de carte est davantage rectangulaire que carré. Puis ensuite équilibrer les marges et  déplacer la légende.

![mise en page](./assets/export-layout-steps.gif)

### Format d’export

Khartis propose trois formats d’export :

* [png](https://fr.wikipedia.org/wiki/Portable_Network_Graphics) : format image, à différentes réolutions. Adapté si on ne souhaite pas retoucher la carte.

* [svg](../definitions#fichier-svg) : format vectoriel. Adapté si on souhaite continuer à travailler la carte dans un logiciel de dessin.

* svg (pour Illustrator) : meilleure compatibilité avec le logiciel Adobe Illustrator

![type téléchargement](./assets/export-download.gif)

![résultat tutoriel](./assets/export_tuto-CO2.png)
