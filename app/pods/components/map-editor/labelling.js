import Ember from 'ember';
import d3lper from 'mapp/utils/d3lper';

export default Ember.Mixin.create({

  labellingInit(d3g) {
    
    d3g.append("g")
      .classed("labelling", "true");

  },

  drawLabelling: function() {

    let self = this,
        data = this.get('labellingLayers')
          .filter( gl => gl.get('displayable') )
          .reverse();
    
    let bindAttr = (_) => {
      _.style("opacity", d => d.get('opacity'));
    };
    
    let sel = this.d3l().select("g.labelling")
      .selectAll("g.layer")
      .data(data, d => d._uuid)
      .call(bindAttr);
    
    sel.enter().append("g")
      .classed("layer", true)
      .call(bindAttr);
    
    sel.order().exit().remove();

    sel.each(function(d, index) {
      self.mapData(d3.select(this), d);
    });
    
  }.observes('labellingLayers.[]', 'labellingLayers.@each._defferedChangeIndicator'),

  mapText: function(d3Layer, data, graphLayer) {

    let projection = this.get('projection'),
        svg = this.d3l(),
        mapping = graphLayer.get('mapping'),
        converter = mapping.fn();
		
    let bindAttr = (_) => {

        _.attr("transform", d => { 

          let [tx, ty] = this.get('projectedPath').centroid(d.point.geometry);
          
          return d3lper.translate({
            tx: tx,
            ty: ty
          })
          
        })
        .attr("text-anchor", {
            left: "start",
            center: "middle",
            right: "end"
          }[graphLayer.get('mapping.visualization.anchor')])
        .text(d => d.value);
        
      };

    let centroidSel = d3Layer
			.selectAll("text.label")
      .data(data.filter( d => {
        let [tx, ty] = this.get('projectedPath').centroid(d.point.geometry);
        return !isNaN(tx) && !isNaN(ty);
      }))
      .call(bindAttr);
      
    centroidSel.enter()
      .append("text")
			.classed("label", true)
      .call(bindAttr);
      
    centroidSel.order().exit().remove();

	}

});
