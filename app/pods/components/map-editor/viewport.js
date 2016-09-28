import Ember from 'ember';

export default Ember.Mixin.create({

  displayOffsets: false,

  viewportInit(defs, d3g) {

    let vm = defs.append("mask")
      .attr({
        id: "viewport-mask",
        x: 0,
        y: 0,
        width: "500",
        height: "500"
      });

    vm.append("path")
      .attr({
        "fill-rule": "evenodd"
      })
      .style("fill", "white");

    defs.append("clipPath")
      .attr({
        id: "viewport-clip",
      })
      .append("path");

    d3g.append("rect")
			.classed("fg", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("opacity", 0.8)
      .attr("mask", `url(#viewport-mask)`)
      .attr("fill", this.get('graphLayout.backgroundColor'));

    let og = d3g.append("g")
			.classed("offset", true);
			
		og.append("line").classed("horizontal-top", true);
		og.append("line").classed("horizontal-bottom", true);
		og.append("line").classed("vertical-left", true);
		og.append("line").classed("vertical-right", true);
		
		let mg = d3g.append("g")
			.classed("margin", true);
			
		mg.append("rect")
			.attr("fill", "none");

    this.updateViewport();

  },

  updateViewport: function() {
    
    this._super();
		
		let {w, h} = this.getSize(),
        d3l = this.d3l();
		
    let vpBbox = d3l.node().getBoundingClientRect(),
        ratio = Math.min(vpBbox.width/w, vpBbox.height/h),
        mX = (vpBbox.width - w*ratio) / 2 / ratio, //marges de compensation du viewport / viewBox
        mY = (vpBbox.height - h*ratio) / 2 / ratio;

    // fg mask
    let vOf = this.get('graphLayout').vOffset(h),
        hOf = this.get('graphLayout').hOffset(w),
        m = this.get('graphLayout.margin'),
        outer = `M ${-mX} ${-mY}, ${w+2*mX} ${-mY}, ${w+2*mX} ${h+2*mY}, ${-mX} ${h+2*mY} Z`,
        inner =  `M ${hOf + m.l} ${vOf + m.t}, ${w - hOf - m.r} ${vOf + m.t},
                   ${w - hOf - m.r} ${h - vOf - m.b}, ${hOf + m.l} ${h - vOf - m.b}Z`;
    
    d3l.select("defs #viewport-mask path")
      .attr("d", `${outer} ${inner}`);

    d3l.select("defs #viewport-clip path")
      .attr("d", `${inner}`);

    d3l.selectAll("rect.fg, rect.bg")
      .attr({
        "x": -mX,
        "y": -mY,
        "width": w+2*mX,
        "height": h+2*mY
      })
    
    // ===========
		
		d3l.selectAll("g.offset line.horizontal-top")
      .classed("visible", this.get('displayOffsets'))
			.attr("x1", 0)
			.attr("y1", vOf)
			.attr("x2", w)
			.attr("y2", vOf)
		  .attr("stroke-width", "1");
    
		d3l.selectAll("g.offset line.horizontal-bottom")
      .classed("visible", this.get('displayOffsets'))
			.attr("x1", 0)
			.attr("y1", h - vOf)
			.attr("x2", w)
			.attr("y2", h - vOf)
		  .attr("stroke-width", "1");
			
		d3l.selectAll("g.offset line.vertical-left")
      .classed("visible", this.get('displayOffsets'))
			.attr("x1", hOf)
			.attr("y1", 0)
			.attr("x2", hOf)
			.attr("y2", h)
		  .attr("stroke-width", "1");
      
		d3l.selectAll("g.offset line.vertical-right")
      .classed("visible", this.get('displayOffsets'))
			.attr("x1", w - hOf)
			.attr("y1", 0)
			.attr("x2", w - hOf)
			.attr("y2", h)
		  .attr("stroke-width", "1");
		
		d3l.select("g.margin")
			.attr("transform", `translate(${hOf}, ${vOf})`)
			.selectAll("rect")
			.attr("x", this.get('graphLayout.margin.l'))
			.attr("y", this.get('graphLayout.margin.t'))
			.attr("width", this.get('graphLayout.width') - this.get('graphLayout.margin.h'))
			.attr("height", this.get('graphLayout.height') - this.get('graphLayout.margin.v'))
      .attr("stroke-width", "1")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "1, 3");
      
    d3l.select("rect.bg")
      .attr({
        x: 0,
        y: 0,
        width: w,
        height: h
      });

  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'graphLayout.margin.h',  'graphLayout.margin.v', 'displayOffsets', 'projector'),


});
