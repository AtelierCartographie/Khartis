import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';

const ENABLE_DRAG_FEATURE = false; //TODO : finish

const π = Math.PI,
      angle = function(o, p) {
        let hyp = Math.sqrt(Math.pow(p[0] - o[0], 2) + Math.pow(p[1] - o[1], 2)),
            a = (p[0] - o[0]) < 0 ? π/2 : 0,
            b = hyp > 0 ? Math.asin( (p[1] - o[1])/hyp ) : 0;

        return Math.sign(b) * a + b; 
      };

export default Ember.Mixin.create({

  labellingInit(d3g) {

    d3g.append("g")
      .classed("labelling", "true");

  },

  projectAndDraw: function() {
    
    this._super();
    this.drawLabelling();
			
	}.observes('windowLocation', 'projector', 'graphLayout.virginDisplayed'),

  drawLabelling: function() {

    let self = this,
        data = this.get('labellingLayers')
          .filter( gl => gl.get('displayable') )
          .reverse();

    let bindAttr = (_) => {
      _.style("opacity", d => d.get('opacity'));
    };
    
    let sel = this.d3l().select("g.labelling")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();

    this.d3l().select("g.labelling")
      .selectAll("g.layer")
      .each(function(d, index) {
        self.mapData(d3.select(this), d);
      });
    
  }.observes('labellingLayers.[]', 'labellingLayers.@each._defferedChangeIndicator'),

  mapText: function(d3Layer, data, graphLayer) {

    let self = this,
        svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        visualization = mapping.get('visualization'),
        converter = mapping.fn();

    let bindAttr = (_) => {

        _.select("text")
          .attr("text-anchor", {
              start: "start",
              middle: "middle",
              end: "end"
            }[graphLayer.get('mapping.visualization.anchor')])
          .styles({
            "font-size": `${visualization.get('size')}em`,
            "fill": visualization.get('color'),
            "stroke": "none",
            "stroke-width": 0
          })
          .text(d => d.cell.get('corrected') ? d.cell.get('correctedValue') : d.cell.get('value'))
          .each( function(d) {
            let [tx, ty] = d.point.path.centroid(visualization.getGeometry(d.id, d.point.feature.geometry));
            d3.select(this).attrs({
              "dy": "0.3em",
              "kis:kis:tx": d => tx,
              "kis:kis:ty": d => ty,
              "transform": d3lper.translate({tx: tx, ty: ty})
            })
            .call(self.drawLines, tx, ty);
          });
      };

    let centroidSel = d3Layer
			.selectAll("g.labelling")
      .data(data.filter( d => {
        let [tx, ty] = d.point.path.centroid(d.point.feature.geometry);
        return !isNaN(tx) && !isNaN(ty);
      }))
      .call(bindAttr);
      
    let gSel = centroidSel.enter()
      .append("g")
      .classed("labelling", true);

    let textSel = gSel.append("text");
    
    if (ENABLE_DRAG_FEATURE) {
        textSel.call(this.newDragFeature(visualization));
    }

    gSel.append("line").classed("radius", true);
    gSel.append("line").classed("end", true);
      
    gSel.call(bindAttr);

    centroidSel.order().exit().remove();

	},

  newDragFeature(visualization) {

    var self = this;

    //LEGEND DRAG
    return d3.drag()
      .subject(function() {
        let sel = d3.select(this);
        return {x: sel.attr('kis:kis:tx'), y: sel.attr('kis:kis:ty')};
      })
      .on("start", function() {
        d3.event.sourceEvent.stopPropagation();
        d3.event.sourceEvent.preventDefault();
        d3.select(this).classed("dragging", true);
      })
      .on("drag", function() {

        let sel = d3.select(this),
            bgBox = self.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bgBox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bgBox.height-10, Math.max(d3.event.y, 0))
            };
        
        sel.attrs({
         'transform': d3lper.translate(pos), 
          "kis:kis:tx": pos.tx,
          "kis:kis:ty": pos.ty
        })
        .each( function(d) {
          let proj = d.point.path.projection();
          visualization.setGeometry(d.id, {type: "Point", coordinates: proj.invert([pos.tx, pos.ty])});
        })
        .call(self.drawLines, pos.tx, pos.ty);

      })
      .on("end", function() {
        d3.select(this).classed("dragging", false);
      });
    
  },

  drawLines(textSel, tx, ty) {

    let bbox = textSel.node().getBBox(),
        radius = d3.select(textSel.node().parentNode).select("line.radius"),
        end = d3.select(textSel.node().parentNode).select("line.end");

    textSel.each( function(d) {

        let [ox, oy] = d.point.path.centroid(d.point.feature.geometry),
            signH = Math.sign(tx - ox),
            signV = Math.sign(ty - oy),
            anchor = [-signH*(bbox.width/2), 0],
            hyp0 = Math.sqrt(Math.pow(tx - ox, 2) + Math.pow(ty - oy, 2)),
            shift = Math.min(hyp0*0.2, 36),
            theta = angle([ox, oy], d3lper.sumCoords([tx, ty], anchor, [-signH*shift, -signH*shift]));

        if ((signH > 0 && Math.abs(theta) > π/2) || (signH < 0 && Math.abs(theta) < π/2)) { //middle
          if (hyp0 > 26 && Math.abs(angle([ox, oy], [tx, ty])) % (π/2) > π/3) {
            radius
              .attrs({
                display: "block",
                x1: ox,
                y1: oy,
                x2: tx,
                y2: ty - signV*(bbox.height/2 + 2)
              });
          } else {
            radius.attr("display", "none");
          }
          end.attr("display", "none");
        } else {
          let hyp = Math.sqrt(Math.pow(tx + anchor[0] - ox, 2) + Math.pow(ty + anchor[1] - oy, 2));
          if (hyp > 18) {
            radius
              .attrs({
                display: "block",
                x1: ox,
                y1: oy,
                x2: tx + anchor[0] - signH*shift,
                y2: ty
              });
            end.attrs({
              display: null,
              x1: radius.attr("x2"),
              y1: radius.attr("y2"),
              x2: tx + anchor[0] - signH*2,
              y2: ty
            });
          } else {
            radius.attr("display", "none");
            end.attr("display", "none");
          }
        }

      } );
  }

});
