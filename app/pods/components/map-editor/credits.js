import Ember from 'ember';
import d3lper from 'khartis/utils/d3lper';

export default Ember.Mixin.create({

  creditsInit(d3g) {

    d3g.append("text")
      .classed("map-title", true);

    d3g.append("text")
      .classed("map-dataSource", true);

    d3g.append("g")
      .classed("map-author", true)
      .append("text");

    this.drawCredits();

  },

  drawCredits: function() {
    
    let {w, h} = this.getSize(),
        d3l = this.d3l();
    
    d3l.select("text.map-title")
      .text(this.get('title'))
      .attrs({
        "font-size": "2em",
        x: this.get('graphLayout').hOffset(w) + this.get('graphLayout.margin.l'),
        y: this.get('graphLayout').vOffset(h) + this.get('graphLayout.margin.t') - 5
      });
      
   d3l.attr("title", this.get('title'));

   d3l.select("text.map-dataSource")
      .text(this.get('dataSource'))
      .attrs({
        "font-size": "0.8em",
        "text-anchor": "end",
        x: w - this.get('graphLayout').hOffset(w) - this.get('graphLayout.margin.r') - 1,
        y: h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + 11
      });


    d3l.select("g.map-author")
      .attr("transform", d3lper.translate({
        tx: w - this.get('graphLayout').hOffset(w) - this.get('graphLayout.margin.r') + 11,
        ty: h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') - 1
      }))
      .select("text")
      .text(this.get('author'))
      .attr("transform", "rotate(-90)")
      .attrs({
        "font-size": "0.8em"
      });
   
  }.observes('title', 'dataSource', 'author', "$width", "$height",
    "graphLayout.margin._defferedChangeIndicator",
    "graphLayout.width", "graphLayout.height"),

});
