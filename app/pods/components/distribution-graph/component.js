import Ember from 'ember';
import d3 from 'npm:d3';
import PatternMaker from 'khartis/utils/pattern-maker';

const DISPLAY_METHOD = {
  CLASSES: "classes",
  CUMULATIVE: "cumulative"
};

const MAX_CLASSES = 15;

export {DISPLAY_METHOD};

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
  
  mapping: null,
  
  margin: {top: 16, right: 16, bottom: 56, left: 52, betweenBars: 2},
  
  xLabel: "valeurs",
  yLabel: "fréquences",

  zoom: 1,

  displayColors: true,

  method: DISPLAY_METHOD.CLASSES,
  
  draw: function() {
    
    let width = this.$().width(),
        height = this.$().height(),
        margin = this.get('margin');
    
    let stack = this.d3l()
			.append("g")
      .classed("stack", true);

    stack.append("rect")
      .classed("scrollable-background", true)
      .attrs({
        x: -this.get('margin.left'),
        y: -this.get('margin.top'),
        width: "100%",
        height: "100%",
        opacity: 0
      });
      
    stack.append("g")
      .attr("class", "grid");
    
    stack.append("g")
      .attr("class", "x axis");
      
    stack.append("g")
      .attr("class", "y axis");
    
    stack.append("g")
      .classed("bars", true);

    stack.append("g")
      .classed("line-graph", true);
    
    stack.append("g")
      .classed("fillIntervals", true);

    stack.append("g")
      .classed("intervals", true);
      
    // now add titles to the axes
    stack.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left/3*2.4) +","+((height - margin.top - margin.bottom)/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr("class", "axis-label y")
        .text(this.get('yLabel'));

    stack.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width-margin.left)/2) +","+(height-(margin.bottom/2) + 6)+")")  // centre below axis
        .attr("class", "axis-label x")
        .text(this.get('xLabel'));
    
    this.drawDistribution();
    this.enableZoom();
			
  }.on("didInsertElement"),

  enableZoom() {
    let zoom = d3.zoom()
      .scaleExtent([0.5, 1.5])
      .on('zoom', () => {
          this.set('zoom', d3.event.transform.k);
      });
      this.d3l().select("g.stack").call(zoom);
  },
  
  drawDistribution: function() {
    
    let dist = this.get('mapping.distribution'),
        colorScale = this.get('mapping').getScaleOf("color"),
        values = [...dist.values()],
        margin = this.get('margin'),
		    width = this.$().width() - margin.left - margin.right,
		    height = this.$().height() - margin.top - margin.bottom,
        bindAttr,
        sel;
        
		let stack = this.d3l().select("g.stack")
			.attr("transform", "translate("+margin.left+", "+margin.top+")");
	
    let ext = d3.extent(values.map( v => v.val )),
        maxClasses = Math.min(Math.floor(MAX_CLASSES*this.zoom), values.length),
        interval = (ext[1] - ext[0]) / maxClasses,
        bands = Array.from({length: maxClasses}, (v, i) => ext[0] + i*interval);
          //.filter( b => Math.abs(b) >= Math.abs(interval) );

    let data = bands
      .map(function(b, i) {
      
          return {
            val: b,
            qty: values.reduce( (s, c) => {
              return c.val >= b && c.val < b+interval+0.00000001 ? s+1 : s;
            }, 0)
          };
        
        });
    
    data.reduce(function(cumul, d) {
      return d.qtyC = (cumul += d.qty);
    }, 0);

    let x = d3.scaleLinear()
      .range([0, width])
      .domain(ext)
      .clamp(true);

    let bx = d3.scalePoint()
      .range([0, width], 0)
      .domain(data.map( c => c.val )); //=0 si < interval
    
		let y = d3.scaleLinear()
      .range([height, 0]);
			
    if (this.get('method') === DISPLAY_METHOD.CLASSES) {
      
      y.domain([0, Math.floor(d3.max(data, (v) => v.qty ))+2]);

      bindAttr = (_) => {
          _.attrs({
            x: d => x(d.val),
            y: d => y(d.qty),
            width: d => x(d.val + interval) - x(d.val),
            height: d => height - y(d.qty)
          })
        };
        
      sel = stack.select("g.bars")
        .selectAll("rect.bar")
        .data(data)
        .call(bindAttr);
        
      sel.enter()
        .append("rect")
        .call(bindAttr)
        .classed("bar", true);
      
      sel.exit().remove();

    } else {
      stack.select("g.bars")
        .selectAll("rect.bar")
        .remove();
    }

    if (this.get('method') === DISPLAY_METHOD.CUMULATIVE) {

      y.domain([0, Math.floor(d3.max(data, (v) => v.qtyC ))+2]);

      let valueLine = d3.line()
        .x( d => bx(d.val) )
        .y( d => y(d.qtyC) );

      bindAttr = (_) => {
          _.attrs({
            d: d => valueLine(d)
          });
        };
        
      sel = stack.select("g.line-graph")
        .selectAll("path.line")
        .data([data])
        .call(bindAttr);
        
      sel.enter()
        .append("path")
        .call(bindAttr)
        .classed("line", true);
      
      sel.exit().remove();

    } else {
      stack.select("g.line-graph")
        .selectAll("path.line")
        .remove();
    }

    let xAxis = d3.axisBottom()
      .scale(x)
      .tickValues(bands)
      .tickFormat(d3.format(".2s"));
			
		let yAxis = d3.axisLeft()
      .scale(y)
      .ticks(Math.min(10, y.domain()[1]));
			
    stack.select("g.x.axis")
      .attr("transform", "translate(0," + (height+2) + ")")
      .call(xAxis);
	
		stack.select("g.y.axis")
		  .attr("transform", "translate(-3, 0)")
		  .call(yAxis);
		
    /* intervals */

    let intervalsData = this.get('mapping.intervals').map( v => ({val: v}) ),
        fillIntervals = this.displayColors ? [{val: ext[0]}].concat(intervalsData) : [];
        
    bindAttr = (_) => {
        _.attrs({
          x: d => x(d.val),
          y: -this.get('margin.top') + 2,
          height: this.get('margin.top') - 4,
          width: (d, i) => (i < fillIntervals.length - 1 ? x(fillIntervals[i+1].val) : width) - x(d.val),
          fill: d => {
            let pattern = this.get('mapping').getScaleOf("texture")(d.val),
                fill = colorScale(d.val);
            
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, fill);
              fn.init(this.d3l());
              return `url(${fn.url()})`;
            } else {
              return fill;
            }
          }
        });
      };

    sel = stack.select("g.fillIntervals")
      .selectAll("rect.fillClasses")
      .data(fillIntervals)
      .call(bindAttr);
      
    sel.enter()
      .append("rect")
      .call(bindAttr)
      .classed("fillClasses", true);
    
    sel.exit().remove();
    
    bindAttr = (_) => {
        _.attrs({
          x1: (d) => x(d.val),
          x2: (d) => x(d.val),
          y1: -this.get('margin.top') + 2,
          y2: height+2
        }).styles({
          "stroke-width": (d) => d.val == this.get('mapping.scale.valueBreak') ? "2px" : "1px"
        })
      };

    sel = stack.select("g.intervals")
      .selectAll("line.interval")
      .data(intervalsData)
      .call(bindAttr);
      
    sel.enter()
      .append("line")
      .call(bindAttr)
      .classed("interval", true);
    
    sel.exit().remove();

    /* ticks orientation */
    stack.selectAll(".x.axis text")
      .attr("transform", function(d) {
          return "rotate(-90)translate(-20," + (this.getBBox().height-4)*-1 + ")";
      });
    
    /*draw grid*/
    
    bindAttr = (_) => {
      _.attrs({
        transform: d => d3.select(d).attr("transform")
      });
    };
    
    sel = stack.select(".grid")
      .selectAll(".grid-el")
      .data(stack.selectAll(".y.axis .tick").nodes())
      .call(bindAttr);
      
    sel.enter()
      .append("g")
      .classed("grid-el", true)
      .call(bindAttr)
      .append("line")
      .attrs({
        x2: width,
        y2: 0
      });
    
    sel.exit().remove();
    
  }.observes('mapping._defferedChangeIndicator', 'displayColors', 'method', 'zoom'),

  labelChange: function() {
    this.d3l().select(".axis-label.x")
      .text(this.get('xLabel'));
    this.d3l().select(".axis-label.y")
      .text(this.get('yLabel'));
  }.observes("xLabel", "yLabel")
  
});
