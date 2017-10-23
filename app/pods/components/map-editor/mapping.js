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
          if (a.isBorderLayer && b.get('mapping.visualization.type') === "surface") {
            return 1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.type') === "surface") {
            return -1;
          } else if (a.isBorderLayer && b.get('mapping.visualization.type') === "symbol") {
            let idx = layers.indexOf(b);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.type') === "surface") ? 1 : -1;
          } else if (b.isBorderLayer && a.get('mapping.visualization.type') === "symbol") {
            let idx = layers.indexOf(a);
            return layers.some((v, i) => i < idx && v.get('mapping.visualization.type') === "surface") ? -1 : 1;
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
       .style("opacity", d => d.get('opacity'));
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
          
      data = mapping.get('filteredBody').map( (cell) => {
        
        let geoData = geoDef.get('geo.cells').objectAt(cell.colIndex())
          .get('postProcessedValue');

        return {
          id: geoData.value[geoKey],
          value: cell.get('postProcessedValue'),
          cell: cell,
          surface: landsIdx[geoData.value[geoKey]],
          point: centroidsIdx[geoData.value[geoKey]]
        };
        
      });
      
      if (graphLayer.get('mapping.visualization.type') === "surface") {
        this.mapSurface(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "text") {
        this.mapText(d3Layer, data, graphLayer);
      }
      
    } else if (geoDef.get('isLatLon')) {

      data = mapping.get('filteredBody').map( (cell, index) => {
        
        let val = cell.get('postProcessedValue'),
            lon = cell.get('row.cells').find( c => c.get('column') == geoDef.get('lon') ).get('postProcessedValue'),
            lat = cell.get('row.cells').find( c => c.get('column') == geoDef.get('lat') ).get('postProcessedValue');

        if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {
          return {
            id: `coord-${index}`,
            value: val,
            cell: cell,
            point: {
              path: this.assumePathForLatLon([lat, lon]),
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
        
        return undefined;
        
      }).filter( d => d !== undefined );

      if (graphLayer.get('mapping.visualization.type') === "symbol") {
        this.mapSymbol(d3Layer, data, graphLayer);
      } else if (graphLayer.get('mapping.visualization.type') === "text") {
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
            let pattern = converter(d.cell, "texture");
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, converter(d.cell, "fill"));
              fn.init(svg);
              return `url(${fn.url()})`;
            } else {
              return converter(d.cell, "fill");
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

    let svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn(),
        sortedData = data
          .map( d => ({
            size: converter(d.cell, "size"),
            centroid: d.point.path.centroid(d.point.feature.geometry),
            data: d
          }))
          .filter( d => !isNaN(d.centroid[0]) && !isNaN(d.centroid[1]))
          .sort((a, b) => d3.descending(a.size, b.size));
		
    let shapeFn = function(d) {
      
      let _ = d3.select(this),
          shape = converter(d.data.cell, "shape"),
          r = d.size,
          sign = Math.sign(d.data.cell.get('postProcessedValue')),
          fill = converter(d.data.cell, "fill"),
          strokeColor = converter(d.data.cell, "strokeColor");
      
      if (shape && r > 0) {
        
        let symbol = SymbolMaker.symbol({
          name: shape,
          size: r*2,
          sign: sign,
          barWidth: mapping.get('visualization.barWidth')
        });
      
        let el = symbol.insert(_);
        
        _.select("*").attrs({
          "stroke-width": symbol.unscale(mapping.get('visualization.stroke'))
        })
        .attr("i:i:stroke-width", mapping.get('visualization.stroke'));

        if (shape === "line") {
          strokeColor = fill;
        }
        
        el.attrs({
          "fill": fill,
          "stroke": strokeColor
        })
        .classed("shape", true);
          
      }
      
    };
    
   let bindAttr = (_) => {

      _.attr("transform", d => { 
        let [tx, ty] = d.centroid;
        return d3lper.translate({
          tx: tx,
          ty: ty
        });
      });
      
      _.selectAll(".shape").remove();
      
      _.each(shapeFn);
      
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
