import {isFirefox} from 'khartis/utils/browser-check';
import SymbolConfig from './symbol-config';

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
          if (opts.clipped) {
            const sweepFlag = opts.clipRegion === "left" ? 1 : 0;
            return Object.assign({}, baseConf, {
              els: [{
                tag: "path",
                attrs: {
                  d: sweepFlag ? "M50,0 100,0 100,100 50,100 50,0Z" : "M0,0 50,0 50,100 0,100 0,0Z"
                }
              }],
              viewBox: [0, 0, 100, 100]
            });
          } else {
            return Object.assign({}, baseConf, {
              els: [{
                tag: "path",
                attrs: {
                  d: "M0,0 100,0 100,100 0,100 0,0Z"
                }
              }],
              viewBox: [0, 0, 100, 100]
            });
          }
          case "bar":
            let w = opts.barWidth || 16;
            let orientation = opts.sign || 1;
            let foot = 0.25;
            return Object.assign({}, baseConf, {
              els: [
                {
                  tag: "path",
                  attrsFn: (size) => ({
                    d: orientation >= 0 ?
                      `M${foot*size.x},${size.y} ${foot*size.x},0 ${w},0 ${w},${size.y}`
                      : `M${foot*size.x},${0} ${foot*size.x},${size.y} ${w},${size.y} ${w},0`
                    }),
                },
                {
                  tag: "path",
                  attrsFn: (size) => ({
                    d: orientation >= 0 ? 
                      `M0,${size.y} H ${w+foot*size.x}`: `M0,0 H ${w+foot*size.x}`,
                    "stroke-width": 1
                  }),
                }
              ],
              viewBoxFn: (size) => ([0, 0, w*(1+foot), size]),
              sizeFn: (size) => ({x: w, y: size}),
              anchor: [0.5, orientation >= 0 ? 0 : 1],
              scalable: false
            });
          case "line":
            return Object.assign({}, baseConf, {
              els: [{
                tag: "path",
                attrs: {
                  d: "M0,0 100,0 100,10 0,10"
                },
              }],
              viewBox: [0, 0, 100, 10]
            });
          case "star":
            return Object.assign({}, baseConf, {
              els: [{
                tag: "path",
                attrs: {
                  d: "m131,0l32,94l99,0l-79,59l28,94l-80,-56l-80,56l28,-94l-79,-59l99,0l32,-94l0,0z"
                },
              }],
              viewBox: [0, 0, 262, 282]
            });
          case "times":
            return Object.assign({}, baseConf, {
              els: [{
                tag: "path",
                attrs: {
                  d: "m260,211q0,8 -6,14l-29,29q-6,6 -14,6t-14,-6l-64,-64l-64,64q-6,6 -14,6t-14,-6l-29,-29q-6,-6 -6,-14t6,-14l64,-64l-64,-64q-6,-6 -6,-14t6,-14l29,-29q6,-6 14,-6t14,6l64,64l64,-64q6,-6 14,-6t14,6l29,29q6,6 6,14t-6,14l-64,64l64,64q6,6 6,14z"
                },
              }],
              viewBox: [0, 0, 262, 262]
            });
          // case "circle":
          //   
          case "circle":
            if (opts.clipped) {
              const sweepFlag = opts.clipRegion === "left" ? 1 : 0;
              return Object.assign({}, baseConf, {
                els: [
                  {
                    tag: "path",
                    attrsFn: (size) => ({
                      d: `M 10, 10 m 0, -10 a 10 10, 0, 0, ${sweepFlag}, 0 20 L 10 0`
                    }),
                  }
                ],
                viewBox: [0, 0, 20, 20]
              });
            } else {
              return Object.assign({}, baseConf, {
                els: [{
                  tag: "circle",
                  attrs: {
                    r: 10,
                    cx: 10,
                    cy: 10
                  },
                }],
                viewBox: [0, 0, 20, 20]
              });
            }
          case "triangle":
            return Object.assign({}, baseConf, {
              els: [{
                tag: "polygon",
                attrs: {
                  points: "6 0 0 10 12 10 6 0"
                },
              }],
              viewBox: [0, 0, 12, 10]
            });
          default:
            if (SymbolConfig[name]) {
              return Object.assign({}, baseConf, SymbolConfig[name]);
            } else {
              throw new Error("unable to generate symbol with name "+name);
            }
        }
      },
      conf = factory();
      
  let proc = function() {};

  proc.setSize = function(size) {
    !conf.viewBox && conf.viewBoxFn && (conf.viewBox = conf.viewBoxFn(size));
    conf.size = conf.sizeFn(size);
    return proc;
  };

  proc.insert = function(root, [tx, ty] = [0, 0]) {

    //init
    let max = Math.max.apply(this, conf.viewBox),
          s = proc.getScale();

    let g = root
      .append("g")
      .attr("transform", `scale(${s}) translate(${tx/s} ${ty/s})`);

    conf.els.forEach(el => {
      let attrs = Object.assign({}, el.attrsFn ? el.attrsFn(conf.size) : el.attrs);
      attrs.transform = `translate(${-conf.viewBox[2]*conf.anchor[0]}, ${-conf.viewBox[3]*(1-conf.anchor[1])}) ` + (attrs.transform || "");
      g.append(el.tag).attrs(attrs);
    });
    
    return g;
  };

  proc.getAnchor = function() {
    return conf.anchor;
  };

  proc.getSize = function() {
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

  proc.getBounds = function() {
    let s = proc.getScale(),
        width = conf.viewBox[2]*s,
        height = conf.viewBox[3]*s,
        x = width*conf.anchor[0] - width/2, //x, y are relative to center
        y = height*conf.anchor[1] - height/2;
    return {type: name === "circle" ? "circle" : "box", x, y, width, height};
  };

  return proc.setSize(opts.size || 1);
   
};

const NONE = function() {};
NONE.url = () => "none";

export default {symbol, NONE};
