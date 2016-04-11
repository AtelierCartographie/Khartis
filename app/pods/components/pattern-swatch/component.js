import Ember from 'ember';
import MaskPattern from 'mapp/utils/mask-pattern';
/* global $ */

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'xmlns:xlink', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
  
  angle: null,
  
  stroke: null,
  
  count: 0,
  
  classBreak: 0,
  
  color: null,
  
  draw: function() {
    
    this.d3l().append("defs");
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawMasks();
    
  }.on("didInsertElement"),
  
  masks: function() {
    return Array.from({length: this.get('count')}, (v, i) => {
      return {
        fn: MaskPattern.lines({
              orientation: [ this.get('angle') + (i < this.get('classBreak') ? 90 : 0)],
              stroke: this.get('stroke') + i/4,
              size: this.get('stroke') + 2
            })
      };
    })
  }.property('count', 'angle', 'stroke'),
  
  drawMasks: function() {
    
    this.get('masks').forEach( m => this.d3l().call(m.fn) );
    
    let bindAttr = (_) => {
      _.attr({
        x: (d,i) => (i*(100/this.get('count')))+"%",
        width: (100/this.get('count'))+"%",
        height: "100%"
      }).style({
        mask: (d) => `url(${d.fn.url()})`,
        fill: this.get('color')
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
