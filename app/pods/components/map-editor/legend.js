import Ember from 'ember';
import d3lper from 'mapp/utils/d3lper';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import ValueMixin from 'mapp/models/mapping/mixins/value';

export default Ember.Mixin.create({
  
  legendInit() {

    let legendG = this.d3l().append("g")
      .classed("legend", true);
    
    //LEGEND DRAG
    let drag = d3.behavior.drag()
      .origin(() => {
        return {x: legendG.attr('tx'), y: legendG.attr('ty')};
      })
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        legendG.classed("dragging", true);
      })
      .on("drag", () => {
        let bbox = this.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bbox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bbox.height-10, Math.max(d3.event.y, 0))
            };
        legendG.attr({
         'transform': d3lper.translate(pos), 
          tx: pos.tx,
          ty: pos.ty
        });
      })
      .on("dragend", () => {
        legendG.classed("dragging", false);
        let t = this.getViewboxTransform()({
          x: legendG.attr('tx'),
          y: legendG.attr('ty')
        });
        this.get('graphLayout').setProperties({
          legendTx: t.x,
          legendTy: t.y
        });
        this.sendAction('onAskVersioning', "freeze");
      });
      
    this.updateLegendPosition();
    this.updateLegendOpacity();
    this.drawLegend();
    legendG.call(drag);
    
  },
  
  updateLegendPosition: function() {
    
    let legendG = this.d3l().select("g.legend"),
        legendContentG = legendG.select("g.legend-content"),
        t = {x: this.get('graphLayout.legendTx'), y: this.get('graphLayout.legendTy')};
    
    if (!legendG.node()) {
      return;
    }
    
    if (t.x === null || t.y === null) {
      
      let bbox = legendG.node().getBBox(),
          {w, h} = this.getSize();
      
      t.x = (w - bbox.width) / 2;
      t.y = h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + 16;
      
    } else {
      
      t = this.getViewboxTransform().invert(t);
      
    }
    
    legendG.attr({
        "tx": t.x,
        "ty": t.y,
        "transform": d3lper.translate({tx: t.x, ty: t.y})
      });
      
    if (!legendContentG.empty()) {
      
      let bbox = legendContentG.node().getBBox();
      
      legendG.select("rect.legend-bg")
        .attr({
          width: bbox.width + 18,
          height: bbox.height + 20
        });
        
    }
    
  }.observes('$width', '$height',
    'graphLayout.legendTx', 'graphLayout.legendTy',
    'graphLayout.width', 'graphLayout.height'),
  
  updateLegendOpacity: function() {
    
    this.d3l().selectAll("g.legend rect.legend-bg")
      .style("opacity", this.get('graphLayout.legendOpacity'));
      
  }.observes('graphLayout.legendOpacity'),
  
  drawLegend: function() {
    
    let svg = this.d3l(),
        layers = this.get('graphLayers'),
        width = layers.length * 120;
    
    let legendG = this.d3l().selectAll("g.legend")
      
    let containerG = legendG.selectAll("g.legend-content"),
        bgG = legendG.selectAll("rect.legend-bg");
    
    if (!this.get('graphLayout.showLegend') || !this.get('graphLayers').length) {
      containerG.remove();
      bgG.remove();
      return;
    }
    
    if (bgG.empty()) {
      bgG = legendG.append("rect")
        .classed("legend-bg", true)
        .attr({
          "x": -18,
          "y": -5
        })
        .attr("fill", "white");
    }
    
    if (containerG.empty()) {
      containerG = legendG.append("g")
        .classed("legend-content", true);
    }
    
    containerG.attr("flow-css", "flow: horizontal; padding-left: 5; height: 500; width: "+width);  
    
    let bindLayer = (_) => {
      
      _.attr("flow-css", "flow: vertical; stretch: true; margin-right: 34; margin-top: 16");
      
      _.each( function(d, i) {
        
        let el = d3.select(this),
            xOrigin = (d.get('mapping.visualization.type') === "symbol" ?
              d.get('mapping.visualization.maxSize') : 10),
            textOffset = xOrigin + 16,
            formatter = d3.format(`0.${d.get('mapping.maxValuePrecision')}f`);

        el.selectAll("*").remove();
          
        let label = el.append("g")
          .attr("flow-css", "margin-bottom: 16")
          .append("text")
          .attr("flow-css", "wrap-text: true; max-width: 250px")
          .classed("legend-title", true)
          .attr("transform", d3lper.translate({tx: -xOrigin/2}))
          .style({
            "font-size": "14px",
            "font-weight": "bold"
          });
        
        label.text(d.get('mapping.varCol.header.value'));
          
        let appendSurfaceIntervalLabel = function(val, i) {
          
          let r = {x: 24/2, y: 16/2};

          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${2*r.y}px; index: ${i}; margin-top: ${ i > 0 ? 0 : 0 }px`);
              
          let g = d3.select(this).append("g")
            .attr("flow-css", `margin-right: -${r.x}px`);
          
          //border
          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              y: 0,
              "stroke-width": 1,
              "stroke": "black",
              fill: "none" 
            });

          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              y: 0,
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001),
              "mask": () => {
                
                let mask = d.get('mapping').getScaleOf("texture")(val - 0.000000001)
                if (mask && mask.fn != PatternMaker.NONE) {
                  svg.call(mask.fn);
                  return `url(${mask.fn.url()})`;
                } else {
                  return null;
                }
              },
              "stroke-width": 0
            });
            
          g = d3.select(this).append("g");
            
          if (i === 0) {
            
            /*g.append("line").attr({
              x1: -2*r.x,
              y1: 0,
              x2: 0,
              y2: 0,
              stroke: "black"
            });*/
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset - 12,
                y:  0,
                dy: "0.3em",
                "font-size": "0.75em"
              });
            
          }
          
          /*g.append("line").attr({
              x1: -2*r.x,
              y1: 2*r.y,
              x2: 0,
              y2: 2*r.y,
              stroke: "black"
            });*/
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset - 12,
              y: 2*r.y,
              dy: "0.3em",
              "font-size": "0.75em"
            });
          
        };
        
        let appendSymbolIntervalLabel = function(val, i) {

          
          let r = {x: d.get('mapping').getScaleOf('size')(val - 0.000000001), y: d.get('mapping').getScaleOf('size')(val - 0.000000001)},
              dy = r.y*0.2, //compense la marge sur les symboles
              symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});
      
          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${Math.max(2*r.y - 2*dy, 10)}px; margin-bottom: 4px`);

          if (!(r.x > 0 && r.y > 0)) return;

          symbol.call(svg);
          
          let g = d3.select(this).append("g")
            .attr("flow-css", `margin-right: ${-r.x}px; margin-top: ${-dy}; width: ${r.x}px`);
          
          g.append("use")
            .attr({
              "xlink:href": symbol.url(),
              "width": r.x*2,
              "height": r.y*2,
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r.x*2),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001)
            });
            
          g = d3.select(this).append("g")
            .attr("flow-css", `margin-top: ${-dy};`);
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: 0,
              y1: -2 + dy,
              x2: textOffset - 6,
              y2: -2 + dy,
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset,
                y: -2 + dy,
                dy: "0.3em",
                "font-size": "0.75em"
              });
            
          }
          
          g.append("line").attr({
              x1: 0,
              y1: Math.max(2*r.y - dy + 2, 10),
              x2: textOffset - 6,
              y2: Math.max(2*r.y - dy + 2, 10),
              stroke: "black"
            });
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset,
              y: Math.max(2*r.y - dy + 2, 10),
              dy: "0.3em",
              "font-size": "0.75em"
            });
              
          
        };
        
        let appendSymbolIntervalLinearLabel = function(val, i) {
          
          let r = {x: d.get('mapping').getScaleOf('size')(val - 0.000000001), y: d.get('mapping').getScaleOf('size')(val - 0.000000001)},
              dy = r.y*0.2, //compense la marge sur les symboles
              symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});
      
          if (!(r.x > 0 && r.y > 0)) return;

          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${Math.max(2*r.y - 2*dy, 10)}px; margin-bottom: 2px`);
          
          symbol.call(svg);
          
          let g = d3.select(this).append("g")
           .attr("flow-css", `margin-right: ${-r.x}; margin-top: ${-dy}; width: ${r.x}px`);
          
          g.append("use")
            .attr({
              "xlink:href": symbol.url(),
              "width": r.x*2,
              "height": r.y*2,
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r.x*2),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001)
            });
            
          g = d3.select(this).append("g")
            .attr("flow-css", `margin-top: ${-dy};`);
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset,
              y: r.y,
              dy: "0.3em",
              "font-size": "0.75em"
            })
          
        };
        
        let appendRuleLabel = function(rule, i) {

          let r,
              dy = 0; //compense la marge sur les symboles

          if (d.get('mapping.visualization.type') === "symbol") {

            let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape');
            
            r = {x: rule.get('size'), y: rule.get('size')};
            dy = r.y*0.2;
            
            //height trouvée empiriquement car la bbox ne fait pas la bonne taille avec les symbols
            d3.select(this).attr("flow-css", `flow: horizontal; height: ${2*r.y - 2*dy}px; stretch: true; margin-bottom: 4px`);

            let symbol = SymbolMaker.symbol({name: shape});
      
            symbol.call(svg);
            
            let g = d3.select(this).append("g")
              .attr("flow-css", `margin-right: ${-r.x}px; margin-top: ${-dy}px; width: ${r.x}px`);

            g.append("use")
              .attr({
                "xlink:href": symbol.url(),
                "width": r.x*2,
                "height": r.y*2,
                "transform": d3lper.translate({tx: -r.x, ty: 0}),
                "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r.x*2),
                "stroke": rule.get('strokeColor'),
                "fill": rule.get('color')
              });
              
          } else {
            
            r = {x: 24/2, y: 16/2};
            
            d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${r.y*2}px; margin-bottom: 4px`);

            let mask = rule.get('pattern') ? PatternMaker.Composer.build(rule.get('pattern')) : null;
            if (mask && mask.fn != PatternMaker.NONE) {
              svg.call(mask.fn);
            }
            
            let g = d3.select(this).append("g")
              .attr("flow-css", `margin-right: ${-r.x}px; width: ${r.x}px`);
            
            g.append("rect")
              .attr({
                "width": 2*r.x,
                "height": 2*r.y,
                "transform": d3lper.translate({tx: -r.x, ty: 0}),
                "stroke": "#CCCCCC",
                "fill": "none"
              });
            
            g.append("rect")
              .attr({
                "width": 2*r.x,
                "height": 2*r.y,
                "transform": d3lper.translate({tx: -r.x, ty: 0}),
                "fill": rule.get('color'),
                "mask": mask ? `url(${mask.fn.url()})` : null
              });
            
          }
          
          let g = d3.select(this).append("g")
            .attr("flow-css", `margin-top: ${-dy}`);
          
          g.append("text")
            .text( rule.get('label') )
            .attr({
              x: textOffset,
              y: r.y,
              dy: "0.3em",
              "font-size": "0.75em"
            })
          
        };

        //regroupe les intervales si l'écart est minime
        let compressIntervals = function(intervals) {
          return intervals.reduce( (arr, v) => {
            if (!arr.length || Math.abs(arr[arr.length-1] - v) > 0.0000001) {
              arr.push(v);
            }
            return arr;
          }, []);
        };
        
        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice(),
              fn;
          
          if (ValueMixin.Surface.detect(d.get('mapping'))) {
            fn = appendSurfaceIntervalLabel;
            intervals.push(d.get('mapping.extent')[1]); //push max
            intervals = compressIntervals(intervals);
          } else {
            if (d.get('mapping.scale.usesInterval')) {

              fn = appendSymbolIntervalLabel;
              intervals.push(d.get('mapping.extent')[1]); //push max
              
            } else {

              fn = appendSymbolIntervalLinearLabel;
              if (d.get('mapping.values').length > 2) {
                let steps = Math.min(d.get('mapping.values').length - 2, 5),
                    i = (d.get('mapping.extent')[1] - d.get('mapping.extent')[0]) / steps,
                    nearest = Array.from({length: steps-1}, (v, idx) => d.get('mapping.extent')[0] + i*(idx+1))
                      .reduce( (arr, v) => {
                        let nVal = Math.round(v);//d.get('mapping').findNearestValue(v);
                        /*if (arr.indexOf(nVal) === -1 && intervals.indexOf(nVal) === -1) {
                          arr.push(nVal);
                        }*/
                        arr.push(nVal);
                        return arr;
                      }, []);
                
                 //Array.prototype.splice.apply(intervals, [intervals.length - 1, 0].concat(nearest));
                 intervals = [d.get('mapping.extent')[0]]
                  .concat(nearest)
                  .concat(d.get('mapping.extent')[1]);
                 
              }
              
              intervals = compressIntervals(intervals);
              
            }
          }
          
          let sel = el.selectAll("g.interval")
            .data(intervals)
            .each(fn);
            
          sel.enter()
            .append("g")
            .classed("interval", true)
            .each(fn);
          
          sel.exit().remove();
          
          if (d.get('mapping.rules').length) {
            
            el.append("g")
              .attr("flow-css", "margin-top: 10; margin-bottom: 10")
              .append("line")
                .attr({
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  stroke: "#BBBBBB"
                });
            
          }
          
        }
        
        if (d.get('mapping.rules') && d.get('mapping.rules').length) {
          
          let sel = el.selectAll("g.rule")
            .data(d.get('mapping.rules').filter( r => r.get('visible') ).slice(0, 10))
            .each(appendRuleLabel);
            
          sel.enter()
            .append("g")
            .classed("rule", true)
            .each(appendRuleLabel);
            
          sel.exit().remove();
          
        }
        
      });
      
    };
    
    let sel = containerG.selectAll("g.legend-label")
      .data(this.get('graphLayers').filter( gl => gl.get('displayable') ))
      .call(bindLayer);
      
    sel.enter()
      .append("g")
      .classed("legend-label", true)
      .call(bindLayer);
      
    sel.exit().remove();
    
    containerG.call(d3lper.flow);
    
    Ember.run.later(() => {
      this.updateLegendPosition();
      this.updateLegendOpacity();
    });
    
  }.observes('graphLayout.showLegend', 'graphLayers.[]',
    'graphLayers.@each._defferedChangeIndicator')
  
  
});
