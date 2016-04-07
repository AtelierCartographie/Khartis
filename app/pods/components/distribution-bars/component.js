import Ember from 'ember';

export default Ember.Component.extend({
  
  tagName: "svg",
  
  mapping: null,
  
  draw: function() {
    
    let stack = this.d3l()
			.append("g")
      .classed("stack", true);
			//.attr("transform", "translate("+margin.left+", "+margin.top+")");
    
    stack.append("g")
      .classed("bars", true);
    
    stack.append("g")
      .classed("intervals", true);
    
    this.drawDistribution();
			
  }.on("didInsertElement"),
  
  drawDistribution: function() {
    
    let dist = this.get('mapping.distribution'),
        colorScale = this.get('mapping').getD3Scale(),
        values = [...dist.values()],
        margin = {top: 15, right: 15, bottom: 20, left: 35, betweenBars: 2},
		    width = this.$().width() - margin.left - margin.right,
		    height = this.$().height() - margin.top - margin.bottom,
        bindAttr,
        sel;
			
		let stack = this.d3l().select("g.stack")
			.attr("transform", "translate("+margin.left+", "+margin.top+")");
			
		let x = d3.scale.linear()
      .rangeRound([0, width])
      .domain(d3.extent(values.map( v => v.val)));
			
		let y = d3.scale.linear()
      .range([height, 0])
      .domain([0, Math.floor(d3.max(values, (v) => v.qty ))+1]);
			
		let xAxis = d3.svg.axis()
      .scale(x)
      .ticks(2)
      .orient("bottom");
			
		let yAxis = d3.svg.axis()
      .scale(y)
      .ticks(2)
      .orient("left");
			
    stack.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+2) + ")")
      .call(xAxis);
	
		stack.append("g")
		  .attr("transform", "translate(-3, 0)")
		  .attr("class", "y axis")
		  .call(yAxis);
		  /*.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 5)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("H(m)");*/
      
    let data = values
      .sort( (a, b) => d3.ascending(a.val, b.val) )
      .map(function(c, i) {
      
        return {
          val: c.val,
          qty: c.qty,
          idx: i
        };
        
      });
		  
		bindAttr = (_) => {
        _.attr({
          x: d => x(d.val),
          y: d => y(d.qty),
          width: "1px",
          height: d => height - y(d.qty)
        }).style({
           stroke: (d) => colorScale(d.val)
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
    
    let intervalsData = this.get('mapping.intervals').map( v => {
      
      return {val: v};
      
    });
    
    bindAttr = (_) => {
        _.attr({
          x1: (d) => x(d.val),
          x2: (d) => x(d.val),
          y1: -10,
          y2: height+10
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
      .classed("interval", true)
      .style("stroke", "red");
    
    sel.exit().remove();
    
  }.observes('mapping._defferedChangeIndicator')
  
});
