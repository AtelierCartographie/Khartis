At the end, in order to work properly in Khartis, a basemap involve three type of files: a topojson for geometry, a json for dictionary and a js for config (parameters and projection).

## Tools suggested
[Mapshaper](http://mapshaper.org/), [TopoJSON cli: geo2topo](https://github.com/topojson/topojson-server/blob/master/README.md#geo2topo), [QGIS](http://www.qgis.org/fr/site/)

## Geometry
All the geometry needed are combine in one topojson. We call it layers and five types can be recognize, three are essentials (`centroid`, `line` and `poly`), two are optionals (`line-up` and `poly-down`).

| Layer name | Required | Geometry type | Properties ? | Properties name        | remarks                           |
|------------|----------|---------------|--------------|------------------------|-----------------------------------|
| centroid   | yes      | point         | yes          | ID                     | standard identifier               |
| line-up    | no       | line          | possible     | featurecla: "Disputed" | = dash line for disputed borders  |
| line       | yes      | line          | posible      | featurecla: "Disputed" | = dash line for disputed borders  |
| poly       | yes      | polygon       | yes          | ID                     | standard identifier               |
| poly-down  | no       | polygon       | no           |                        |                                   |

### poly
This is the core layer of basemap, the other layers required can be derived from it. Each polygon as an ID who is a standard identifier (from National Geographic Institution or ISO code). Key idea is to have a result as light as possible: only keep essential properties and simplify geometry.

Steps and transformation process in mapshaper:

+   Check if you have all your polygon with properties (with QGIS or mapshaper) and if the projection is `WGS84`. Because reprojection are done on the fly in Khartis, all basemaps need to be in `WGS84`.
+   Rename the main identifier as `ID`. With online console: `rename-fields ID=OLD-ID-NAME`
+   Keep only the `ID` property. `filter-fields ID`
+   Rename layer to `poly`. `rename-layers poly`
+   If needed, simplify geometry with one of the three method available. Be Careful of smalls polygons with a unique ID who can disappear. The idea is to keep the general aspect of each polygon while reducing a lot the points.
+   Export layer in geojson with mapshaper.

### centroid
+   Import in mapshaper your `poly` layer in geojson format.
+   Create `centroid` layer with command-line: `points centroid`. Don't worry with properties, they are keep from polygons to points. Be Careful, automatic calculation of centroid is not always the best positioning (e.g. point outside polygon). If so, export layer and edit it in QGIS to fix position.
+   Rename layer to `centroid`. `rename-layers centroid`
+   Export layer in geojson with mapshaper.

### line
+   Import again in mapshaper your `poly` layer in geojson format.
+   Create shared boundaries between polygons. `innerlines`
+   Rename layer to `line`. `rename-layers line`
+   Export layer in geojson with mapshaper.
+   (If you need dash lines (e.g. disputed border), you will need an extra step in QGIS to create a new field in attribute data name `featurecla` and add value `Disputed` when it will be dashed.)

### geojson to topojson
Now that you have the three layers required in geojson format, you have to combine them in a unique topojson file that will reduce size of file.

In older version of topojson:   
`topojson -o [basemap-name].json -p -- centroid.json line.json poly.json`

In the new topojson:   
`geo2topo -q 1e4 centroid.json line-up.json line.json poly-down.json poly.json > [basemap-name].json`

### composite projection ?
If you need a [composite projection](https://bl.ocks.org/mbostock/5545680) to bring closer polygons geographically distant, each part have to be in a separate topojson file, e.g. Alaska, Hawaii, Puerto-Rico, main USA part.

## dictionary
Most of the time there is alternative name or code of an official administrative area. Khartis takes account of these possibilities to ensure a more transparent user experience. For a complete explanation of what a basemap dicionary is, see [dictionnaire d'un fond de carte](definitions#dictionnaire-dun-fond-de-carte) (*in french*).

Dictionary specification is simple. It's a json file, each object refer to a polygon and the first key is the standard identifier use in the geometry. All other key are optional and are here to better match user data.

Example of France by department dictionary:

    [
	    {
		    "ID": "FR101",
		    "Insee": "75",
		    "ISO 3166-2": "FR-75",
		    "Name": "Paris"
	    },
	    {
		    "ID": "FR102",
		    "Insee": "77",
		    "ISO 3166-2": "FR-77",
		    "Name": "Seine-et-Marne"
	    },
            ...
    ]
## config file (settings and projection)
The last step is to complete the config file with settings of the new basemap. Which are: `id` an id basemap for translation, `sources` file directory of the topojson + d3 (v4) projection settings, `dictionary` file directory of the json, `examples` (optional) sample data for users.

Example of Brazil states basemap config:

    {
        id: "brazil ufe 2015",
        sources: [
          {source: "BR-ufe-2015.json", projection: "d3.geoPolyconic()", transforms:{rotate: [54, 0]}, scale: 1, zoning: [[0, 0], [1, 1]]}
        ],
        dictionary: {
          source: "BR-dico-UFE-2015.json",
          identifier: "ID"
        },
        examples: [
          {
            id: "br_ufe-pop",
            source: "br-ufe-pop-2010.csv"
          },
        ]
      }
