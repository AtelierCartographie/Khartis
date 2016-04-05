import Ember from 'ember';

export default Ember.Component.extend({
  
  tagName: "svg",
  
  distribution: null,
  intervals: null,
  
  draw: function() {
    
    console.log(this.get('distribution'));
    
    let dist = this.get('distribution'),
        values = [...dist.values()],
        svg = this.d3l(),
        margin = {top: 15, right: 15, bottom: 20, left: 35, betweenBars: 2},
		    width = this.$().width() - margin.left - margin.right,
		    height = this.$().height() - margin.top - margin.bottom;
			
		let stack = svg
			.append("g")
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
		  
		let data = [...dist.values()]
      .sort( (a, b) => d3.ascending(a.val, b.val) )
      .map(function(c, i) {
			
        return {
          val: c.val,
          qty: c.qty,
          idx: i
        };
        
      });
		  
		let g = stack.selectAll("g.bar")
			.data(data)
			.enter()
			.append("g")
			.classed("bar", true);
		
		g.append("rect")
			.attr("x", function(d) { return x(d.val); })
			.attr("y", function(d) { return y(d.qty); })
			.attr("width", "1px")
      .attr("height", function(d) { return height - y(d.qty); })
      .classed("dist-bar", true);
      
    /* intervals */
    
    let intervalsData = this.get('intervals').map( v => {
      
      return {val: v};
      
    });
    
    stack.append("g")
      .classed("intervals", true);
    
    stack.select("g.intervals")
      .selectAll("line.interval")
      .data(intervalsData)
      .attr({
        x1: (d) => x(d.val),
        x2: (d) => x(d.val)
      })
      .enter()
      .append("line")
      .classed("interval", true)
      .attr({
        x1: (d) => x(d.val),
        x2: (d) => x(d.val),
        y1: -10,
        y2: height+10
      })
      .style("stroke", "red");
			
  }.on("didInsertElement")
  
});
