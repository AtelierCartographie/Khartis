import Ember from 'ember';
import PatternMaker from 'khartis/utils/pattern-maker';
/* global $ */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'xmlns:xlink', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
  
  pattern: null,
  
  color: null,
  
  draw: function() {
    
    this.d3l().append("defs");
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawMasks();
    
  }.on("didInsertElement"),
  
  masks: function() {
    if (this.get('pattern')) {
      return [{
        fn: PatternMaker.lines({
              orientation: [ this.get('pattern.angle') ],
              stroke: this.get('pattern.stroke')
            })
      }];
    } else {
      return [{fn: PatternMaker.NONE}];
    }
  }.property('count', 'pattern'),
  
  drawMasks: function() {
    
    let svg = this.d3l();
    
    let bindAttr = (_) => {
      _.attrs({
        x: 0,
        width: "100%",
        height: "100%"
      }).styles({
        fill: this.get('color'),
        mask: (d) => {
          svg.call(d.fn);
          return `url(${d.fn.url('swatch')})`;
        }
      })
    };
    
    let sel = this.d3l().select("g.swatchs")
      .selectAll("rect.swatch")
      .data(this.get('masks'))
      .call(bindAttr);
      
    sel.enter()
      .append("rect")
      .classed("swatch", true)
      .call(bindAttr);
      
    sel.exit().remove();
    
  }.observes('masks.[]', 'color')
  
});
