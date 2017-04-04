Khartis propose une série de fonds de carte à différentes échelles. Ils sont listés dans le tableau ci-dessous et téléchargeable au format topojson. Le [dictionnaire](definitions#dictionnaire-dun-fond-de-carte) qui fait le lien avec le fonds de carte est lui aussi accessible et permet de vérifier les noms ou codes qui sont automatiquement reconnus par Khartis.

| Échelle    | Niveaux      | date | lien fond | lien dictionnaire |
|:------------|:--------------|:------|:-----------|:-------------------|
| Monde      | pays         | 2016 | [topojson](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/map/W-110m-2015-modified.json)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/World-dico-2016.csv)               |
| Europe     | pays        | 2013 | [topojson](https://github.com/AtelierCartographie/Khartis/raw/master/public/data/map/EU-country.json)  | [csv](https://github.com/AtelierCartographie/Khartis/raw/master/public/data/dictionary/csv/EU-dico-COUNTRY-2013.csv)               |
| Europe     | NUTS-2 | 2013 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/EU-nuts-2)  | [csv](https://github.com/AtelierCartographie/Khartis/raw/master/public/data/dictionary/csv/EU-dico-NUTS-2-2013.csv)               |
| Europe     | NUTS-3  | 2013 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/EU-nuts-3)  | [csv](https://github.com/AtelierCartographie/Khartis/raw/master/public/data/dictionary/csv/EU-dico-NUTS-3-2013.csv)               |
| Brésil     | États        | 2015 | [topojson](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/map/BR-ufe-2015.json)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/BR-dico-UFE-2015.csv)               |
| Brésil     | microrégions | 2015 | [topojson](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/map/BR-mie-2015.json)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/BR-dico-MIE-2015.csv)               |
| Brésil     | mésorégions  | 2015 | [topojson](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/map/BR-mee-2015.json)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/BR-dico-MEE-2015.csv)               |
| France     | département  | 2016 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/FR-dpt-2016)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/FR-dico-DPT-2016.csv)               |
| France     | régions      | 2015 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/FR-reg-2015)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/FR-dico-REG-2015.csv)               |
| France     | régions      | 2016 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/FR-reg-2016)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/FR-dico-REG-2016.csv)               |
| Espagne    | provinces    | 2015 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/ES-prov-2015)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/ES-dico-PROV-2015.csv)               |
| Espagne    | communautés  | 2015 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/ES-auto-2015)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/ES-dico-AUTO-2015.csv)               |
| États-Unis | États        | 2015 | [topojson](https://github.com/AtelierCartographie/Khartis/tree/master/public/data/map/US-state-2015)  | [csv](https://raw.githubusercontent.com/AtelierCartographie/Khartis/master/public/data/dictionary/csv/US-dico-ST-2015.csv)               |
À l’avenir d’autres fonds de carte seront intégrés à Khartis et vous pouvez aussi [nous faire des suggestions](https://goo.gl/forms/dF1y6k9KvEIffzpQ2).

## Sources

### Monde

* La base du fond de carte provient de [Natural Earth à l’échelle 110m](http://www.naturalearthdata.com/downloads/110m-cultural-vectors/). Deux modifications ont ensuite été apportées :

    * révision des frontières selon [une carte](http://www.un.org/Depts/Cartographic/map/profile/world.pdf) de la section *Geospatial Information* des Nations Unies

    * ajouts de polygones carrés afin de compléter les petits États et territoires qui n’étaient pas représentés (notamment aux Caraïbes et dans le Pacifique).
![petits États](/assest/small-states.png)

* Le dictionnaire est principalement une extraction de Natural Earth avec des compléments provenant de différentes sources (dans le but d’optimiser la reconnaissance automatique à l’import de données par l’utilisateur) :

    * [les codes ISO 3166](http://www.iso.org/iso/home/standards/country_codes.htm)

    * [la liste des membres des Nations Unies](http://www.un.org/en/member-states/) en plusieurs langues (anglais, arabe, chinois, espagnol, français, russe)

    * [la liste de la Banque mondiale](http://www.worldbank.org/en/country)

### Europe

* Fonds de carte et dictionnaires : [Eurostat - GISCO](http://ec.europa.eu/eurostat/fr/web/gisco) 

### Brésil

* Fonds de carte et dictionnaires : [serveur FTP de l’Instituto Brasileiro de Geografia e Estatística (IBGE)](ftp://geoftp.ibge.gov.br/) 

### France

* Fonds de carte : Open Street Map depuis data.gouv.fr

    * [Département 2016](https://www.data.gouv.fr/fr/datasets/contours-des-departements-francais-issus-d-openstreetmap/) 

    * [Régions 2016](https://www.data.gouv.fr/fr/datasets/projet-de-redecoupages-des-regions/)

    * [Régions 2014](https://www.data.gouv.fr/fr/datasets/contours-des-regions-francaises-sur-openstreetmap/)

* Dictionnaire : [Wikipédia - Codes géographiques de la France](https://fr.wikipedia.org/wiki/Codes_g%C3%A9ographiques_de_la_France)

### Espagne

* Fonds de carte : [Centro National de Informacion Geografica](http://www.ign.es/ign/main/index.do)

* Dictionnaire : 

    * Code CNIG + nom officiel : [Instituto Nacional de Estadística (INE)](http://www.ine.es/daco/daco42/codmun/cod_provincia.htm)

    * code Eurostat NUTS : [Wikipédia](https://es.wikipedia.org/wiki/NUTS_de_Espa%C3%B1a)

    * code ISO 3166-2 : [Wikipédia](https://es.wikipedia.org/wiki/ISO_3166-2:ES)

### États-Unis

* Fond de carte et dictionnaire : [2015 Cartographic Boundary File, 1:20,000,000](https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html)

* Dictionnaire (complément) : [ISO 3166-2](https://www.iso.org/obp/ui/#iso:code:3166:US)