import Ember from 'ember';

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
  
  draw: function() {
    
    let width = this.$().width(),
        height = this.$().height(),
        margin = this.get('margin');
    
    let stack = this.d3l()
			.append("g")
      .classed("stack", true);
      
    stack.append("g")
      .attr("class", "grid");
    
    stack.append("g")
      .attr("class", "x axis");
      
    stack.append("g")
      .attr("class", "y axis");
    
    stack.append("g")
      .classed("bars", true);
    
    stack.append("g")
      .classed("fillIntervals", true);

    stack.append("g")
      .classed("intervals", true);
      
    // now add titles to the axes
    stack.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left/3*2) +","+((height - margin.top - margin.bottom)/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr("class", "axis-label y")
        .text(this.get('yLabel'));

    stack.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width-margin.left)/2) +","+(height-(margin.bottom/2) + 2)+")")  // centre below axis
        .attr("class", "axis-label x")
        .text(this.get('xLabel'));
    
    this.drawDistribution();
			
  }.on("didInsertElement"),
  
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
        maxClasses = Math.min(16, values.length),
        interval = (ext[1] - ext[0]) / maxClasses,
        bands = Array.from({length: maxClasses}, (v, i) => ext[0] + i*interval);

    let data = bands
      .map(function(b, i) {
      
        return {
          val: b,
          qty: values.reduce( (s, c) => {
            return c.val > b-interval && c.val <= b ? s+1 : s;
          }, 0)
        };
        
      });


    let x = d3.scale.linear()
      .range([0, width])
      .domain(ext)
      .clamp(true);

    let bx = d3.scale.ordinal()
      .rangeRoundBands([0, width])
      .domain(data.map( c => c.val ));
      
		let y = d3.scale.linear()
      .range([height, 0])
      .domain([0, Math.floor(d3.max(data, (v) => v.qty ))+1]);
			
		let xAxis = d3.svg.axis()
      .scale(bx)
      .tickFormat(d3.format(".2s"))
      .orient("bottom");
			
		let yAxis = d3.svg.axis()
      .scale(y)
      .ticks(Math.min(10, y.domain()[1]))
      .orient("left");
			
    stack.select("g.x.axis")
      .attr("transform", "translate(0," + (height+2) + ")")
      .call(xAxis);
	
		stack.select("g.y.axis")
		  .attr("transform", "translate(-3, 0)")
		  .call(yAxis);
      
		bindAttr = (_) => {
        _.attr({
          x: d => bx(d.val),
          y: d => y(d.qty),
          width: bx.rangeBand(),
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
		
    /* intervals */

    let intervalsData = this.get('mapping.intervals').map( v => ({val: v}) ),
        fillIntervals = [{val: ext[0]}].concat(intervalsData);

    console.log(intervalsData);

    bindAttr = (_) => {
        _.attr({
          x: d => x(d.val),
          y: -this.get('margin.top') + 2,
          height: this.get('margin.top') - 4,
          width: (d, i) => (i < fillIntervals.length - 1 ? x(fillIntervals[i+1].val) : width) - x(d.val)
        }).style({
          "fill": (d) => colorScale(d.val)
        })
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
        _.attr({
          x1: (d) => x(d.val),
          x2: (d) => x(d.val),
          y1: -this.get('margin.top') + 2,
          y2: height+2
        }).style({
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
          let dy = d3.select(this).attr("dy");
          return "rotate(-90)translate(-20," + (this.getBBox().height-4)*-1 + ")";
      });
    
    /*draw grid*/
    
    bindAttr = (_) => {
      _.attr({
        transform: d => d3.select(d).attr("transform")
      });
    };
    
    sel = stack.select(".grid")
      .selectAll(".grid-el")
      .data(stack.selectAll(".y.axis .tick")[0])
      .call(bindAttr);
      
    sel.enter()
      .append("g")
      .classed("grid-el", true)
      .call(bindAttr)
      .append("line")
      .attr({
        x2: width,
        y2: 0
      });
    
    sel.exit().remove();
    
  }.observes('mapping._defferedChangeIndicator'),

  labelChange: function() {
    this.d3l().select(".axis-label.x")
      .text(this.get('xLabel'));
    this.d3l().select(".axis-label.y")
      .text(this.get('yLabel'));
  }.observes("xLabel", "yLabel")
  
});
