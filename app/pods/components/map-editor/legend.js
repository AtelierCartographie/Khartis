import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import {default as flowCss, parseCss, cssPx} from 'khartis/utils/flow-css';
import PatternMaker from 'khartis/utils/pattern-maker';
import SymbolMaker from 'khartis/utils/symbol-maker';
import ValueMixin from 'khartis/models/mapping/mixins/value';
import TextEditor from './text-editor/component';
import {compressIntervals} from 'khartis/utils/stats';

export default Ember.Mixin.create({
  
  resizingMargin: false,

  legendInit() {

    let legendG = this.d3l().append("g")
      .classed("legend", true);
    
    //LEGEND DRAG
    let drag = d3.drag()
      .filter(function() {
        return !$(d3.event.target).hasClass("no-drag") && !$(d3.event.target).parents(".no-drag").length;
      })
      .subject(() => {
        return {x: legendG.attr('kis:kis:tx'), y: legendG.attr('kis:kis:ty')};
      })
      .on("start", () => {
        d3.event.sourceEvent.stopPropagation();
        legendG.classed("dragging", true);
        this.set('resizingMargin', true);
      })
      .on("drag", () => {
        let bbox = this.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bbox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bbox.height-10, Math.max(d3.event.y, 0))
            };
        legendG.attrs({
         'transform': d3lper.translate(pos), 
          "kis:kis:tx": pos.tx,
          "kis:kis:ty": pos.ty
        });
      })
      .on("end", () => {
        legendG.classed("dragging", false);
        this.set('resizingMargin', false);
        let t = this.getViewboxTransform()({
          x: legendG.attr('kis:kis:tx'),
          y: legendG.attr('kis:kis:ty')
        });
        this.get('graphLayout').setProperties({
          legendTx: t.x,
          legendTy: t.y
        });
        this.sendAction('onAskVersioning', "freeze");
      });
    
    this.drawLegend();
    legendG.call(drag);
    this.updateLegendOpacity();
    
  },
  
  updateLegendPosition: function() {
    
    let legendG = this.d3l().select("g.legend"),
        legendContentG = legendG.select("g.legend-content"),
        t = {x: this.get('graphLayout.legendTx'), y: this.get('graphLayout.legendTy')};
    
    if (!legendG.node()) {
      return;
    }
    
    let autoMargin = !this.get('graphLayout.margin.manual'),
        bbox = legendG.node().getBBox(),
        {w, h} = this.getSize();

    if (!legendContentG.empty()) {

      if (t.x === null || t.y === null) {
        
        let vPadding = 16;
        t.x = (w - bbox.width) / 2;

        if (autoMargin) {
          this.set('graphLayout.margin.b', 
            Math.min(
              this.get('graphLayout.height')*0.33,
              bbox.height+2*vPadding+this.get('graphLayout.margin').getInitialValue('b')
              )
            );
          t.y = h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + vPadding;
        } else {
          //fix tx, ty
          t.y = h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + vPadding;
          this.get('graphLayout').setProperties({
              legendTx: t.x,
              legendTy: t.y
            });
        }
        
      } else {
        t = this.getViewboxTransform().invert(t);
      }

      legendG.attrs({
        "kis:kis:tx": t.x,
        "kis:kis:ty": t.y,
        "transform": d3lper.translate({tx: t.x, ty: t.y})
      });

      let padding = 12,
          contentBox = legendContentG.node().getBBox();
      
      legendG.select("rect.legend-bg")
        .attrs({
          x: contentBox.x - padding,
          y: contentBox.y - padding,
          width: contentBox.width + 2*padding,
          height: contentBox.height + 2*padding,
        });
        
    } else {
      if (autoMargin) {
        this.get('graphLayout.margin').resetValue('b');
      }
    }
    
  }.observes('$width', '$height',
    'graphLayout.legendTx', 'graphLayout.legendTy',
    'graphLayout.width', 'graphLayout.height', 'graphLayout.margin.manual'),
  
  updateLegendOpacity: function() {
    
    this.d3l().selectAll("g.legend rect.legend-bg")
      .style("opacity", this.get('graphLayout.legendOpacity'));
      
  }.observes('graphLayout.legendOpacity'),
  
  drawLegend: function() {

    let self = this,
        svg = this.d3l(),
        layers = this.get('graphLayers'),
        d3Locale = d3lper.getLocale(this.get('i18n')),
        width = layers.length * 120,
        legendG = this.d3l().selectAll("g.legend"),
        containerG = legendG.selectAll("g.legend-content"),
        bgG = legendG.selectAll("rect.legend-bg");
    
    if (!this.get('graphLayout.showLegend') || !this.get('graphLayers').length) {
      containerG.remove();
      bgG.remove();
      this.updateLegendPosition();
      return;
    }
    
    if (bgG.empty()) {
      bgG = legendG.append("rect")
        .classed("legend-bg", true)
        .attrs({
          "x": -18,
          "y": -5
        })
        .attr("stroke", "#F0F0F0")
        .attr("fill", "white");
    }
    
    if (containerG.empty()) {
      containerG = legendG.append("g")
        .classed("legend-content", true);
    }
    
    containerG.attr("kis:kis:flow-css", "flow: horizontal; padding-left: 5; height: 500; width: "+width);  
    
    let bindLayer = (_) => {
      
      _.attr("kis:kis:flow-css", "flow: vertical; stretch: true; margin-right: 34; margin-top: 16");
      
      _.each( function(d, i) {
        
        let el = d3.select(this),
            xOrigin = (d.get('mapping.visualization.type') === "symbol" ?
              SymbolMaker.symbol({name: d.get('mapping.visualization.shape'), size: d.get('mapping.visualization.maxSize')}).getSize().x : 10),
            textOffset = xOrigin + 16,
            formatter = d3Locale.format(`0,.${d.get('mapping.maxValuePrecision')}f`);

        el.selectAll("*").remove();
          
        let label = el.append("g")
          .attr("kis:kis:flow-css", "margin-bottom: 16")
          .classed("no-drag", true)
          .append("text")
          .attr("kis:kis:flow-css", "wrap-text: true; max-width: 350px")
          .classed("legend-title", true)
          .attr("transform", d3lper.translate({tx: -xOrigin/2}))
          .styles({
            "font-size": "14px",
            "font-weight": "bold"
          });
        
        label.text(d.get('legendTitleComputed'));

        label.on("click", function() {
          if (d3.event.defaultPrevented) return;
          TextEditor.showAt("legend-title-editor", this, d.get('legendTitleComputed'), function(val) {
            d.set('legendTitle', val);
          });
        });
          
        //re-calcul de l'offset du texte si il y a des rules symboles
        if (d.get('mapping.rules') && d.get('mapping.rules').length && d.get('mapping.visualization.type') === "symbol") {
          xOrigin = Math.max.apply(null, [xOrigin].concat(d.get('mapping.rules').map( r => r.get('size') )));
          textOffset = xOrigin + 16;
        }

        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice(),
              fn;
          
          if (ValueMixin.Surface.detect(d.get('mapping'))) {
            fn = self.appendSurfaceIntervalLabel;
            intervals = compressIntervals(intervals, d.get('mapping.extent'));
            intervals.push(d.get('mapping.extent')[1]); //push max
          } else {
            if (d.get('mapping.scale.usesInterval')) {
              fn = self.appendSymbolIntervalLabel;
            } else {
              fn = self.appendSymbolIntervalLinearLabel;
            }
            intervals = d.get('mapping').getLegendIntervals();
          }
          
          if (d.get('mapping.visualization.shape') === "bar") {
            self.appendBarIntervals(el, intervals, d, formatter);
          } else {
            el.selectAll("g.row")
              .data(intervals)
              .enterUpdate({
                enter: (sel) => sel.append("g").classed("row", true),
                update: (sel) => sel.eachWithArgs(fn, d, textOffset, formatter)
              });
          }
            
          if (d.get('mapping.rules').length) {
            
            el.append("g")
              .attr("kis:kis:flow-css", "margin-top: 10; margin-bottom: 10")
              .append("line")
                .attrs({
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  stroke: "#BBBBBB"
                });
            
          }
          
        }
        
        if (d.get('mapping.rules') && d.get('mapping.rules').length) {
          el.selectAll("g.rule")
            .data(d.get('mapping.rules').filter( r => r.get('visible') ).slice(0, 10))
            .enterUpdate({
              enter: (sel) => sel.append("g").classed("rule", true),
              update: (sel) => sel.eachWithArgs(self.appendRuleLabel, d, textOffset, formatter)
            });
        }
        
      });
      
    };
    
    containerG.selectAll("g.legend-label")
      .data(this.get('graphLayers').filter( gl => gl.get('displayable') ))
      .enterUpdate({
        enter: (sel) => sel.append("g").classed("legend-label", true),
        update: (sel) => sel.call(bindLayer)
      })
    
    containerG.call(flowCss);
    
    Ember.run.later(() => {
      this.updateLegendPosition();
      this.updateLegendOpacity();
    });
    
  }.observes('i18n.locale', 'graphLayout.showLegend', 'graphLayers.[]',
    'graphLayers.@each._defferedChangeIndicator'),


  appendSurfaceIntervalLabel(d, textOffset, formatter, val, i) {
          
    let r = {x: 24/2, y: 16/2};

    d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; stretch: true; height: ${2*r.y}px; index: ${i}; margin-top: ${ i > 0 ? 0 : 0 }px`);
        
    let g = d3.select(this).append("g")
      .attr("kis:kis:flow-css", `margin-right: -${r.x}px`);
    
    //border
    g.append("rect")
      .attrs({
        "transform": d3lper.translate({tx: -r.x, ty: 0}),
        "width": 2*r.x,
        "height": 2*r.y,
        y: 0,
        "stroke-width": 1,
        "stroke": "black",
        fill: "none" 
      });

    g.append("rect")
      .attrs({
        "transform": d3lper.translate({tx: -r.x, ty: 0}),
        "width": 2*r.x,
        "height": 2*r.y,
        y: 0,
        "opacity": d.get('opacity'),
        "fill": () => {
          
          let pattern = d.get('mapping').getScaleOf("texture")(val - 0.000000001),
              color = d.get('mapping').getScaleOf("color")(val - 0.000000001);

          if (pattern && pattern.fn != PatternMaker.NONE) {
            let fn = new pattern.fn(false, color);
            fn.init(svg);
            return `url(${fn.url()})`;
          } else {
            return color;
          }
        },
        "stroke-width": 0
      });
      
    g = d3.select(this).append("g");
      
    if (i === 0) {
      
      g.append("text")
        .text( formatter(d.get('mapping.extent')[0]) )
        .attrs({
          x: textOffset - 12,
          y:  0,
          dy: "0.3em",
          "font-size": "0.75em"
        });
      
    }
    
    g.append("text")
      .text( v => formatter(v) )
      .attrs({
        x: textOffset - 12,
        y: 2*r.y,
        dy: "0.3em",
        "font-size": "0.75em"
      });
      
  },

  appendSymbolIntervalLinearLabel(d, textOffset, formatter, val, i) {
        
    let r, dy;

    if (val !== d.get('mapping.scale.valueBreak')) {

      let symbol = SymbolMaker.symbol({
          name: d.get('mapping.visualization.shape'),
          size: d.get('mapping').getScaleOf('size')(val)*2,
          barWidth: d.get('mapping.visualization.barWidth')
        });

      r = symbol.getSize();

      if (!(r.x > 0 && r.y > 0)) return;

      let symH = Math.max(r.y + d.get('mapping.visualization.stroke'), 12);
        
      dy = r.y + d.get('mapping.visualization.stroke') - symH;

      d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; stretch: true; height: ${symH}px; margin-bottom: 4px`);

      let g = d3.select(this).append("g")
        .attr("kis:kis:flow-css", `margin-right: ${-r.anchorX}; width: ${r.anchorX}px`);

      let symG = g.append("g")
        .attr("transform", d3lper.translate({ty: r.anchorY - dy/2}));

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": d.get('mapping.visualization.strokeColor'),
          "fill": d.get('mapping').getScaleOf('color')(val),
          "opacity": d.get('opacity')
        });
    } else {
      r = {x: 20, y: 12, anchorY: 12};
      dy = 0;
      d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; stretch: true; height: ${2*r.y}px; margin-bottom: 4px`);

      let g = d3.select(this).append("g")
        .attr("kis:kis:flow-css", `margin-right: ${-r.x}; width: ${r.x}px`);

      g.append("line")
        .attrs({
          x1: 0,
          y1: r.y - dy/2,
          x2: r.x,
          y2: r.y - dy/2,
          stroke: "#BBBBBB"
        });
    }

    d3.select(this).append("g")
      .append("text")
      .text( v => formatter(v) )
      .attrs({
        x: textOffset,
        y: r.anchorY - dy/2,
        dy: "0.3em",
        "font-size": "0.75em"
      });
        
  },

  appendSymbolIntervalLabel(d, textOffset, formatter, val, i) {
        
    let symbol = SymbolMaker.symbol({
          name: d.get('mapping.visualization.shape'),
          size: d.get('mapping').getScaleOf('size')(val)*2,
          barWidth: d.get('mapping.visualization.barWidth')
        }),
        r = symbol.getSize();

    let symH = Math.max(r.y + d.get('mapping.visualization.stroke'), 12),
        dy = r.y + d.get('mapping.visualization.stroke') - symH;

    d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; stretch: true; height: ${symH}px; margin-bottom: 4px`);

    if (!(r.x > 0 && r.y > 0)) return;

    let g = d3.select(this).append("g")
      .attr("kis:kis:flow-css", `margin-right: ${-r.anchorX}px; width: ${r.anchorX}px`);
    
    let symG = g.append("g")
      .attr("transform", d3lper.translate({ty: r.anchorY+d.get('mapping.visualization.stroke')/2 - dy/2}));

    symbol.insert(symG)
      .attrs({
        "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
        "i:i:stroke-width": d.get('mapping.visualization.stroke'),
        "stroke": d.get('mapping.visualization.strokeColor'),
        "fill": d.get('mapping').getScaleOf('color')(val),
        "opacity": d.get('opacity')
      });
      
    g = d3.select(this).append("g");
      
    if (i === 0) {
      
      g.append("line").attrs({
        x1: 0,
        y1: -2,
        x2: textOffset - 6,
        y2: -2,
        stroke: "black"
      });
      
      g.append("text")
        .text( formatter(d.get('mapping.extent')[1]) )
        .attrs({
          x: textOffset,
          y: -2,
          dy: "0.3em",
          "font-size": "0.75em"
        });
      
    }
    
    g.append("line").attrs({
        x1: 0,
        y1: Math.max(symH+2, 10),
        x2: textOffset - 6,
        y2: Math.max(symH+2, 10),
        stroke: "black"
      });
    
    g.append("text")
      .text( v => formatter(v) )
      .attrs({
        x: textOffset,
        y: Math.max(symH+2, 10),
        dy: "0.3em",
        "font-size": "0.75em"
      });
  },

  appendBarIntervals(el, intervals, d, formatter) {

    let g = el.append("g").classed("row", true),
        barG = g.append("g").classed("bars", true),
        axisG = g.append("g").classed("axis", true),
        maxHeight = 0,
        minHeight = 0;

    let appendBarSymbol = function(val, i) {

      let sign = Math.sign(val) || 1,
          symbol = SymbolMaker.symbol({
            name: d.get('mapping.visualization.shape'),
            size: d.get('mapping').getScaleOf('size')(val)*2,
            barWidth: d.get('mapping.visualization.barWidth'),
            sign
          });

      let r = symbol.getSize();

      if (!(r.x > 0 && r.y > 0)) return;

      let symH = r.y + d.get('mapping.visualization.stroke');
        
      let dy = r.y + d.get('mapping.visualization.stroke') - symH;

      d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; height: ${symH}px; margin-right: 2px`);

      let symG = d3.select(this).append("g");

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": d.get('mapping.visualization.strokeColor'),
          "fill": d.get('mapping').getScaleOf('color')(val),
          "opacity": d.get('opacity')
        });

        maxHeight = Math.max(maxHeight, -sign*symH);
        minHeight = Math.min(minHeight, -sign*symH);

    };

    let customScale = function() {
      let transform = d.get('mapping').getScaleOf('size'),
          domain = d3.extent(intervals),
          range = [maxHeight, minHeight];
      function scale(x) {
        console.log(transform(0));
        return -Math.sign(x)*transform(x-Math.sign(x)*0.0000001)*2;
      }
      scale.invert = function(x) {
        return transform.invert(x/2);
      };
      scale.domain = function() {
        return domain;
      };
      scale.range = function() {
        let vals = [0, ...intervals, d.get('mapping.extent')[1]];
        return d3.extent(vals).map(scale);
      };
      scale.ticks = function(n) {
        let range = d3.extent(scale.range()),
            ints, scaledInts;

        if (transform.invert) {
          let h = 0;
          for (++n; h < 13 && n > 2; n--) {
           h = (range[1]-range[0])/(n-2);
          }
          scaledInts = Array.from({length: n}, (v, i) => range[0]+i*h);
          ints = scaledInts.map( y => (y < 0 ? 1: -1) * scale.invert(y) );
          if (d.get('mapping.scale.diverging')) {
            ints.push(d.get('mapping.scale.valueBreak'));
          }
        } else {
          ints = [...intervals, d.get('mapping.extent')[1]];
          scaledInts = ints.map( x => scale(x) );
        }

        //remove duplicates scaled values, and scaled values too close to 0
        ints = scaledInts.reduce( (out, x, i, arr) => {
            if (arr.slice(i+1).indexOf(x) === -1 && Math.abs(x) > 12) {
              out.push(ints[i]);
            }
            return out;
          }, [] );
        return compressIntervals([0, ...ints]);
      };
      scale.tickFormat = function() {
        return formatter;
      };
      scale.copy = function() {
        return customScale();
      };
      return scale;
    }

    barG.selectAll(".bar")
      .data(intervals)
      .enterUpdate({
        enter: (sel) => sel.append("g").classed("bar", true),
        update: (sel) => sel.each(appendBarSymbol)
      });

    //set axis
    let yAxis = d3.axisRight()
      .scale(customScale())
      .ticks(6);

    axisG.attr("transform", "translate(-3, 0)")
		  .call(yAxis);

    /*//add value break axis
    let rValueBreak = d.get('mapping').getScaleOf('size')(d.get('mapping.scale.valueBreak'))*2;
    g.append("line")
      .attrs({
        x1: 0,
        y1: -rValueBreak,
        x2: 100,
        y2: -rValueBreak,
        stroke: "black"
      });*/
    console.log(minHeight, maxHeight);
    let width = intervals.length * (d.get('mapping.visualization.barWidth')+2);
    barG.attr("kis:kis:flow-css", `flow: horizontal; width: ${width}px`);
    axisG.attr("kis:kis:flow-css", `margin-left: 5px`);
    g.attr("kis:kis:flow-css", `flow: horizontal; height: ${maxHeight-minHeight}; width: ${width+20}px; margin-top: ${-minHeight+10}px`);
    el.attr("kis:kis:flow-css", `flow: vertical; width: ${width+48}px; margin-right: 34; margin-top: 16`);
  },

  appendRuleLabel(d, textOffset, formatter, rule, i) {

    let converter = d.get('mapping.ruleFn').bind(d.get('mapping')),
        r;

    if (d.get('mapping.visualization.type') === "symbol") {

      let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape'),
          symbol = SymbolMaker.symbol({
            name: shape,
            size: rule.get('size')*2,
          });
      
      r = symbol.getSize();

      let symH = r.y + d.get('mapping.visualization.stroke');
      
      d3.select(this).attr("kis:kis:flow-css", `flow: horizontal; height: ${symH}px; stretch: true; margin-bottom: 4px`);

      let g = d3.select(this).append("g")
        .attr("kis:kis:flow-css", `margin-right: ${-r.anchorX}px; width: ${r.anchorX}px`);
      
      let symG = g.append("g")
        .attr("transform", d3lper.translate({ty: r.anchorY}));

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": rule.get('strokeColor'),
          "fill": rule.get('color'),
          "opacity": d.get('opacity')
        });
        
    } else {
      
      r = {x: 24/2, y: 16/2};
      
      d3.select(this).attr("kis:kisflow-css", `flow: horizontal; stretch: true; height: ${r.y*2}px; margin-bottom: 4px`);
      
      let pattern = converter(rule, "texture");
      
      let g = d3.select(this).append("g")
        .attr("kis:kisflow-css", `margin-right: ${-r.x}px; width: ${r.x}px`);
      
      g.append("rect")
        .attrs({
          "width": 2*r.x,
          "height": 2*r.y,
          "transform": d3lper.translate({tx: -r.x, ty: 0}),
          "stroke": "#CCCCCC",
          "fill": "none"
        });
      
      g.append("rect")
        .attrs({
          "width": 2*r.x,
          "height": 2*r.y,
          "transform": d3lper.translate({tx: -r.x, ty: 0}),
          "fill": () => {
          
            let color = rule.get('color');
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, color);
              fn.init(svg);
              return `url(${fn.url()})`;
            } else {
              return color;
            }

          }
        });
      
    }
    
    d3.select(this).append("g")
      .append("text")
      .text( rule.get('label') )
      .attrs({
        x: textOffset,
        y: r.y,
        dy: "0.3em",
        "font-size": "0.75em"
      });
    
  }
});
