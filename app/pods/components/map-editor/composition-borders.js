import Ember from 'ember';

export default Ember.Mixin.create({

  compositionBordersInit(mapG) {

    mapG.append("g")
      .classed("composition-borders", true);

    this.drawCompositionBorders();

  },

  projectAndDraw() {
    this._super();
    this.drawCompositionBorders();
  },

  drawCompositionBorders: function() {
    
    let zoom = this.get('graphLayout.zoom'),
        affineT = d3.geo.transform({
          point: function(x, y) { this.stream.point(x*zoom, y*zoom); },
        }),
        path = d3.geo.path().projection(affineT);

    let sel = this.d3l().select("g.composition-borders")
      .attr("transform", `translate(${this.get('graphLayout.tx')*this.getSize().w}, ${this.get('graphLayout.ty')*this.getSize().h})`)
      .selectAll("g")
      .data(this.get('projector').projections);

    sel.select("path")
      .attr("d", d => path(this.bboxToMultiLineString(d.instance.bboxPx, d.borders)) );

    sel.enter()
      .append("g")
      .append("path")
      .attr("d", d => path(this.bboxToMultiLineString(d.instance.bboxPx, d.borders)) )
      .style("stroke", this.get('graphLayout.gridColor'));

    sel.exit().remove();

  },

  bboxToMultiLineString(bbox, borders) {

    let coordinates = [];

    if (borders.indexOf("l") !== -1) {
      coordinates.push(
        [bbox[0], [bbox[0][0], bbox[1][1]]]
      );
    }

    if (borders.indexOf("r") !== -1) {
      coordinates.push(
        [bbox[1], [bbox[1][0], bbox[0][1]]]
      );
    }

    if (borders.indexOf("t") !== -1) {
      coordinates.push(
        [bbox[0], [bbox[1][0], bbox[0][1]]]
      );
    }

    if (borders.indexOf("b") !== -1) {
      coordinates.push(
        [bbox[1], [bbox[0][0], bbox[1][1]]]
      );
    }

    return {
      "type": "MultiLineString",
      "coordinates": coordinates
    };

  }

});
