import Ember from 'ember';
import SymbolMaker from 'mapp/utils/symbol-maker';

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
    
    this.d3l().append("defs");
    this.d3l().append("g")
      .classed("swatchs", true);
      
    this.drawSymbol();
    
  }.on("didInsertElement"),
  
  drawSymbol: function() {
    
    let svg = this.d3l(),
        symbol = SymbolMaker.symbol({name: this.get('shape')});
          
    symbol.call(svg);
    
    let bindAttr = (_) => {
      _.attr({
        "xlink:xlink:href": symbol.url(),
        x: 0,
        width: "100%",
        height: "100%"
      }).style({
        fill: this.get('color')
      });
    };
    
    let sel = this.d3l().select("g.swatchs")
      .selectAll("use.swatch")
      .data([this.get('shape')])
      .call(bindAttr);
      
    sel.enter()
      .append("use")
      .classed("swatch", true)
      .call(bindAttr);
      
    sel.exit().remove();
    
  }.observes('shape', 'color')
  
});
