import d3 from "npm:d3";

const NS = "flow:flow:",
      DEBUG = false,
      SHIFT = -1000,
      virtualDom = new WeakMap(),
      isNumeric = (val) => Number(parseFloat(val)) === val;

let incId = 0;

//- Virtual dom -
const vGetEl = (element) => {
  if (!virtualDom.has(element)) {
    virtualDom.set(element, new Map());
  }
  return virtualDom.get(element);
};

const vSetAttr = (element, attr, value, mode = "") => {
  DEBUG && element.attr(`${NS}${attr}${mode}`, value);
  vGetEl(element).set(`${attr}${mode}`, value);
}

const vGetAttr = (element, attr, mode = "") => {
  return vGetEl(element).get(`${attr}${mode}`);
}

const vHasAttr = (element, attr, mode = "") => {
  return virtualDom.has(element) && vGetEl(element).has(`${attr}${mode}`);
}

//- d3 extension -

d3.selection.prototype.flowStyle = function() {
  let [mode, style] = arguments.length == 2 ? ["_"+arguments[0], arguments[1]] : ["", arguments[0]];
  vSetAttr(this.node(), `style`, style, mode);
  return this;
};

d3.selection.prototype.flowClass = function() {
  let [mode, classNames] = arguments.length == 2 ? ["_"+arguments[0], arguments[1]] : ["", arguments[0]];
  vSetAttr(this.node(), `class`, classNames, mode);
  return this;
};

d3.selection.prototype.flowInclude = function(mode) {
  mode = (mode && "_"+mode) || "";
  vSetAttr(this.node(), `include`, 1, mode);
  return this;
};

d3.selection.prototype.flowComputed = function() {
  let [mode, prop, fn] = arguments.length == 3 ? ["_"+arguments[0], arguments[1], arguments[2]] : ["", arguments[0], arguments[1]];
  !vGetAttr(this.node(), "flow_fn", mode) && (vSetAttr(this.node(), "flow_fn", {}, mode));
  prop = prop instanceof Array ? prop : [prop];
  let ext = prop.reduce((out, p) => {
    out[p] = fn;
    return out;
  }, vGetAttr(this.node(), "flow_fn", mode));
  vSetAttr(this.node(), "flow_fn", ext, mode);
  return this;
};

d3.selection.prototype.flowComputedAttrs = function() {
  let [mode, fn] = arguments.length == 2 ? ["_"+arguments[0], arguments[1]] : ["", arguments[0]];
  !this.node()["flow_fn_attr"+mode] && (this.node()["flow_fn_attr"+mode] = []);
  !vGetAttr(this.node(), "flow_fn_attr", mode) && (vSetAttr(this.node(), "flow_fn_attr", [], mode));
  vGetAttr(this.node(), "flow_fn_attr", mode).push(fn);
  return this;
};

d3.selection.prototype.flowState = function(state) {
  vSetAttr(this.node(), "flow_state", state);
  return this;
};

// ------


const FlowLayout = function(sel) {
  if (!(this instanceof FlowLayout)) {
    return new FlowLayout(sel, mode);
  }
  this.sel = sel;
  this.rootSvg = sel.closestParent("svg").node();
  sel.node().__flow = this;
};

FlowLayout.get = function(node) {
  for (; node && node.parentElement; node = node.parentElement) {
    if (node.__flow) {
      return node.__flow;
    }
  }
  throw new Error("Unable to find root flow");
};

FlowLayout.prototype.createRoot = function() {
  this.ROOT_EL = document.createElement("div");
  this.ROOT_EL.setAttribute("id", `flow-root-el-${++incId}`);
  this.ROOT_EL.setAttribute("style", `position: absolute; top: ${SHIFT}px; left: ${SHIFT}px; visibility: hidden`);
  document.body.appendChild(this.ROOT_EL);
};

FlowLayout.prototype.clearRoot = function() {
  document.body.removeChild(this.ROOT_EL);
};

FlowLayout.prototype.isFlowDomManaged = function(node) {
  let modes = this.getStates(node);
  return node.getAttribute
    && modes.some(
      m => vGetAttr(node, `include`, m) === 1
      || vGetAttr(node, `class`, m)
      || vGetAttr(node, `style`, m)
      || vGetAttr(node, "flow_fn", m)
    );
};

FlowLayout.prototype.buildDom = function(root, node) {
    this.flowAttributes(node);
    if (this.isFlowDomManaged(node)) {
      let el = document.createElement("div");
      this.flowToCss(node, el);
      el.__flow_el = node;
      root.appendChild(el);
      Array.prototype.slice.apply(node.children).forEach(this.buildDom.bind(this, el));
    } else {
      Array.prototype.slice.apply(node.children).forEach(this.buildDom.bind(this, root));
    }
};

FlowLayout.prototype.getStates = function(svgNode) {
  let states = [];
  for (let n = svgNode; n.parentElement; n = n.parentElement) {
    if (vHasAttr(n, "flow_state")) {
      states = states.concat(vGetAttr(n, "flow_state").split(",").map(s => "_"+s.trim()));
    }
    if (n == this.sel.node()) {
      break;
    }
  }
  return ["", ...states.reverse()];
};

FlowLayout.prototype.flowAttributes = function(svgNode) {
  let d3l = d3.select(svgNode),
      modes = this.getStates(svgNode);

  modes.forEach( mode => {
    if (vGetAttr(svgNode, "flow_fn_attr", mode)) {
      vGetAttr(svgNode, "flow_fn_attr", mode).forEach(fn => d3l.attrs(fn.apply(svgNode)));
    }
  } );
};

FlowLayout.prototype.flowToCss = function(svgNode, domEl) {
  let styles = [],
      stylesComputed = [],
      classNames = [],
      flowClasses = [],
      modes = this.getStates(svgNode);

  modes.forEach( mode => {

    flowClasses = flowClasses.concat((vGetAttr(svgNode, `class`, mode) || "").split(" "));

    if (vGetAttr(svgNode, "flow_fn", mode)) {
      Object.entries(vGetAttr(svgNode, "flow_fn", mode)).forEach( t => {
        let v = t[1].apply(svgNode);
        v = isNumeric(v) ? v + "px" : v;
        stylesComputed.push(`${t[0]}:${v}`);
      } );
    }

    styles = styles.concat([(vGetAttr(svgNode, `style`, mode) || "")]);
    classNames = classNames.concat([(vGetAttr(svgNode, `class`, mode) || "")]);
  });

  if (flowClasses.indexOf("flow") === -1 && flowClasses.indexOf("flow-no-size") === -1) {
    let bbox = svgNode.getBoundingClientRect();
    stylesComputed.unshift(`width: ${bbox.width}px`);
    stylesComputed.unshift(`height: ${bbox.height}px`);
  }

  if (DEBUG) {
    styles.push(`background-color: ${'#'+Math.floor(Math.random()*16777215).toString(16)}`);
  }
  
  domEl.setAttribute("class", classNames.join(" "));
  domEl.setAttribute("style", [...stylesComputed, ...styles].join(";"));
}

FlowLayout.prototype.applyLayout = function(domEl) {
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
    Array.prototype.slice.apply(domEl.children).forEach(this.applyLayout.bind(this));
};

FlowLayout.prototype.commit = function() {

  this.sel.call(() => {
    
    this.createRoot();
  
    //create ghost dom representation of SVG elements
    this.buildDom(this.ROOT_EL, this.sel.node());
  
    this.applyLayout(this.ROOT_EL.firstChild);

    this.clearRoot();

  });

};

export default FlowLayout;