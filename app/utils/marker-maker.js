import {isFirefox} from 'khartis/utils/browser-check';

const MarkerMaker = function() {
    this.counter = 0;
    this.nodeMap = {};
};
MarkerMaker.prototype._nodeIdx = function(node) {
    let idx = Object.keys(this.nodeMap).find( idx => this.nodeMap[idx] == node );
    if (idx == null) {
        idx = ++this.counter;
        this.nodeMap[idx] = node;
        $(node).bind('DOMNodeRemoved', function(e) {
            console.log("removed");
            delete this.nodeMap[idx];
        });
    }
    return idx;
};

MarkerMaker.prototype.buildMarker = function(defs, name, node, strokeWidth = 1) {
    let self = this;
    let baseUrl = isFirefox() ? window.location : "";
    let id = `${name}-${this._nodeIdx(node)}`;
    let viewBox = `0 0 ${10+strokeWidth} ${10+strokeWidth}`,
        markerSel;
    if (name === "arrow-marker-start") {
        markerSel = defs.selectOrCreate(`marker#${id}`, function() {
            let m = this.append("marker")
                .attr("id", id)
                .attr("refX", 5)
                .attr("refY", 5)
                .attr("orient", "auto");
            self.appendContent(name, m);
            return m;
        });
    } else if (name === "arrow-marker-end") {
        markerSel = defs.selectOrCreate(`marker#${id}`, function() {
            let m = this.append("marker")
                .attr("id", id)
                .attr("refX", 5)
                .attr("refY", 5)
                .attr("orient", "auto");
            self.appendContent(name, m);
            return m;
        });
    } else if (name === "circle-marker") {
        markerSel = defs.selectOrCreate(`marker#${id}`, function() {
            let m = this.append("marker")
                .attr("id", id)
                .attr("refX", 5)
                .attr("refY", 5)
                .attr("orient", "auto");
            self.appendContent(name, m);
            return m;
        });
    } else if (name === "rect-marker") {
        markerSel = defs.selectOrCreate(`marker#${id}`, function() {
            let m = this.append("marker")
                .attr("id", id)
                .attr("refX", 5)
                .attr("refY", 5)
                .attr("orient", "auto");
            self.appendContent(name, m);
            return m;
        });
    }
    markerSel.attr("viewBox", viewBox)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10);

    return {
        id,
        url: `${baseUrl}#${id}`
    };
};

MarkerMaker.prototype.appendContent = function(name, sel) {
    if (name === "arrow-marker-start") {
        sel.append("path").attr("d", "M10,0 L10,10 L0,5 L10,0");
    } else if (name === "arrow-marker-end") {
        sel.append("path").attr("d", "M0,0 L0,10 L10,5 L0,0");
    } else if (name === "circle-marker") {
        sel.append("circle")
            .attr("r", 4)
            .attr("cx", 5)
            .attr("cy", 5);
    } else if (name === "rect-marker") {
        sel.append("rect")
            .attr("x", 1)
            .attr("y", 1)
            .attr("width", 8)
            .attr("height", 8);
    }
};

export default new MarkerMaker();