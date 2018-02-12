import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';

export default Ember.Mixin.create({

  defaultGeoDef: null,
  hoverEnabled: false,

  projectAndDraw() {
    this._super();
    this.hoverCompute();
  },

  hasActiveLayer: function() {
    return this.get('graphLayers').some( gl => gl.get('visible') && gl.get('mapping.type') != null );
  }.property('graphLayers.@each.visible', 'graphLayers.@each.mapping.type'),
  
  hoverCompute: function() {
    if (this.get('hoverEnabled')) {
      this.bindHover();
    } else {
      this.unbindHover();
    }
  }.observes('hoverEnabled', 'hasActiveLayer'),

  latLonCouplesPoints() {

    return this.get('defaultGeoDef.latLonCouples').reduce( (out, couple, index) => {
      
      let lat = couple.lat.get('postProcessedValue'),
          lon = couple.lon.get('postProcessedValue');
          
      if (!Ember.isEmpty(lat) && !Ember.isEmpty(lon)) {

        let path = this.assumePathForLatLon([lat, lon]);

        if (path) {
          
          xy = path.centroid({
            type: "Point",
            coordinates: [
              lon,
              lat
            ]
          });

          out.push({
            xy,
            coordinates: [lon, lat],
            row: couple.lat.get('row')
          });

        }

      }

      return out;

    }, []);

  },

  unbindHover() {
    let d3l = this.d3l(),
        foremap = d3l.select("#map").selectOrCreate("#foremap", function() { return this.append("g").attr("id", "foremap")});

    foremap.selectAll("g.hover-point, path.hover-land").remove();

    if (this.get('defaultGeoDef').get('isLatLon') && !this.get('hasActiveLayer')) {

      let points = this.latLonCouplesPoints();

      foremap.selectAll("g.static-point")
        .data(points)
        .enterUpdate({
          enter: function(sel) {
            let g = sel.append("g").classed("static-point", true)
            g.append("circle").attr("r", 3);
            return g;
          },
          update: (sel) => {
            sel.select("circle").attrs({
              cx: d => (d && d.xy[0]) || null,
              cy: d => (d && d.xy[1]) || null
            });
            return sel;
          }
        });

    } else {
      foremap.selectAll("g.static-point").remove();
    }
  },

  bindHover(enabled) {
    let self = this,
      d3l = this.d3l(),
      geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
      foremap = d3l.select("#map").selectOrCreate("#foremap", function() { return this.append("g").attr("id", "foremap")}),
      lands = this.getFeaturesFromBase("lands"),
      size = this.getSize();

    if (this.get('defaultGeoDef').get('isLatLon')) {

      let points = this.latLonCouplesPoints();

      let voronoi = d3.voronoi()
        .x( d => d.xy[0] )
        .y( d => d.xy[1] )
        .extent([[0, 0], [size.w, size.h]]);

      let data = voronoi(points).polygons().map( (poly, i) => {
        return {poly, data: points[i]};
      });
      foremap.selectAll("g.static-point").remove();
      foremap.selectAll("g.hover-point")
        .data(data)
        .enterUpdate({
          enter: function(sel) {
            let g = sel.append("g").classed("hover-point", true)
              .on("mouseover", function() {
                d3.select(this).classed("mouseover", true);
              })
              .on("mousemove", function(d) {
                if (d3.select(this).classed("mouseover")) {
                  let [mouseX, mouseY] = d3.mouse(d3l.node());
                  if (d3lper.distance(d.data.xy, [mouseX, mouseY]) < 30) {
                    d3.select(this).classed("overed", true);
                    self.sendAction('onElementOver', d.data);
                  } else {
                    d3.select(this).classed("overed", false);
                    self.sendAction('onElementOut');
                  }
                }
              })
              .on("mouseout", function(d) {
                d3.select(this).classed("mouseover", false)
                  .classed("overed", false);
                self.sendAction('onElementOut');
              });
            g.append("path");
            g.append("circle").attr("r", 3);
            return g;
          },
          update: (sel) => {
            sel.select("path").attr("d", d => d && d.poly ? "M" + d.poly.join("L") + "Z" : null );
            sel.select("circle").attrs({
              cx: d => (d && d.data.xy[0]) || null,
              cy: d => (d && d.data.xy[1]) || null
            });
            return sel;
          }
        });

    } else {

      let data = lands.map( l => {
        let cell = this.get('defaultGeoDef.geo.body').find(c => c.get('postProcessedValue').value && c.get('postProcessedValue').value[geoKey] === l.feature.properties[geoKey]),
            row = (cell && cell.get('row')) || null;
        return {
          land: l,
          data: {
            row,
            land: l.feature.properties
          }
        }
      });

      foremap.selectAll("path.hover-land")
        .data(data)
        .enterUpdate({
          enter: function(sel) {
            return sel.append("path").classed("hover-land", true)
              .on("mouseover", function(d) {
                self.sendAction('onElementOver', d.data);
                d3.select(this).classed("overed", true);
              })
              .on("mouseout", function(d) {
                self.sendAction('onElementOut');
                d3.select(this).classed("overed", false);
              });
          },
          update: (sel) => {
            return sel.attr("d", d => d.land.path(d.land.feature) );
          }
        });
    }

  }

});
