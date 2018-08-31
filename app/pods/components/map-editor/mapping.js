import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import PatternMaker from 'khartis/utils/pattern-maker';
import SymbolMaker from 'khartis/utils/symbol-maker';

export default Ember.Mixin.create({

  graphLayers: [],

  projectAndDraw() {
    this._super();
    this.drawLayers();
  },

  reorderLayers() {

    let layers = this.get('graphLayers');

    this.d3l().select("#layers")
      .selectAll(".layer, #borders")
      .sort((a,b) => {
          if (a.isBorderLayer && b.get('mapping.visualization.mainType') === "surface") {
            return 1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.mainType') === "surface") {
            return -1;
          } else if (a.isBorderLayer && b.get('mapping.visualization.mainType') === "symbol") {
            let idx = layers.indexOf(b);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.mainType') === "surface") ? 1 : -1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.mainType') === "symbol") {
            let idx = layers.indexOf(a);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.mainType') === "surface") ? -1 : 1;
          } else {
            return layers.indexOf(a) < layers.indexOf(b) ? 1 : -1;
          }
      });
  },

  displayableLayers: Ember.computed('graphLayers.[]', 'graphLayers.@each.displayable', function() {
    return this.get('graphLayers').filter( gl => gl.get('displayable') ).reverse();
  }),

  drawLayers: function() {
    
    let self = this,
        data = this.get('displayableLayers');

    let bindAttr = (_) => {
      _.attr("stroke-width", d => d.get("mapping.visualization.stroke"))
       .style("opacity", d => d.get('mapping.visualization.opacity'));
    };
    
    let sel = this.d3l().select("#layers")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();

    this.d3l().select("#layers").selectAll("g.layer").each(function(d, index) {
      self.mapData(d3.select(this), d);
    });
    
    this.drawLandSel();
    this.reorderLayers();
    
  }.observes('displayableLayers.[]', 'graphLayers.@each._defferedChangeIndicator'),
  
	mapData(d3Layer, graphLayer) {
    
    let mapping = graphLayer.get('mapping'),
        geoDef = mapping.get('geoDef'),
        geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
        data = [];

    if (geoDef.get('isGeoRef')) {

      let landsIdx = this.getFeaturesIndexFromBase(geoKey, "lands"),
          centroidsIdx = this.getFeaturesIndexFromBase(geoKey, "centroids");
          
      data = mapping.get('filteredRows').map( row => {
        
        let geoData = geoDef.get('geo.cells').objectAt(row.get('idx'))
          .get('postProcessedValue');

        if (geoData) {
          return {
            id: `${geoData.value[geoKey]}`,
            row,
            surface: landsIdx[`${geoData.value[geoKey]}`],
            point: centroidsIdx[`${geoData.value[geoKey]}`]
          };
        } else {
          return undefined;
        }
        
      }).filter( r => r != undefined );
      
      if (graphLayer.get('mapping.visualization.mainType') === "surface") {
        this.mapSurface(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.mainType') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.mainType') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    } else if (geoDef.get('isLatLon')) {

      data = mapping.get('filteredRows').map( (row, index) => {
        
        let lon = row.get('cells').find( c => c.get('column') == geoDef.get('lon') ).get('postProcessedValue'),
            lat = row.get('cells').find( c => c.get('column') == geoDef.get('lat') ).get('postProcessedValue');

        if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          let latLonPath = this.assumePathForLatLon([lat, lon]);
          if (latLonPath) {
            return {
              id: `coord-${index}`,
              row,
              point: {
                path: latLonPath,
                feature: {
                  geometry: {
                    type: "Point",
                    coordinates: [
                      lon,
                      lat
                    ]
                  }
                }
              }
            };
          }
        }
        
        return undefined;
        
      }).filter( d => d !== undefined );

      if (graphLayer.get('mapping.visualization.mainType') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.mainType') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    }
    
  },
  
  mapSurface: function(d3Layer, data, graphLayer) {
    
    let svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn();
		
    let bindAttr = (_) => {

      _.attrs({
          "xlink:href": d => this.registerLandSel(d.id),
          "fill": d => {
            let pattern = converter(d.row, "texture");
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, converter(d.row, "fill"));
              fn.init(svg);
              return `url(${fn.url()})`;
            } else {
              return converter(d.row, "fill");
            }
          }
        });
      
    };

    d3Layer.classed("surface", true);
    d3Layer.classed("symbol", false);
    d3Layer.selectAll("*:not(.surface)").remove();
    let sel = d3Layer.selectAll(".feature")
      .data(data)
      .call(bindAttr);
    
    sel.enter()
      .append("use")
      .classed("feature", true)
      .classed("surface", true)
      .call(bindAttr);

		sel.exit().remove();
			
	},
  
  mapSymbol: function(d3Layer, data, graphLayer) {

    const mapping = graphLayer.get('mapping'),
          converters = (v => v instanceof Array ? v : [v])(mapping.fn()),
          sortedData = data
            .map( d => ({
              maxSize: Math.max.apply(null, converters.map(c => c(d.row, "size"))),
              centroid: d.point.path.centroid(d.point.feature.geometry),
              data: d
            }))
            .filter( d => !isNaN(d.centroid[0]) && !isNaN(d.centroid[1]))
            .sort((a, b) => d3.descending(a.maxSize, b.maxSize));
		
    let shapeFn = function(d) {

      const _ = d3.select(this);
      const clipped = converters.length > 1 && mapping.get('renderMode') === "sideclipped";
      const superposed = mapping.get('renderMode') === "superposed";
      const sideBySide = mapping.get('renderMode') === "sidebyside";

      let convertersOrdered = converters.slice();
      
      if (superposed) {
        convertersOrdered.sort((a, b) => {
         let s1 = a(d.data.row, "size"),
            s2 = b(d.data.row, "size");
          if (s1 < s2) return 1;
          if (s1 > s2) return -1;
          if (s1 === s2) return converters.indexOf(a) < converters.indexOf(b) ? -1 : 1;
        });
      }

      convertersOrdered.forEach((conv, i) => {

          let shape = conv(d.data.row, "shape"),
            r = conv(d.data.row, "size"),
            sign = Math.sign(d.data.row.get('postProcessedValue')),
            fill = conv(d.data.row, "fill"),
            strokeColor = conv(d.data.row, "strokeColor");
      
          if (shape && r > 0) {
            
            let symbol = SymbolMaker.symbol({
              name: shape,
              size: r*2,
              sign,
              clipped,
              clipRegion: i > 0 ? "left" : "right",
              barWidth: mapping.get('visualization.barWidth')
            });

            let anchorTxTy = undefined;
            if (sideBySide) {
              let margin = {low: 1, middle: 4, high: 8}[mapping.get('sideBySideMargin')];
              let align = mapping.get('sideBySideAlign');
              let ty = 0;
              switch (align) {
                case "bottom":
                  ty = d.maxSize - r;
                  break;
                case "top":
                  ty = r - d.maxSize;
                  break;
                default:
                  ty = 0;
              }
              anchorTxTy = [
                i > 0 ? r + margin : -r - margin,
                ty
              ];
            }
          
            const el = symbol.insert(_, anchorTxTy);
            
            el.attrs({
              "fill": fill,
              "stroke": shape === "line" ? fill : strokeColor,
              "stroke-width": symbol.unscale(conv(d.data.row, 'stroke')),
              "i:i:stroke-width": conv(d.data.row, 'stroke'),
              "i:size": conv(d.data.row, "size")
            })
            .classed("shape", true);

          }

        });
    };
    
   let bindAttr = sel => {
      sel.attr("transform", d => { 
        let [tx, ty] = d.centroid;
        return d3lper.translate({tx, ty});
      });
      
      sel.selectAll(".shape").remove();
      
      sel.each(shapeFn);
    };

    d3Layer.classed("surface", false);
    d3Layer.classed("symbol", true);
    d3Layer.selectAll("*:not(.symbol)").remove();
    
    let centroidSel = d3Layer
			.selectAll("g.feature")
      .data(sortedData)
      .call(bindAttr);
      
    centroidSel.enter()
      .append("g")
			.classed("feature", true)
			.classed("symbol", true)
      .call(bindAttr);
      
    centroidSel.order().exit().remove();

  }

});
