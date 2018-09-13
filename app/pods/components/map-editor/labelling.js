import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import d3Annotation from 'npm:d3-svg-annotation';
import SymbolMaker from 'khartis/utils/symbol-maker';

const ENABLE_DRAG_FEATURE = true; //TODO : finish

const {abs, sqrt, cos, sin, atan2, PI:pi} = Math,
      pyt = (a, o) => sqrt(a*a + o*o),
      angle = function(o, p) {
        return atan2(p[1] - o[1], p[0] - o[0]);
      },
      truncate = function(v) { //equals to ceil for neagtive numbers and floor for postive ones
        return v - v%1;
      };

export default Ember.Mixin.create({

  labellingInit(d3g) {

    this.d3l().select("#outerMap")
      .append("g")
      .classed("zoomable", true)
      .classed("labelling-container", "true");

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
    
    let sel = this.d3l().select("g.labelling-container")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();

    this.d3l().select("g.labelling-container")
      .selectAll("g.layer")
      .each(function(d, index) {
        self.mapData(d3.select(this), d);
      });
    
  }.observes('labellingLayers.[]', 'labellingLayers.@each._defferedChangeIndicator',
   'graphLayers.@each._defferedChangeIndicator'),

  mapText(d3Layer, data, graphLayer) {

    let self = this,
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn(),
        mappedDataLayers = this.get('displayableLayers'),
        visualization = mapping.get('visualization');

    let labels = data.filter( d => {
      let [tx, ty] = d.point.path.centroid(d.point.feature.geometry);
      return !isNaN(tx) && !isNaN(ty);
    })
    .map( d => {

      //find subjects largest bounds
      let associatedSymbolsBounds = d.row.get('cells').reduce( (out, cell) => {
        let layers = mappedDataLayers.filter(
          gl => gl.get('mapping.varCol') == cell.get('column') && gl.get('mapping.visualization.type') === 'symbol'
        );
        layers.forEach( lyr => {
          let mapping = lyr.get('mapping'),
              lyrConverter = mapping.fn(),
              symbol = SymbolMaker.symbol({
                name: lyrConverter(cell.get('row'), "shape"),
                size: lyrConverter(cell.get('row'), "size")*2,
                sign: Math.sign(cell.get('postProcessedValue')),
                barWidth: mapping.get('visualization.barWidth')
              });
          let bounds = symbol.getBounds();
          out = [...out, bounds];
        });
        return out;
      }, [{type: "circle", x: 0, y: 0, width: 0, height: 0}]);

      return {
        id: d.id,
        point: d.point,
        xy: d.point.path.centroid(d.point.feature.geometry),
        label: converter(d.row, "text"),
        bounds: associatedSymbolsBounds,
        padding: 2,
        ...visualization.getOverwrite(d.id)
      }
    });

    d3Layer
			.selectAll("g.labelling")
      .data(labels)
      .enterUpdate({

        enter: sel => {
          let gSel = sel.append("g")
            .classed("labelling", true);

          let textSel = gSel.append("text");
          ENABLE_DRAG_FEATURE && textSel.call(this.newDragFeature(visualization));

          gSel.append("path")
            .classed("radius", true)
            .attr("stroke", visualization.get('style.color'))
            .attr("fill", "none");
          return gSel;
        },

        update: sel => {
          let style = visualization.get('style');
          
          sel.select("path.radius").attr("stroke", style.color);

          sel.select("text")
            .attrs({
              "text-anchor": "middle",
              "font-size": style.size,
              "fill": style.color,
              "font-weight": style.get('bold') ? "bold" : "normal",
              "text-decoration": style.get('underline') ? "underline" : null,
              "font-style": style.get('italic') ? "italic" : null,
              "font-family": style.font,
              "stroke": "none",
              "stroke-width": 0
            })
            .text(d => d.label)
            .call(d3lper.wrapText, 120)
            .each( function(d) {
              let mapZoom = self.get('graphLayout.zoom');
              let [tx, ty] = d3lper.sumCoords(d.xy, [d.dx*mapZoom, d.dy*mapZoom]);
              let textSel = d3.select(this).attrs({
                "dy": "0.3em",
                "transform": d3lper.translate({tx, ty})
              });
              self.drawLines(textSel, tx, ty);
            });
          return sel;
        }

      })
      .order();

  },

  newDragFeature(visualization) {

    var self = this;
    
    //LEGEND DRAG
    return d3.drag()
      .subject(function(d) {
        let  mapZoom = self.get('graphLayout.zoom');
        return {x: d.xy[0] + d.dx*mapZoom, y: d.xy[1] + d.dy*mapZoom};
      })
      .on("start", function() {
        d3.event.sourceEvent.stopPropagation();
        d3.event.sourceEvent.preventDefault();
        d3.select(this).classed("dragging", true);
      })
      .on("drag", function(d) {

        let sel = d3.select(this),
            bgBox = self.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bgBox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bgBox.height-10, Math.max(d3.event.y, 0))
            };
        
        sel.attr("transform", d3lper.translate(pos));
        self.drawLines(sel, pos.tx, pos.ty);

      })
      .on("end", function(d) {
        let sel = d3.select(this),
            mapZoom = self.get('graphLayout.zoom'),
            bgBox = self.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bgBox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bgBox.height-10, Math.max(d3.event.y, 0))
            };

        let dx = (pos.tx - d.xy[0])/mapZoom,
            dy = (pos.ty - d.xy[1])/mapZoom;

        visualization.mergeOverwrite(d.id, {dx, dy});
        
        d3.select(this).classed("dragging", false);
      });
    
  },

  drawLines(textSel, tx, ty) {

    let radius = d3.select(textSel.node().parentNode).select("path.radius"),
        d = textSel.datum();
        
    if (pyt(d.xy[0]-tx, d.xy[1]-ty) < 2) {
      radius.attr("display", "none"); //hide before rendering
      textSel.attr("text-anchor", "middle")
      return;
    }

    textSel.attr("text-anchor", "start");

    const piScale = function(v, multiple) {
      let r = v/ multiple,
          n = Math.round(r);
      return n * multiple;
    }
    let lineGen = d3.line().curve(d3.curveLinear),
        bbox = textSel.node().getBoundingClientRect(),
        textDy = textSel.node().dy.baseVal.getItem(0).value,
        absoluteXY = d3lper.xyRelativeTo(textSel.node(), this.d3l().node()),
        [ox, oy] = d.xy,
        signH = Math.sign(tx - ox),
        signV = Math.sign(ty - oy),
        anchor = d3lper.sumCoords([tx, ty], [-signH*(bbox.width / 2), (-signV+1)/2*(bbox.height-textDy) - (signV+1)*1.5*textDy]),
        theta = angle([ox, oy], anchor),
        hasBoxBounds = d.bounds.some( b => b.type === "box" ),
        theta2 = piScale(theta, hasBoxBounds ? pi/2 : pi/4);
    
    //intersect with bounds and keep extremums
    let {x: offsetedOx, y: offsetedOy} = d.bounds.reduce( (out, bounds) => {
      let x, y, rx = bounds.width/2, ry = bounds.height/2;
      if (bounds.type === "circle") {
        x = ox + (rx + d.padding)*cos(theta2);
        y = oy + (rx + d.padding)*sin(theta2);
      } else {
        if (abs(cos(theta2)) > 0.5) {
          x = ox + signH*(pyt(rx, sin(theta2)*ry) + d.padding);
          y = oy + sin(theta2)*(ry + d.padding);
        } else {
          x = ox + cos(theta2)*(rx + d.padding);
          y = oy + signV*(pyt(cos(theta2)*rx, ry) + d.padding);
        }
      }
      x += bounds.x;
      y += bounds.y;
      return {
        x: (signH === -1 ? Math.min : Math.max)(out.x, x),
        y: (signV === -1 ? Math.min : Math.max)(out.y, y)
      };
    }, {x: ox, y: oy});

    let diffX = anchor[0] - offsetedOx,
        diffY = anchor[1] - offsetedOy;

    /* calculate middle point if needed */
    let xm = tx;
    let ym = ty;
    let [xe, ye] = anchor;
    let opposite = ye < offsetedOy && xe > offsetedOx || xe < offsetedOx && ye > offsetedOy ? -1 : 1;
  
    if (Math.abs(diffX) < Math.abs(diffY)) {
      xm = xe;
      ym = offsetedOy + diffX*opposite;
    } else {
      ym = ye;
      xm = offsetedOx + diffY*opposite;
    }

    /* calculate line termination (text underline) */
    let terminationPt = [absoluteXY.x + (signH+1)*bbox.width/2, ye];
    
    if ((xm - xe)*signH <= 0 && (ym - ye)*signV <= 0) {
      radius
        .attrs({
          display: null,
          d: lineGen([[offsetedOx, offsetedOy], [xm , ym], [xe, ye], terminationPt])
        });
    } else { //no line
      radius.attr("display", "none");
    }

  }

});
