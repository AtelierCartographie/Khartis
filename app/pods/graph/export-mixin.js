import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Mixin.create({

    exportAsHTML(compatibility = {}) {
    
        try {
            var isFileSaverSupported = !!new Blob();
        } catch (e) {
            alert("blob not supported");
        }
    
        let node = d3.select("svg.map-editor")
            .node().cloneNode(true);
            
        let d3Node = d3.select(node);
        
        let x = parseInt(d3Node.selectAll("g.offset line.vertical-left").attr("x1")),
            y = parseInt(d3Node.selectAll("g.offset line.horizontal-top").attr("y1")),
            w = this.get('model.graphLayout.width'),
            h = this.get('model.graphLayout.height');
        
        d3Node.attrs({
          width: this.get('model.graphLayout.width'),
          height: this.get('model.graphLayout.height'),
          viewBox: `${x} ${y} ${w} ${h}`,
          title: d3Node.attr('title') || "Khartis project"
        });
    
        d3Node.selectAll("g.margin,g.offset,g.margin-resizer").remove();
        d3Node.selectAll("rect.fg").remove();
        d3Node.selectAll("#document-mask").remove();
        d3Node.selectAll("#viewport-mask").remove();
        d3Node.selectAll("#foremap").remove();
    
        //replace rgba with rgb+fill-opacity
        d3Node.selectAll("*[fill^=rgba]")
          .each(function() {
            let el = d3.select(this),
                rgba = el.attr("fill"),
                color = d3.color(rgba);
            el.attr("fill", `rgb(${color.r}, ${color.g}, ${color.b})`)
              .attr("fill-opacity", color.opacity);
          });
    
        d3Node.append("text")
          .text("Made with Khartis")
          .attrs({
            "x": x+w,
            "y": y+h,
            "dy": "-0.81em",
            "dx": "-0.81em",
            "font-size": "0.8em",
            "text-anchor": "end"
          });
          
        d3Node.select("#outerMap")
          .attr("clip-path", "url(#viewport-clip)");
    
        //netooyage des attributs internes
        let khartisAttrs = [
          {ns: "kis", attr: "tx", fn: null},
          {ns: "kis", attr: "ty", fn: null},
          {ns: "kis", attr: "height", fn: null},
          {ns: "kis", attr: "width", fn: null},
          {ns: "kis", attr: "transient", fn: (node) => node.remove() },
          {ns: "flow", attr: "style", fn: null},
          {ns: "flow", attr: "class", fn: null},
          {ns: "flow", attr: "include", fn: null}
        ];
    
        if (compatibility.illustrator) {
          khartisAttrs.push({
            ns: "i",
            attr: "stroke-width",
            fn: (node) => node.attrs({
                  "stroke-width": node.attr(`i:i:stroke-width`),
                  "i:i:stroke-width": null
                })
          });
    
          d3Node.select(".legend").attr("i:i:layer", "yes").attr("id", "legend");
          d3Node.select("#outerMap").attr("i:i:layer", "yes");
          d3Node.selectAll("*[display='none']").remove();
    
          d3Node.selectAll("g.layer.surface").each( function(d, i) {
            d3.select(this).attr("id", `viz-surface${i > 0 ? '-'+i: ''}`);
          });
    
          d3Node.selectAll("g.layer.symbol").each( function(d, i) {
            d3.select(this).attr("id", `viz-symbol${i > 0 ? '-'+i: ''}`);
          });
    
          //remove #map node
          let mapChilds = d3Node.selectAll("#map > *").remove().nodes();
          mapChilds.forEach( node => d3Node.select("#outerMap").append( () => node) );
          d3Node.select("#map").remove();
    
          //wrap nodes
          let wrapper = d3Node.append("g")
                .attrs({
                  "id": "view-box",
                  "i:i:extraneous": "self",
                  "transform": `translate(${-x}, ${-y})`
                });
    
          [].slice.call(d3Node.node().children).forEach( node => {
            if (node != wrapper.node() && ['g', 'text', 'rect'].indexOf(node.tagName)+1) {
              wrapper.append(() => d3.select(node).remove().node());
            }
          });
    
          //rewrite viewport because illustrator doesn't read x y
          d3Node.attr("viewBox", `0 0 ${w} ${h}`);
    
        }
    
        khartisAttrs.forEach(kAttr => {
          d3Node.selectAll(`[${kAttr.ns}\\:${kAttr.attr}]`).nodes()
            .forEach( (node) => {
              kAttr.fn || (kAttr.fn = (node) => node.attr(`${kAttr.ns}:${kAttr.ns}:${kAttr.attr}`, null));
              kAttr.fn(node = d3.select(node));
            });
        });

        //flow cleanup
        d3Node.selectAll("*").nodes()
            .forEach( node => {
                Array.prototype.slice.call(node.attributes).forEach(function(attr) {
                    if (attr.name.indexOf("flow:") === 0) {
                        node.removeAttributeNode(attr);
                    }
                });
            });
                  
        let html = d3Node.node()
          .outerHTML
          .replace(/http:[^\)"]*?#/g, "#")
          .replace(/&quot;/, "")
          .replace(/NS\d+\:/g, "xlink:");
    
        d3Node.remove();
    
        return html;
        
      }

});