import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';

export default Ember.Mixin.create({

  defaultGeoDef: null,

  projectAndDraw() {
    this._super();
    this.bindHover();
  },

  bindHover() {
    let self = this,
      d3l = this.d3l(),
      geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
      backmap = d3l.select("#backmap"),
      lands = this.getFeaturesFromBase("lands"),
      size = this.getSize();

    if (this.get('defaultGeoDef').get('isLatLon')) {

      let points = this.get('defaultGeoDef.latLonCouples').reduce( (out, couple, index) => {
        
        let lat = couple.lat.get('postProcessedValue'),
            lon = couple.lon.get('postProcessedValue'),
            path = this.assumePathForLatLon([lat, lon]),
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

        return out;

      }, []);

      let voronoi = d3.voronoi()
        .x( d => d.xy[0] )
        .y( d => d.xy[1] )
        .extent([[0, 0], [size.w, size.h]]);

      let data = voronoi(points).polygons().map( (poly, i) => {
        return {poly, data: points[i]};
      });

      backmap.selectAll("path.hover-point")
        .data(data)
        .enterUpdate({
          enter: function(sel) {
            return sel.append("path").classed("hover-point", true)
              .on("mouseover", function() {
                d3.select(this).classed("overed", true);
              })
              .on("mousemove", function(d) {
                if (d3.select(this).classed("overed")) {
                  let [mouseX, mouseY] = d3.mouse(d3l.node());
                  if (d3lper.distance(d.data.xy, [mouseX, mouseY]) < 30) {
                    self.sendAction('onElementOver', d.data);
                  } else {
                    self.sendAction('onElementOut');
                  }
                }
              })
              .on("mouseout", d => function() {
                d3.select(this).classed("overed", false);
                self.sendAction('onElementOut');
              });
          },
          update: (sel) => {
            return sel.attr("d", d => d.poly ? "M" + d.poly.join("L") + "Z" : null )
              .styles({
                "stroke": "rgba(255, 0, 0, 1)",
                "fill": "rgba(0, 0, 255, 0.1)"
              });
          }
        });

    } else {

      let data = lands.map( l => {
        let cell = this.get('defaultGeoDef.geo.body').find(c => c.get('postProcessedValue').value[geoKey] === l.feature.properties[geoKey]),
            row = (cell && cell.get('row')) || null;
        return {
          land: l,
          data: {
            row
          }
        }
      });

      backmap.selectAll("path.hover-land")
        .data(data)
        .enterUpdate({
          enter: function(sel) {
            return sel.append("path").classed("hover-land", true)
              .on("mouseover", d => {
                self.sendAction('onElementOver', d.data);
              })
              .on("mouseout", d => {
                self.sendAction('onElementOut');
              });
          },
          update: (sel) => {
            return sel.attr("d", d => d.land.path(d.land.feature) )
              .styles({
                "stroke": "none",
                "fill": "rgba(0, 0, 0, 0.0001)"
              });
          }
        });
    }

  }

});
