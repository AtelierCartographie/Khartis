import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Mixin.create({

  displayOffsets: false,
  resizingMargin: false,

  viewportInit(defs, d3g) {

    let vm = defs.append("mask")
      .attrs({
        id: "viewport-mask",
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
        id: "viewport-clip",
      })
      .append("path");

    d3g.append("rect")
			.classed("fg", true)
			.classed("viewport", true)
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

    let mr = d3g.append("g")
      .classed("margin-resizer", true);
			
		mg.append("rect")
			.attr("fill", "none");

    this.updateViewport();

  },

  updateViewport: function() {
    
    this._super();
		
		let {w, h} = this.getSize(),
        d3l = this.d3l(),
        self = this;
		
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

    d3l.selectAll("rect.fg.viewport, rect.bg")
      .attrs({
        "x": -mX,
        "y": -mY,
        "width": w+2*mX,
        "height": h+2*mY
      })
    
    // ===========
		
		d3l.selectAll("g.offset line.horizontal-top")
      .classed("visible", this.get('displayOffsets') || this.get('resizingMargin'))
			.attr("x1", 0)
			.attr("y1", vOf)
			.attr("x2", w)
			.attr("y2", vOf)
		  .attr("stroke-width", "1");
    
		d3l.selectAll("g.offset line.horizontal-bottom")
      .classed("visible", this.get('displayOffsets') || this.get('resizingMargin'))
			.attr("x1", 0)
			.attr("y1", h - vOf)
			.attr("x2", w)
			.attr("y2", h - vOf)
		  .attr("stroke-width", "1");
			
		d3l.selectAll("g.offset line.vertical-left")
      .classed("visible", this.get('displayOffsets') || this.get('resizingMargin'))
			.attr("x1", hOf)
			.attr("y1", 0)
			.attr("x2", hOf)
			.attr("y2", h)
		  .attr("stroke-width", "1");
      
		d3l.selectAll("g.offset line.vertical-right")
      .classed("visible", this.get('displayOffsets') || this.get('resizingMargin'))
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

    let resizers = [
      {dir: "t", x: 0, y: 0, height: 24},
      {dir: "b", x: 0, y: this.get('graphLayout.height') - this.get('graphLayout.margin.v'), height: 24},
      {dir: "l", x: 0, y: 0, width: 24},
      {dir: "r", x: this.get('graphLayout.width') - this.get('graphLayout.margin.h'), y: 0, width: 24},
    ];

    let drag = d3.drag()
        .on('start', function () {
            d3.event.sourceEvent.stopPropagation();
            d3.event.sourceEvent.preventDefault();
            d3.select(this).classed("dragging", true);
            self.set('resizingMargin', true);
        })
        .on('end', function () {
            d3.select(this).classed("dragging", false);
            self.set('resizingMargin', false);
        })
        .on("drag", (d,i) => {
            let shift;
            switch (d.dir) {
              case "t":
                shift = d3.event.dy;
                break;
              case "b":
                shift = -d3.event.dy;
                break;
              case "l":
                shift = d3.event.dx;
                break;
              case "r":
                shift = -d3.event.dx;
                break;
            }
            let val = this.get('graphLayout.margin.'+d.dir)+shift;
            val = Math.min(val, this.get('graphLayout.width')/2 - 1);
            this.get('graphLayout.margin').setProperties({
              [d.dir]: val > this.get('graphLayout.margin').getInitialValue(d.dir) ? val : this.get('graphLayout.margin').getInitialValue(d.dir),
              manual: true
            });
        });

    let bindAttr = (_) => {
      _.attr("x", d => hOf + this.get('graphLayout.margin.l') + d.x - (d.width ? d.width/2 : 0))
      .attr("y", d => vOf + this.get('graphLayout.margin.t') + d.y - (d.height ? d.height/2 : 0))
      .attr("width", d => d.width || (this.get('graphLayout.width') - this.get('graphLayout.margin.h')))
      .attr("height", d => d.height || (this.get('graphLayout.height') - this.get('graphLayout.margin.v')))
      .call(drag);
    };

    let sel = d3l.select("g.margin-resizer")
      .selectAll("rect")
      .data(resizers)
      .call(bindAttr);

    sel.enter()
      .append("rect")
      .attr("class", d => d.dir)
      .call(bindAttr);

    sel.exit().remove();
      
    d3l.select("rect.bg")
      .attrs({
        x: 0,
        y: 0,
        width: w,
        height: h
      });

  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height',
    'graphLayout.margin.h',  'graphLayout.margin.v', 'displayOffsets', 'resizingMargin', 'projector'),


});
