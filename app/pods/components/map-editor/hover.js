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
    let d3l = this.d3l(),
      geoKey = this.get('graphLayout.basemap.mapConfig.dictionary.identifier'),
      backmap = d3l.select("#backmap"),
      lands = this.getFeaturesFromBase("lands"),
      size = this.getSize();

    if (this.get('defaultGeoDef').get('isLatLon')) {

      let points = this.get('defaultGeoDef.latLonCouples').reduce( (out, couple, index) => {
        
        let lat = couple.lat.get('postProcessedValue'),
            lon = couple.lon.get('postProcessedValue'),
            path = this.assumePathForLatLon([lat, lon]),
            coords = path.centroid({
              type: "Point",
              coordinates: [
                lon,
                lat
              ]
            });

        out.push({
          coords 
        });

        return out;

      }, []);

      let voronoi = d3.voronoi()
        .x( d => d.coords[0] )
        .y( d => d.coords[1] )
        .extent([[0, 0], [size.w, size.h]]);

      let data = voronoi(points).polygons().map( (poly, i) => {
        return {poly, point: points[i]};
      });

      backmap.selectAll("path.hover-point")
        .data(data)
        .enterUpdate({
          enter: function(sel) {
            return sel.append("path").classed("hover-point", true)
              .on("mousemove", d => {
                let [mouseX, mouseY] = d3.mouse(d3l.node());
                if (d3lper.distance(d.point.coords, [mouseX, mouseY]) < 30) {
                  console.log("in");
                }
              })
              .on("mouseout", d => console.log("out") );
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
      backmap.selectAll("path.hover-land")
        .data(lands)
        .enterUpdate({
          enter: function(sel) {
            return sel.append("path").classed("hover-land", true)
              .on("mouseover", d => console.log(d) )
              .on("mouseout", d => console.log("out") );
          },
          update: (sel) => {
            return sel.attr("d", d => d.path(d.feature) )
              .styles({
                "stroke": "none",
                "fill": "rgba(0, 0, 0, 0.0001)"
              });
          }
        });
    }

  }

});
