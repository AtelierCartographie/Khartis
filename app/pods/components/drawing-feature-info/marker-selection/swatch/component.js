import Ember from 'ember';
import SymbolMaker from 'khartis/utils/symbol-maker';
import d3lper from 'khartis/utils/d3lper';
import d3 from 'npm:d3';
import markerMaker from 'khartis/utils/marker-maker';

const MARGIN = 4;

export default Ember.Component.extend({
  
  tagName: "svg",
  attributeBindings: ['xmlns', 'xmlns:xlink', 'version'],
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': "http://www.w3.org/1999/xlink",
  version: '1.1',
  
  marker: null,
  
  margin: MARGIN,

  draw: function() {
    
    this.d3l().append("g")
      .classed("swatch", true);
      
    this.drawMarker();
    
  }.on("didInsertElement"),

  drawMarker: function() {
    
    let svg = this.d3l(),
        margin = this.get('margin'),
        w = this.element.clientWidth,
        h = this.element.clientHeight,
        r = h/2;

    let g = this.d3l().select("g.swatch");
    g.selectAll("*").remove();

    if (this.get('marker')) {
      markerMaker.appendContent(this.get('marker'), g);
    }

  }.observes('marker')
  
});
