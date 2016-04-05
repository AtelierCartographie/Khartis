import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({

  tagName: 'div',

  value:0,
  min:0,
  max:10,
  ticks: 3,
  tickValues: null,
  
  tickAppend: null,
  tickFormat: ",.2f",
  
  scale: null,
  
  _tmpValue: null,
  
  displayedValue: function() {
    
    let d3format = (d) => d,
        formatter;
        
    if (this.get('tickFormat')) {
      d3format = (d) => d3.format(this.get('tickFormat'))(d);
    }
    
    if (this.get('tickAppend') != null) {
        formatter = (d) => d3format(d) + this.get('tickAppend');
    } else {
        formatter = (d) => d3format(d);
    }
    
    return formatter(this.get('_tmpValue'));
    
  }.property('_tmpValue', 'value', 'tickFormat', 'tickAppend'),
  
  setup: function() {
    
    this.set('_tmpValue', this.get('value'));
    
    if (!this.get('scale')) {
      this.set('scale',
        d3.scale.linear()
          .domain([this.get('min'), this.get('max')])
          .clamp(true)
      );
    }
    
  }.on("init"),
  
  draw: function() {
    
    let margin = {
          l: parseInt( this.$(".axis").css("marginLeft") ),
          r: parseInt( this.$(".axis").css("marginRight") )
        },
        tickSize = 6,
        width = (this.$().width() - (margin.l + margin.r));
    
    let scale = this.get('scale');
    
    scale.range([0, width]);
    
    let svg = this.d3l().select(".axis")
      .style("left", "0px")
      .style("width", width + "px");
      
    // Range rect
    svg.append("rect")
      .classed("rangeRect", true)
      .attr("width", "100%")
      .attr("height", "5px");
      
    // Axis      
    var axis = d3.svg.axis()
      .scale(scale)
      .orient("bottom");
    
    if (this.get('ticks')) {
      axis.ticks(this.get('ticks'));
      axis.tickSize(tickSize);
    } else if (this.get('tickValues')) {
      axis.tickValues(this.get('tickValues'));
      axis.tickSize(tickSize);
    } else {
      axis.ticks(0);
      axis.tickSize(0);
    }
    
   /* if (tickFormat) {
      axis.tickFormat(tickFormat);
    }*/
    
    this.d3l().select(".axis").append("g")
      .call(axis);
      
    // Enable dragger drag 
    var dragBehaviour = d3.behavior.drag();
    dragBehaviour.on("drag", this.moveDragger.bind(this));
    this.d3l().select(".dragger").call(dragBehaviour);
    
    this.valueChange();
    
  }.on('didInsertElement'),
  
  moveDragger() {
    
    let margin = {
          l: parseInt( this.$(".axis").css("marginLeft") ),
          r: parseInt( this.$(".axis").css("marginRight") )
        },
        scale = this.get('scale'),
        pos = Math.max(0, Math.min(scale.range()[1], d3.event.x));
    
    this.d3l().selectAll(".dragger").style({
      left: pos + "px"
    });
    
    this.set('_tmpValue', scale.invert(pos));
    
  },
  
  tmpValueChange: Ember.debouncedObserver('_tmpValue', function() {
    this.set('value', this.get('_tmpValue'));
  }, 50),
  
  valueChange: function() {
    
    let scale = this.get('scale'); 
    
    this.d3l().selectAll(".dragger").style({
      left: scale(this.get('value')) + "px"
    });
    
  }.observes('value')

});
