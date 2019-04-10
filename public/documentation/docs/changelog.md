## v2.3 (01/04/2019)
### Basemaps
-   add Morocco at two levels: regions and provinces (2015)
-   add United-Kingdom at two levels: NUTS-1 and NUTS-3 (2018)
-   add Algeria wilayas (2008)
-   add China provinces (2018)
-   add New-Caledonia municipalities (2017)
-   add Grand Paris at two levels: municipalities and iris
-   update Europe at two levels: NUTS-2 and NUTS-3 (2016)

### Import basemap
New functionality to import your own basemap in three possible formats: shapefile, geojson or topojson.

### Export
More customization for world basemap at export step: equator, sphere, seas, background 

## v2.2 (13/11/2018)
-   Redesign of visualizations panel: new classification more clear and readable
-   3 new viz than combine two variables
-   Documentation is now directly accessible in Khartis
-   Map title and labels can be styled: font, size, bold, italic, underline, align, color
-   Labels can now be moved and connectors appears automatically.
-   New projection available: Armadillo by Erwin Raisz and Airocean by Buckminster Fuller
-   Fix Jenks discretization thresholds
-   Dependancies: upgrade to ember 3.1

## v2.1 (09/03/2018)
-   new tools to add text and arrow above the map. Bonus: objects are georeferenced with the map
-   many improvement of the legend for more liberty: horizontal or vertical presentation, dissociate legends, round values
-   new download button always visible in export step
-   more option when exporting as image (.png) -> normal size, double (@2x) and triple (@3x)
-   new basemaps: Canada by provinces or census division in 2016
-   add tooltip to all button of the floating map menu
-   add automatic suggestion when editing a column in the data step
-   fix bug when data with empty cell in ID column
-   fix bug when no data value have special character (“..”, “-”)

## v2.0 (16/11/2017)
-   **global redesign** for a better experience and ergonomy
-   **new projection available : Bertin 1953**. Thanks to Philippe Rivière (@Fil). More information on [Visionscarto.net](https://visionscarto.net/bertin-projection-1953)
-   **new viz “categories > ordered symbols”**: to show a hierarchy on points (capitals of state, chief towns of regions, communes ... or a ranking in a typology). This viz is based on Jacques Bertin’s work.
-   **new viz “categories > ordered surface”**: to show a hierarchy (ranking) on surface. Reverse order of ranking is possible.
-   **new discretization available “manual thresholds”**: if you’re not satisfied with automatic discretization make your own one.
-   new option to check your data on the fly: a **tooltip** is available on the map
-   **auto-update** on offline app: don’t miss new version
-   **improve rendering of pattern** with a new scale option
-   **more projects saved in the browser** and we add a new way to reopen your project saved locally: by dragging and dropping it.
-   **filter basemap list** to quickly find the one you need
-   a lot of improvement in reactivity and performance : in the data step and with the zoom
-   bug fix: SVG export now support opacity

## v1.3 (26/07/2017)
-   add France at municipality level split by 18 regions in 2016 and 2017

## v1.2 (21/07/2017)
### Basemaps
-   add Europe at three levels: country, NUTS-2 and NUTS-3 + examples data
-   add France electoral district for 2012 and 2017 with presidential data
-   add Germany at two levels: *Lander* and *Lankreise* + examples data. Thanks to @mukil ! (#9)
-   all basemaps now have a copyright cited according to sources and visible in UI
-   support of two optional layers: a second line geometry draw at the top and a second polygon geometry draw at the bottom (see Europe basemap for example)

### Viz and UI
-   add german translation thnaks to @mukil ! (#9)
-   add a daltonism simulation via SVG filters from [colourblind](https://github.com/Altreus/colourblind)
-   add bar symbol in addition to circle and rectangle
-   improve legend of all visualizations
-   add two discretizations: standard deviation and Jenks based on [geostats](https://github.com/simogeo/geostats) and [simple-statistics](https://github.com/simple-statistics/simple-statistics) plus some otpimization

### Dependancies
-   update to d3v4
-   update to ember 2.13
-   add electron to build **offline version of Khartis for Windows, macOS and Linux**

### Fix
-   and a lot of fix not listed

## v1.0 (3/11/2016)
-   add brazil basemaps:
   -   3 levels: States, mesoregions and microregions
   -   add one example at States level
   -   fix brazil dictionary: ID as text
-   fix year on world basemap
