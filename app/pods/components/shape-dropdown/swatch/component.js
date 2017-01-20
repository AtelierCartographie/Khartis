import Ember from 'ember';
import SymbolMaker from 'mapp/utils/symbol-maker';
import d3lper from 'mapp/utils/d3lper';

const MARGIN = 4;

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['width', 'xmlns', 'xmlns:xlink', 'version'],
  width: "100%",
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
  
  shape: null,
  
  color: null,
  
  draw: function() {
    
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawSymbol();
    
  }.on("didInsertElement"),
  
  drawSymbol: function() {
    
    let svg = this.d3l(),
        w = this.$().width(),
        h = this.$().height(),
        r = Math.min(w/2, h/2),
        symbol = SymbolMaker.symbol({name: this.get('shape')});
    
    this.d3l().select("g.swatchs")
      .selectAll("g.swatch")
      .remove();
      
    this.d3l().select("g.swatchs")
      .selectAll("g.swatch")
      .data([this.get('shape')])
      .enterUpdate({
        enter: function(sel) {
          let g = sel.append("g").classed("swatch", true);
          symbol.insert(g, 2*(r-MARGIN));
          return g;
        },
        update: (sel) => {
          return sel.attr({
            transform: d3lper.translate({tx: w/2, ty: h/2})
          }).style({
            fill: this.get('color')
          });
        }
      });
    
  }.observes('shape', 'color')
  
});
