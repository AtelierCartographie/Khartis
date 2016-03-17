Package 1
=========

A - Jeux de fichiers cvs, tsv (test d’import dans l’outil)
--------------------------------------------------------------

Jeux de données disponibles à la fois en UTF-8 et en ISO Latin 1

### 00_SCPO_double-diplomes_2015_LAT_LONG 
*Source : Sciences Po, DES*

>Objectifs avec ce jeu de données :
   - tester l'import de données affectées à des couples de coordonnées.
   - tester l'import de données qualitatives (des x pour présence d'étudiants en double-diplôme dans les universités partenaires)

A discuter : 
   - la latitude et la longitude devront être en [degrés décimaux](http://www.coordonnees-gps.fr) et non sexagésimaux (minutes, secondes). Nous devrons expliquer à l'utilisateur comment structurer le couple de coordonnées pour que l'outil fonctionne. Sans quoi, on devra développer un super algorithme pour envisager les coordonnées en degrés, minutes et secondes (avec des écritures non standardisées, des espaces, des ° +/- bien notés...)
   - la latitude et la longitude seront bien dans 2 colonnes distinctes. Sans quoi, impossible de savoir si saisie représente X-Y ou Y-X, même si Y ne peut pas dépasser +/-90°.

### 01_WB_emissions_CO2 
*Source : [The World Bank Open Data](http://data.worldbank.org/indicator/EN.ATM.CO2E.PC)*

>Objectifs avec ce jeu de données :
   - tester l'import de données pas forcément bien structurées (1ère ligne avec en-têtes de colonnes, pas de lignes/colonnes vides au début...)
   - tester l'import de données quantitatives 

- avec structureOK quand le tableau commence bien à la cellule A1 
- avec structureNON-OK lorsque il ne commence pas par une ligne d'id de colonne (comme c'est souvent le cas lors d'exports depuis des bases). 

### 02_WB_surfaces_forets_Km2 
*Source : [The World Bank Open Data](http://data.worldbank.org/indicator/AG.LND.FRST.K2)*

>Objectifs avec ce jeu de données :
   - tester les séparateurs milliers (point, virgule, espace) et décimaux (point, virgule)
   - tester l'import de données quantitatives 

- dans _IDGEO les id en arabe, chinois, français, anglais et espagnol + l'information donnée avec séparateur décimal virgule et point. Et autant de déclinaisons qu'on a de façon d'écrire les nombres (EN, FR, ES avec des séparateurs de milliers ou décimaux variables)
   
**/!\ Attention ! La Banque mondiale fait des agrégats (ex FCS pour "fragile and conflict-affected situations").**
   
### 03_UN_DESA_motifs_autorisation_avorter_2003-2013
*Source : [United Nations, World Population Policies Database.](http://esa.un.org/poppolicy/about_database.aspx)*

>Objectifs avec ce jeu de données :
   - tester l'import de données qualitatives (catégories/classes -> cf Interface de couplage des variables visuelles).


B - Dictionnaire multilingue
----------------------------
>Objectifs : faire le lien entre les objets géolocalisés et les fonds de carte

Liste des variables

    iso_a2, iso_a3, iso_n3, name_EN, name_short_EN, name_sort_EN, abbrev, name_formal_EN, name_ISO_EN, name_ISO_FR, name_Undata, name_WB, name_UN_EN, name_UN_FR, name_UN_ES, name_UN_RU, name_UN_CN, name_UN_AR, sovereignt, sov_a3
    
ISO_a2 est la variable pivot entre le dictionnaire et le fond de carte.

Sources : [Natural Earth](http://www.naturalearthdata.com/), [ISO 3166 - Country Codes](http://www.iso.org/iso/home/standards/country_codes.htm), [World Bank country classification table](http://data.worldbank.org/about/country-and-lending-groups), [United Nations, Population Division](http://www.un.org/en/development/desa/population/), [United Nations, members - 6 langues](http://www.un.org/fr/members/)

A discuter : 
   - si un autre format est plus adapté qu'un tableau csv
   - si la redondance d'un même terme entre liste doit être éliminée = obtenir une série de terme unique associée à un État ou territoire.


C - Fonds de carte
------------------
>Format : [topojson](https://github.com/mbostock/topojson)   
Système de coordonnées (crs) : WGS 84 (EPSG:4326)

Chaque fichier de fond de carte contient trois types de géométrie : des polygones, des points, des lignes qui sont nommés respectivement 'land', 'centroid' et 'border'.

    {"type":"Topology","objects":{"land":{"type":"GeometryCollection"
    ...
    "centroid":{"type":"GeometryCollection"
    ...
    "border":{"type":"GeometryCollection"
    
Sources : d'après [Natural Earth](http://www.naturalearthdata.com/) et [UN Geospatial Iinformation Section](http://www.un.org/Depts/Cartographic/english/htmain.htm)
    
### land
Contient les polygones de tous les États ou territoires contenu dans le dictionnaire.
Des données y sont associées : un identifiant (ISO_a2) et un nom (name).

    {"type":"Polygon","id":"AF","properties":{"name":"Afghanistan"},"arcs":[[0,1,2,3,4,5]]}

### centroid
Contient des points représentant chaque État ou territoire du dictionnaire.
Des données y sont associées : un identifiant (ISO_a2) et un nom (name).

    {"type":"Point","id":"AF","properties":{"name":"Afghanistan"},"coordinates":[6835,7058]}
    
### border
Contient des lignes qui représentent les frontières des États ou territoires.
Des données y sont associées : une catégorie (featurecla) et un nom (name). La catégorie contient deux valeurs, "International" ou "Disputed", permetant la distinction entre les frontières reconnues à trait plein et celle disputées en pointillées. Dans le deuxième cas un nom y est associé.

    {"type":"LineString","properties":{"featurecla":"International","name":null},"arcs":[687,688,689,690,691,692,693]}
    {"type":"LineString","properties":{"featurecla":"Disputed","name":"Cyprus"},"arcs":[962]}

D - Projections
---------------
>Objectifs : associer une projection par défaut à chaque fond de carte et pouvoir la changer d'après une liste

Source : [D3 Extended Geographic Projections](https://github.com/d3/d3-geo-projection/)

On peut définir comme projection par défaut la [Natural Earth](http://bl.ocks.org/mbostock/4479477) :

    var projection = d3.geo.naturalEarth()
    .scale(167)
    .translate([width / 2, height / 2])
    .precision(.1);

Le fichier 'Projection-list.csv' contient l'ensemble des projections à proposer. Chacune est définie par ses paramètres propres. La colonne 'Scale' indique à qu'elle échelle la projection est la plus pertinente (World ou Region).
Pour certaines projections des paramètres doivent être modifiables par l'utilisateur : le centrage (longitude seul oulongitude et latitude ; cf colonne 'center'), la rotation (valeurs précises données).
Les paramètres 'translate' et 'precision' ne sont pas notés dans le tableau car toujours identiques :

    .translate([width / 2, height / 2])
    .precision(.1)
