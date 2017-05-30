
## Official documentation on adding new basemaps now available

Please consult the [How to create a basemap page in the wiki](https://github.com/AtelierCartographie/Khartis/wiki/How-to-create-a-basemap-for-Khartis) to find support and details on the integration of new basemaps into Khartis.

The rest of this file is merely for information purposes regarding the various data assets used in compiling the two german basemaps.

## Preparing open geodata for use in Khartis

It seems like using [mapshaper.org](https://mapshaper.org) is the most simple way to prepare and integrate the three geometries making up a basemap in Khartis.

The transformation process i initially used is a bit different and could be roughly outlined with:

+  Shapefile > GeoJSON (e.g. via QGIS _Vector Layer_ specific features)<br/>
   (Vector > Geometry Tools > Centroid layer (Polygonschwerpunkte))
+  Creating a GeoJSON 'Centroid' Layer (using QGIS _Vector_ specific geometry tools and layer export)
+  Creating a GeoJSON 'Border' Layer (again using QGIS _Vector_ specific geometry tools and layer export)
+  GeoJSON > TopoJSON (e.g. `npm install -g topojson-server` & running `geo2topo `)
+  TopoJSON Optimizations (see Mike Bostock's [Command Line Cartography 3](https://medium.com/@mbostock/command-line-cartography-part-3-1158e4c55a1e#.2o7ol97d9))

### Khartis Basemap Requirements

It is recommended to use the tool [mapshaper.org](https://mapshaper.org) to combine a _border_, a _centroid_ and the _poly_ layers into one TopoJSON file. To convert the GeoJSON `geometries` i got from QGis to TopoJSON i used the `geo2topo` tool. But please note, this can all be done through only using mapshaper.org.

`geo2topo -q 1e4 vg2500.utm32s.shape/vg2500/vg2500-lan_geojson.geojson > bkg-vg2500-lan-utm32s-1e4-poly.json`

To create thee dedicated _centroid_ and _border_ layers i also [used QGIS](http://gis.stackexchange.com/questions/45243/how-to-determine-the-centroid-of-polygons) and inserting the resulting topojson manually as a new layer in the original file using a Sublime Text Editor.

To link up data values with the respective polygons in the basemap geometry you must make sure that your final `.json` document contains identifiers (or keys) for the region it represents.

### Khartis Basemap Dictionary

To allow users displaying labels for each region in the map you must provide an international set of names for each of the regional identifiers contained in your basemap. At Khartis this is called the _dictionary_ of a basemap.

+  Write JSON Dictionary containing all keys and a set of international places names (manually)
+  Write CSV-File of Dictionary allowing users to "Download the Model" (manually)

I added two types of data both geometries representing administrative regions (in their boundaries).

(A) is the level of 16 federal states ("Länder"), (B) is the more detailed level of departments ("Kreise").

(A) was easily assembled manully through combining various sources (some of the following and Wikipeida).

The dictionary (B) however is much more detailed and based on the following sources: [Eurostat NUTS 2013, Metadata Download, RAMON](http://ec.europa.eu/eurostat/ramon/nomenclatures/index.cfm?TargetUrl=LST_CLS_DLD&StrNom=NUTS_2013L&StrLanguageCode=EN&StrLayoutCode=HIERARCHIC#), via [NUTS on destatis.de](https://www.destatis.de/Europa/DE/MethodenMetadaten/Klassifikationen/UebersichtKlassifikationen_NUTS.html), [Gemeindeverzeichnis on destatis.de](https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Gemeindeverzeichnis.html) and [ZENSUS 2011 on destatis.de](https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Administrativ/Aktuell/04Kreise.html)

A special map of PLZ could be integrated after integrating the PLZ values from [Eurostat NUTS-3 <-> PLZ DE](http://ec.europa.eu/eurostat/tercet/flatfiles.do).

Another list of NUTS codes to german region names is contained in this [PDF document](http://www.esf.de/portal/SharedDocs/PDFs/DE/Sonstiges/nuts-klassifikation.pdf?__blob=publicationFile&v=4) published by the ESF.

#### (A) Ländergrenzen ("bkg-vg2500-lan-utm32s-1e4.json") Geometrie (States in Germany)

`properties: {"ADE":2,"RS":"03","RS_0":"030000000000","GEN":"Niedersachsen"}`

The key `RS` stands for Regionalschlüssel, meaning "Region Key".
The key `GEN_DE` stands for german "Geographical Name" for the region

#### (B) Kreisgrenzen ("bkg-vg2500-krs-utm32s-1e4.json") Geometrie (States in Germany)

`properties: {"ADE":4,"RS":"01002","RS_0":"010020000000","GEN":"Kiel"}`

Again, the key `RS` stands for Regionalschlüssel, meaning "Region Key".
The key `GEN_DE` stands for german "Geographical Name" for the region

## License: Usage rights

### Länder (Federal States of Germany, Level: NUTS 1, Overall Count: 16)

Quelle der Ausgangsdatei für "vg2500-BKG-NUTS1-2016-combined.json" ist die Seite des Bundesamts für Kartographie und Geodäsie unter ([http://www.geodatenzentrum.de/geodaten/](http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=5&gdz_anz_zeile=1&gdz_unt_zeile=19&gdz_user_id=0)).

### Kreise (Districts of Germany, Level: NUTS 3, Overall Count: 402)

Quelle der Ausgangsdatei für "vg2500-BKG-NUTS3-2016-combined.json" ist die Seite des Bundesamts für Kartographie und Geodäsie unter ([http://www.geodatenzentrum.de/geodaten/](http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=5&gdz_anz_zeile=1&gdz_unt_zeile=19&gdz_user_id=0)).

The geodata is published as open data by the BKG but in each map using it must be properly attributed.
If desiging a map based on this geometry the final product must note that it uses the geometry published by like **© GeoBasis-DE / BKG 2016**.

Wherever possible (e.g. the SVG is published as interactive web document and is not printed) the word _GeoBasis-DE_ should point users to [http://www.geodatenzentrum.de/geodaten/](http://www.geodatenzentrum.de/geodaten/).

What follows is a quote from the original publication documentation explaining exactly this (but in German).

<code>
3. Nutzungsbestimmungen und Quellennachweis

Dieser Datenbestand steht über Geodatendienste gemäß Geodatenzugangsgesetz für die kommerzielle und nicht kommerzielle Nutzung geldleistungsfrei zum Download und zur Online-Nutzung zur Verfügung. Die Nutzung der Geodaten und Geodatendienste wird durch die Verordnung zur Festlegung der Nutzungsbestimmungen für die Bereitstellung von Geodaten des Bundes (GeoNutzV) vom 19. März 2013 (Bundesgesetzblatt Jahrgang 2013 Teil I Nr. 14) geregelt.

Insbesondere hat jeder Nutzer den Quellenvermerk zu allen Geodaten, Metadaten und Geodatendiensten erkennbar und in optischem Zusammenhang zu platzieren. Veränderungen, Bearbeitungen, neue Gestaltungen oder sonstige Abwandlungen sind mit einem Veränderungshinweis im Quellenvermerk zu versehen.

Quellenvermerk und Veränderungshinweis sind wie folgt zu gestalten. Bei der Darstellung auf einer Webseite ist der Quellenvermerk mit der URL "[http://www.bkg.bund.de](http://www.bkg.bund.de)" zu verlinken.

© GeoBasis-DE / BKG <Jahr des letzten Datenbezugs>
© GeoBasis-DE / BKG <Jahr des letzten Datenbezugs> (Daten verändert)
</code>
