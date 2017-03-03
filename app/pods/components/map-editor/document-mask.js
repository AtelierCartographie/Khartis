import Ember from 'ember';

export default Ember.Mixin.create({

  displayDocumentMask: false,

  documentMaskInit(defs, d3g) {

    let vm = defs.append("mask")
      .attrs({
        id: "document-mask",
        x: 0,
        y: 0,
        width: "500",
        height: "500"
      });

    vm.append("path")
      .attrs({
        "fill-rule": "evenodd"
      })
      .style("fill", "white");

    defs.append("clipPath")
      .attrs({
        id: "document-clip",
      })
      .append("path");

    d3g.append("rect")
			.classed("fg", true)
			.classed("document", true)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("opacity", 0.9)
      .attr("mask", `url(#document-mask)`)
      .attr("fill", "#cdcdcd");

    this.updateDocumentMask();

  },

  updateDocumentMask: function() {
    
		let {w, h} = this.getSize(),
        d3l = this.d3l(),
        self = this;
		
    let bbox = d3l.node().getBoundingClientRect(),
        ratio = Math.min(bbox.width/w, bbox.height/h),
        mX = (bbox.width - w*ratio) / 2 / ratio, //marges de compensation du viewport / viewBox
        mY = (bbox.height - h*ratio) / 2 / ratio;

    // fg document mask
    let vOf = this.get('graphLayout').vOffset(h),
        hOf = this.get('graphLayout').hOffset(w),
        outer = `M ${-mX} ${-mY}, ${w+2*mX} ${-mY}, ${w+2*mX} ${h+2*mY}, ${-mX} ${h+2*mY} Z`,
        inner =  `M ${hOf} ${vOf}, ${w - hOf} ${vOf},
                   ${w - hOf} ${h - vOf}, ${hOf} ${h - vOf}Z`;
    
    d3l.select("defs #document-mask path")
      .attr("d", `${outer} ${inner}`);

    d3l.select("defs #document-clip path")
      .attr("d", `${inner}`);

    d3l.selectAll("rect.fg.document")
      .attrs({
        "x": -mX,
        "y": -mY,
        "width": w+2*mX,
        "height": h+2*mY,
        "display": !this.get('displayDocumentMask') ? "none":null
      });
    
    // ===========
		
  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'graphLayout.margin.h',  'graphLayout.margin.v', 'displayDocumentMask', 'resizingMargin', 'projector'),


});
