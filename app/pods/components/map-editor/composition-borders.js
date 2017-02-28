import Ember from 'ember';

export default Ember.Mixin.create({

  compositionBordersInit(mapG) {

    mapG.append("g")
      .attr("id", "composition-borders");

  },

  projectAndDraw() {
    this._super();

    let zoom = this.get('graphLayout.zoom'),
        affineT = d3.geo.transform({
          point: function(x, y) { this.stream.point(x*zoom, y*zoom); },
        }),
        path = d3.geo.path().projection(affineT);

    this.drawCompositionBorders(path);
    //this.drawCompositionClipPaths(path);
    //this.drawTest(path);
  },

  drawCompositionClipPaths: function(path) {
    this.d3l().select("defs")
      .selectAll(".composition-mask-path")
      .data(this.get('projector').projections)
      .enterUpdate({
        enter: (sel) => {

          let el = sel.append("mask")
            .attr("id", d => `composition-mask-${d.idx}`)
            .classed("composition-mask-path", true);

          el.append("path")
            .attr("d", d => path(this.bboxToPolygon(d.instance.bboxPx)) )
            .attr("fill-rule", "evenodd")
            .attr("fill", "white");

          return el;
        },
        update: (sel) => {
          return sel.select("path").attr("d", d => path(this.bboxToPolygon(d.instance.bboxPx)) )
            .attr("transform", `translate(${this.get('graphLayout.tx')*this.getSize().w}, ${this.get('graphLayout.ty')*this.getSize().h})`);
        }
      });
  },

  drawTest: function(path) {
    this.d3l().selectAll(".composition-clipping-rect")
      .data(this.get('projector').projections)
      .enterUpdate({
        enter: (sel) => {

          let el = sel.append("g")
            .attr("id", d => `composition-rect-${d.idx}`)
            .classed("composition-clipping-rect", true);
            
          el.append("path")
            .attr("d", d => path(this.bboxToPolygon(d.instance.bboxPx)) )
            .style("fill", "#404040")
            .style("stroke", "red")

          return el;
        },
        update: (sel) => {
          return sel.select("path").attr("d", d => path(this.bboxToPolygon(d.instance.bboxPx)) )
            .attr("transform", `translate(${this.get('graphLayout.tx')*this.getSize().w}, ${this.get('graphLayout.ty')*this.getSize().h})`);
        }
      });
  },

  drawCompositionBorders: function(path) {

    let sel = this.d3l().select("#composition-borders")
      .attr("transform", `translate(${this.get('graphLayout.tx')*this.getSize().w}, ${this.get('graphLayout.ty')*this.getSize().h})`)
      .selectAll("g")
      .data(this.get('projector').projections)
      .enterUpdate({
        enter: (sel) => {
          let g = sel.append("g");

          g.append("path")
            .attr("d", d => path(this.bboxToMultiLineString(d.instance.bboxPx, d.borders)) )
            .style("stroke", this.get('graphLayout.gridColor'))
            .style("fill", "white");

          return g;
        },
        update: (sel) => {
          return sel.select("path").attr("d", d => path(this.bboxToMultiLineString(d.instance.bboxPx, d.borders)) );
        }
      });
  },

  bboxToPolygon(bbox) {

    return {
      type: "Polygon",
      coordinates: [[
        [bbox[0][0], bbox[0][1]],
        [bbox[1][0], bbox[0][1]],
        [bbox[1][0], bbox[1][1]],
        [bbox[0][0], bbox[1][1]],
        [bbox[0][0], bbox[0][1]]
      ]]
    };

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
      type: "MultiLineString",
      coordinates
    };

  }

});
