import {isFirefox} from 'khartis/utils/browser-check';

let symbol = function(opts = {}) {
  let name = opts.name,
      scale = opts.scale || 1,
      id = `symbol-${name}`,
      baseUrl = isFirefox() ? window.location : "",
      baseConf = {
        scalable: true,
        anchor: [0.5, 0.5],
        sizeFn: (size) => ({x: size, y: size})
      },
      factory = function() {
        switch (name) {
          case "rect":
            return Object.assign({}, baseConf, {
              tag: "path",
              attrs: {
                d: "M0,0 100,0 100,100 0,100 0,0Z"
              },
              viewBox: [0, 0, 100, 100]
            });
          case "bar":
            let w = opts.barWidth || 16;
            let orientation = opts.sign || 1;
            let foot = 2;
            return Object.assign({}, baseConf, {
              tag: "path",
              attrsFn: (size) => ({
                d: orientation >= 0 ? 
                  `M0,${size} H ${w+foot} M${foot},0 ${w},0 ${w},${size} ${foot},${size} ${foot},0Z`
                  : `M0,0 H ${w+foot} M${foot},0 ${w},0 ${w},${size} ${foot},${size} ${foot},0Z`
              }),
              viewBoxFn: (size) => ([0, 0, w+4, size]),
              sizeFn: (size) => ({x: w, y: size}),
              anchor: [0.5, orientation >= 0 ? 0 : 1],
              scalable: false
            });
          case "line":
            return Object.assign({}, baseConf, {
              tag: "path",
              attrs: {
                d: "M0,0 100,0 100,10 0,10"
              },
              viewBox: [0, 0, 100, 10]
            });
          case "star":
            return Object.assign({}, baseConf, {
              tag: "path",
              attrs: {
                d: "m131,0l32,94l99,0l-79,59l28,94l-80,-56l-80,56l28,-94l-79,-59l99,0l32,-94l0,0z"
              },
              viewBox: [0, 0, 262, 282]
            });
          case "times":
            return Object.assign({}, baseConf, {
              tag: "path",
              attrs: {
                d: "m260,211q0,8 -6,14l-29,29q-6,6 -14,6t-14,-6l-64,-64l-64,64q-6,6 -14,6t-14,-6l-29,-29q-6,-6 -6,-14t6,-14l64,-64l-64,-64q-6,-6 -6,-14t6,-14l29,-29q6,-6 14,-6t14,6l64,64l64,-64q6,-6 14,-6t14,6l29,29q6,6 6,14t-6,14l-64,64l64,64q6,6 6,14z"
              },
              viewBox: [0, 0, 262, 262]
            });
          case "circle":
            return Object.assign({}, baseConf, {
              tag: "circle",
              attrs: {
                r: 10,
                cx: 10,
                cy: 10
              },
              viewBox: [0, 0, 20, 20]
            });
          default:
            throw new Error("unable to generate symbol with name "+name);
        }
      },
      conf = factory(name);
      
  let proc = function() {};

  proc.setSize = function(size) {
    !conf.attrs && conf.attrsFn && (conf.attrs = conf.attrsFn(size));
    !conf.viewBox && conf.viewBoxFn && (conf.viewBox = conf.viewBoxFn(size));
    conf.size = conf.sizeFn(size);
    return proc;
  };

  proc.insert = function(root) {

    //init
    let max = Math.max.apply(this, conf.viewBox),
          s = proc.getScale();

    conf.attrs.transform = `translate(${-conf.viewBox[2]*conf.anchor[0]}, ${-conf.viewBox[3]*(1-conf.anchor[1])})`;

    return root
      .append("g")
      .attr("transform", `scale(${s})`)
      .append(conf.tag).attrs(conf.attrs);

  };

  proc.getAnchor = function() {
    return conf.anchor;
  };

  proc.getSize = function(size) {
    let anchor = proc.getAnchor();
    return Object.assign({}, conf.size, {anchorX: conf.size.x*anchor[0], anchorY: conf.size.y*(1-anchor[1])});
  };

  proc.getScale = function() {
    let min = Math.min(conf.size.x / conf.viewBox[2], conf.size.y/conf.viewBox[3]);
    return conf.scalable ? min : 1;
  };
  
  proc.unscale = function(v) {
    let s = proc.getScale();
    return s >= 0 ? v / s : 0;
  };
  
  proc.url = function() {
   return `${baseUrl}#${id}`;
  };

  return proc.setSize(opts.size || 1);
   
};

const NONE = function() {};
NONE.url = () => "none";

export default {symbol, NONE};
