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
  
  count: 0,
  
  mapping: null,
  
  draw: function() {
    
    this.d3l().append("defs");
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawMasks();
    
  }.on("didInsertElement"),
  
  masks: function() {
    let r = [];
    if (this.get('mapping.scale.diverging')) {
      r.push(
        PatternMaker.Composer.build({
          angle: this.get('pattern.angle'),
          stroke: this.get('pattern.stroke'),
          type: "circles"
        })
      )
    }
    r.push(
      PatternMaker.Composer.build({
        angle: this.get('pattern.angle'),
        stroke: this.get('pattern.stroke'),
        type: "lines"
      })
    );
    return r;
  }.property('count', 'pattern', 'mapping.scale.diverging'),
  
  drawMasks: function() {
    
    let svg = this.d3l();
    
    let bindAttr = (_) => {
      _.attrs({
        x: (d,i) => (i*(100/this.get('masks').length))+"%",
        width: (100/this.get('masks').length)+"%",
        height: "100%"
      }).styles({
        fill: (d, i) => {
          let fill;
          if (this.get('mapping.scale.diverging')) {
            fill = this.get(i === 0 ? 'mapping.patternColorReverse' : 'mapping.patternColor');
          } else {
            fill = this.get('mapping.patternColor');
          }
          let fn = new d.fn(false, fill);
          fn.init(svg);
          return `url(${fn.url()})`
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

    sel = this.d3l().select("g.swatchs")
      .selectAll("line")
      .data(this.get('masks').slice(1));

    sel.enter()
      .append("line")
      .attrs({
        x1: "50%",
        x2: "50%",
        y2: "100%",
        stroke: "#404040"
      });

    sel.exit().remove();
    
  }.observes('masks.[]', 'mapping.scale.diverging', 'mapping.patternColor')
  
});
