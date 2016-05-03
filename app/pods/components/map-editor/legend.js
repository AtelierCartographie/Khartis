import Ember from 'ember';
import d3lper from 'mapp/utils/d3lper';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import ValueMixin from 'mapp/models/mapping/mixins/value';

export default Ember.Mixin.create({
  
  legendInit: function() {
    
    let legendG = this.d3l().append("g")
      .classed("legend", true);
    
    //LEGEND DRAG
    var drag = d3.behavior.drag()
      .origin(() => {
        return {x: legendG.attr('tx'), y: legendG.attr('ty')};
      })
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        legendG.classed("dragging", true);
      })
      .on("drag", () => {
        let bbox = this.d3l().select(".map").node().getBBox(),
            pos = {
              tx: Math.min(bbox.width, Math.max(d3.event.x, -bbox.width)),
              ty: Math.min(bbox.height, Math.max(d3.event.y, -bbox.height))
            };
        legendG.attr({
         'transform': d3lper.translate(pos), 
          tx: pos.tx,
          ty: pos.ty
        });
      })
      .on("dragend", () => {
        legendG.classed("dragging", false);
        this.get('graphLayout').setProperties({
          legendTx: legendG.attr('tx'),
          legendTy: legendG.attr('ty')
        });
        this.sendAction('onAskVersioning', "freeze");
      });
      
    legendG.call(drag);
    console.log("init");
    this.updateLegendPosition();
    
  },
  
  updateLegendPosition: function() {
    
    let legendG = this.d3l().select(".legend"),
        t = {tx: this.get('graphLayout.legendTx'), ty: this.get('graphLayout.legendTy')};
    
    if (this.get('graphLayout.legendTx') === null || this.get('graphLayout.legendTy') === null) {
      
      console.log(legendG);
      let bbox = legendG.node().getBBox(),
          w = Math.max(this.get('$width'), this.get('graphLayout.width')),
		      h = Math.max(this.get('$height'), this.get('graphLayout.height'));
      
      t.tx = (w - bbox.width) / 2;
      t.ty = h - this.get('graphLayout').vOffset(h) - bbox.height;
      
    }
    
    legendG.attr("tx", this.get('graphLayout.legendTx'))
      .attr("ty", this.get('graphLayout.legendTy'))
      .attr("transform", d3lper.translate(t));
    
  }.observes('graphLayout.legendTx', 'graphLayout.legendTy'),
  
  drawLegend: function() {
    
    let svg = this.d3l(),
        layers = this.get('graphLayers'),
        width = layers.length * 120;
    
    let sel = this.d3l().selectAll("g.legend")
      .style({
        opacity: this.get('graphLayout.showLegend') ? 0.9 : 0
      });
    
    
    let container = sel.append("g")
      .attr("flow-css", "flow: horizontal; padding-left: 5; height: 500; width: "+width);
      
    container.append("rect")
        .attr({
          "flow-css": "layout: fill; padding-left: 20; padding-top: 10; padding-right: 10; padding-bottom: 10",
          "x": 0,
          "y": 0
        })
        .attr("fill", "white");
    
    let bindLayer = (_) => {
      
      _.attr("flow-css", "flow: vertical; stretch: true; layout: fluid; margin-top: 16");
      
      _.each( function(d, i) {
        
        if (!d.get('displayable')) {
          return;
        }
        
        let el = d3.select(this),
            textOffset = 24,
            label = el.selectAll("text.title");
        
        if (label.empty()) {
          label = el.append("g")
            .attr("flow-css", "margin-bottom: 16")
            .append("text")
            .style({
             "font-size": "14px",
             "font-weight": "bold"
            })
            .call(d3lper.wrapText, 30);
        }
        
        label.text(d.get('mapping.varCol.header.value'));
          
        let appendSurfaceIntervalLabel = function(val, i) {
          
          let formatter = d3.format("0.2f"),
              r = {x: 24/2, y: 16/2};
              
          let g = d3.select(this).append("g");
          
          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              "fill": "none",
              "stroke": "#CCCCCC"
            });
          
          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              "fill": d.get('mapping').getScaleOf('color')(val - 0.0000001),
              "mask": () => {
                
                let mask = d.get('mapping').getScaleOf("texture")(val - 0.0000001)
                if (mask && mask.fn != PatternMaker.NONE) {
                  svg.call(mask.fn);
                  return `url(${mask.fn.url()})`;
                } else {
                  return null;
                }
              },
              stroke: "#F0F0F0"
            });
            
          g = d3.select(this).append("g");
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: -r.x,
              y1: -2,
              x2: textOffset - 6 - r.x,
              y2: -2,
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset - r.x,
                y:  -2,
                "font-size": "0.75em"
              });
            
          }
          
          g.append("line").attr({
              x1: -r.x,
              y1: 2*r.y + 2,
              x2: textOffset - 6 - r.x,
              y2: 2*r.y + 2,
              stroke: "black"
            });
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset - r.x,
              y: 2*r.y + 2,
              "font-size": "0.75em"
            });
          
        };
        
        let appendSymbolIntervalLabel = function(val, i) {
          
          let formatter = d3.format("0.2f"),
              r = {x: d.get('mapping').getScaleOf('size')(val - 0.0000001), y: d.get('mapping').getScaleOf('size')(val - 0.0000001)};
          
          let symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});
      
          symbol.call(svg);
          
          let g = d3.select(this).append("g");
          
          g.append("use")
            .attr({
              "xlink:href": symbol.url(),
              "width": r.x*2,
              "height": r.y*2,
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "stroke-width": symbol.scale(d.get('mapping.visualization.stroke'), r.x*2),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.0000001)
            });
            
          g = d3.select(this).append("g");
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: -r.x,
              y1: -2,
              x2: textOffset - 6 - r.x,
              y2: -2,
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset - r.x,
                y: -2,
                "font-size": "0.75em"
              });
            
          }
          
          if (!(i === 0 && d.get('mapping.scale.intervalType') === "linear")) {
          
            g.append("line").attr({
                x1: -r.x,
                y1: 2*r.y + 2,
                x2: textOffset - 6 - r.x,
                y2: 2*r.y + 2,
                stroke: "black"
              });
            
            g.append("text")
              .text( v => formatter(v) )
              .attr({
                x: textOffset - r.x,
                y: 2*r.y + 2,
                "font-size": "0.75em"
              });
              
          }
          
        };
        
        let appendRuleLabel = function(rule, i) {
          
          let r;
          
          if (d.get('mapping.visualization.type') === "symbol") {
            
            r = {x: d.get('mapping.visualization.minSize'), y: d.get('mapping.visualization.minSize')};
            let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape');
            
            let symbol = SymbolMaker.symbol({name: shape});
      
            symbol.call(svg);
            
            let g = d3.select(this).append("g");
            
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
            
            let mask = rule.get('pattern') ? PatternMaker.Composer.build(rule.get('pattern')) : null;
            if (mask && mask.fn != PatternMaker.NONE) {
              svg.call(mask.fn);
            }
            
            let g = d3.select(this).append("g");
            
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
          
          let g = d3.select(this).append("g");
          
          g.append("line").attr({
              x1: -r.x,
              y1: r.y,
              x2: textOffset - 6 - r.x,
              y2: r.y,
              stroke: "black"
            });
          
          g.append("text")
            .text( rule.get('label') )
            .attr({
              x: textOffset - r.x,
              y: r.y,
              "font-size": "0.75em"
            })
          
        };
        
        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice();
          
          if (!d.get('mapping.scale.intervalType') === "linear") {
            intervals.push(d.get('mapping.extent')[1]); //push max
          }
          
          let sel = el.selectAll("g.interval")
            .each(ValueMixin.Surface.detect(d.get('mapping')) ? appendSurfaceIntervalLabel : appendSymbolIntervalLabel)
            .data(intervals);
            
          sel.enter()
            .append("g")
            .classed("interval", true)
            .attr("flow-css", "flow: horizontal; stretch: true;")
            .each(ValueMixin.Surface.detect(d.get('mapping')) ? appendSurfaceIntervalLabel : appendSymbolIntervalLabel);
          
          sel.exit().remove();
          
          if (d.get('mapping.rules')) {
            
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
        
        if (d.get('mapping.rules')) {
          
          let sel = el.selectAll("g.rule")
            .each(appendRuleLabel)
            .data(d.get('mapping.rules').filter( r => r.get('visible') ).slice(0, 10));
            
          sel.enter()
            .append("g")
            .classed("rule", true)
            .attr("flow-css", (r, i) => `flow: horizontal; stretch: true; margin-top: ${ i > 0 ? 4 : 0 }` )
            .each(appendRuleLabel);
            
          sel.exit().remove();
          
        }
        
      });
      
    };
    
    sel = container.selectAll("g.legend-label")
      .data(this.get('graphLayers'))
      .call(bindLayer);
      
    sel.enter()
      .append("g")
      .classed("legend-label", true)
      .call(bindLayer);
      
    sel.exit().remove();
    
    container.call(d3lper.flow);
    
    //this.updateLegendPosition();
    
  }.observes('graphLayout.showLegend', 'graphLayers.[]', 'graphLayers.@each._defferedChangeIndicator')
  
  
});
