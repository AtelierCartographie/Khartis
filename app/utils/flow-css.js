import d3 from "npm:d3";

const NS = "flow:flow:",
      shift = -1000;
      
let ROOT_EL;

function createRoot() {
    ROOT_EL = document.createElement("div");
    ROOT_EL.setAttribute("id", "flow-root-el");
    ROOT_EL.setAttribute("style", `position: absolute; top: ${shift}px; left: ${shift}px; visibility: hidden`);
    document.body.appendChild(ROOT_EL);
}

function isFlowManaged(node) {
  return node.getAttribute
    && (d3.select(node).attr(`${NS}include`) === "1"
      || d3.select(node).attr(`${NS}class`)
      || d3.select(node).attr(`${NS}style`)
      || node.__flow_fn);
}

function buildDom(root, node) {
    if (isFlowManaged(node)) {
        let el = document.createElement("div");
        flowToCss(node, el);
        el.__flow_el = node;
        root.appendChild(el);
        Array.prototype.slice.apply(node.children).forEach(buildDom.bind(this, el));
    }
}

function flowToCss(svgNode, domEl) {
    let d3l = d3.select(svgNode),
        flowClasses = (d3l.attr("flow:flow:class") || "").split(" "),
        styles = [];
    
    if (flowClasses.indexOf("flow") === -1) {
      let bbox = svgNode.getBoundingClientRect();
      styles.push(`width: ${bbox.width}px`);
      styles.push(`height: ${bbox.height}px`);
    }

    if (svgNode.__flow_fn) {
      Object.keys(svgNode.__flow_fn).forEach( k => {
        styles.push(`${k}:${svgNode.__flow_fn[k].apply(svgNode)}`);
      } );
    }

    domEl.setAttribute("class", d3l.attr(`${NS}class`) || "");
    domEl.setAttribute("style", styles.concat([(d3l.attr(`${NS}style`) || "")]).join(";"));
}

function applyLayout(domEl) {
    let nodeSvg = domEl.__flow_el;
    if (nodeSvg) {
        let parentRect = domEl.parentElement.getBoundingClientRect(),
            elemRect = domEl.getBoundingClientRect(),
            offsetLeft = elemRect.left - parentRect.left,
            offsetTop = elemRect.top - parentRect.top;
        d3.select(nodeSvg).attr("transform", `translate(${offsetLeft}, ${offsetTop})`);

        if (nodeSvg.tagName !== "g") { //apply width and height
            d3.select(nodeSvg).attr("width", elemRect.width).attr("height", elemRect.height);
        }

    }
    Array.prototype.slice.apply(domEl.children).forEach(applyLayout);
}

//- d3 extension -

d3.selection.prototype.flowStyle = function(style) {
  return this.attr(`${NS}style`, style);
};

d3.selection.prototype.flowClass = function(classNames) {
  return this.attr(`${NS}class`, classNames);
};

d3.selection.prototype.flowInclude = function(classNames) {
  return this.attr(`${NS}include`, "1");
};

d3.selection.prototype.flowComputed = function(prop, fn) {
  !this.node().__flow_fn && (this.node().__flow_fn = {});
  prop = prop instanceof Array ? prop : [prop];
  prop.forEach( p => this.node().__flow_fn[p] = fn );
  return this;
};

// ------

export default function(sel) {

    !ROOT_EL && createRoot();

    //clear ROOT element
    while (ROOT_EL.firstChild) {
        ROOT_EL.removeChild(ROOT_EL.firstChild);
    }

    //create ghost dom representation of SVG elements
    buildDom(ROOT_EL, sel.node());

    applyLayout(ROOT_EL.firstChild);
    
};