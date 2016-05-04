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
  
  displayTick: true,
  
  scale: null,
  
  _tmpValue: null,
  
  band: null,
  
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
      let scale = this.get('scale'),
           pos = Math.max(0, Math.min(scale.range()[1], d3.event.x)),
           tmpVal = this.stepValue(scale.invert(pos));
      
      this.translate(tmpVal);
      
      if (this.get('_tmpValue') != tmpVal) {
        this.set('_tmpValue', tmpVal);
      }
  },
  
  stepValue(val) {
    
    let scale = this.get('scale'),
        band = this.get('band');
        
    val = Math.min(this.get('max'), Math.max(this.get('min'), val));
        
    if (band) {

      if (val === scale.domain()[0] || val === scale.domain()[1]) {
        return val;
      }

      var alignValue = val;
      
      var valModStep = (val - scale.domain()[0]) % band;
      alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= band) {
        alignValue += (valModStep > 0) ? band : -band;
      }
      
      return alignValue;
      
    } else {
      
      return val;
      
    }

  },
  
  translate(val) {
    
    let translate = this.get('scale')(this.stepValue(val)) + "px";
    
    this.d3l().selectAll(".dragger").style({
      "-webkit-transform":`translateX(${translate})`,
      "-ms-transform":`translateX(${translate})`,
      "transform":`translateX(${translate})`
    });
    
  },
  
  tmpValueChange: Ember.debouncedObserver('_tmpValue', function() {
    this.set('value', this.get('_tmpValue'));
  }, 150),
  
  valueChange: function() {
    
    let val = this.stepValue(this.get('value'));
    if (val != this.get('value')) {
      this.set('_tmpValue', val);
    }
    this.translate(val);
    
  }.observes('value')

});
