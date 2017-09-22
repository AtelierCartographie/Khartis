import Ember from 'ember';
import SymbolMaker from 'khartis/utils/symbol-maker';
import d3lper from 'khartis/utils/d3lper';
import d3 from 'npm:d3';

const MARGIN = 4;

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['xmlns', 'xmlns:xlink', 'version'],
  classNameBindings: ["shapeLength"],
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
  
  shape: null,
  
  color: null,

  shapeLength: function() {
    return `shape-${this.get('shape') instanceof Array ? this.get('shape').length : 1}`;
  }.property('shape'),
  
  draw: function() {
    
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawSymbol();
    
  }.on("didInsertElement"),

  isMultiple: function() {
    return this.get('shape') instanceof Array;
  }.property('shape'),
  
  drawSymbol: function() {
    
    let svg = this.d3l(),
        w = this.$().width(),
        h = this.$().height(),
        r = Math.min(w/2, h/2),
        data = this.get('isMultiple') ? this.get('shape') : [this.get('shape')];
    
    this.d3l().select("g.swatchs")
      .selectAll("g.swatch")
      .remove();
      
    this.d3l().select("g.swatchs")
      .selectAll("g.swatch")
      .data(data)
      .enterUpdate({
        enter: function(sel) {
          let g = sel.append("g").classed("swatch", true);
          g.each( function(d) {
            let symbol = SymbolMaker.symbol({name: d, size: 2*(r-MARGIN)});
            symbol.insert(d3.select(this));
          });
          return g;
        },
        update: (sel) => {
          return sel.attr("transform", (d, i) => d3lper.translate({tx: w/(data.length+1)*(i+1), ty: h/2}) )
            .styles({
              fill: this.get('color')
            });
        }
      });
    
  }.observes('shape', 'color')
  
});
