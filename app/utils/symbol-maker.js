let symbol = function(opts = {}) {
  let name = opts.name,
      scale = opts.scale || 1,
      id = `symbol-${name}`,
      factory = function() {
        switch (name) {
          case "rect":
            return {
              tag: "path",
              attrs: {
                d: "M0,0 100,0 100,100 0,100"
              },
              viewBox: "0 0 100 100"
            };
          case "bar":
            return {
              tag: "path",
              attrs: {
                d: "M0,0 25,0 25,100 0,100"
              },
              viewBox: "0 0 25 100"
            };
          case "line":
            return {
              tag: "path",
              attrs: {
                d: "M0,0 100,0 100,10 0,10"
              },
              viewBox: "0 0 100 10"
            };
          case "star":
            return {
              tag: "path",
              attrs: {
                d: "m131,0l32,94l99,0l-79,59l28,94l-80,-56l-80,56l28,-94l-79,-59l99,0l32,-94l0,0z"
              },
              viewBox: "0 0 262 250"
            };
          case "times":
            return {
              tag: "path",
              attrs: {
                d: "m260,211q0,8 -6,14l-29,29q-6,6 -14,6t-14,-6l-64,-64l-64,64q-6,6 -14,6t-14,-6l-29,-29q-6,-6 -6,-14t6,-14l64,-64l-64,-64q-6,-6 -6,-14t6,-14l29,-29q6,-6 14,-6t14,6l64,64l64,-64q6,-6 14,-6t14,6l29,29q6,6 6,14t-6,14l-64,64l64,64q6,6 6,14z"
              },
              viewBox: "0 0 262 262"
            };
          case "circle":
            return {
              tag: "circle",
              attrs: {
                r: 10,
                cx: 10,
                cy: 10
              },
              viewBox: "0 0 20 20"
            };
          default:
            throw new Error("unable to generate symbol with name "+name);
        }
      };
      
  let proc = function() {
    
    let defs = this.selectAll("defs");
    
    if (defs.empty()) {
      defs = this.append("defs");
    }
      
    let symbol = defs.selectAll(`#${id}`);
    
    if (symbol.empty()) {
      
      let conf = factory(name);
      
      symbol = defs.append("symbol")
        .attr({
          id: id,
          viewBox: conf.viewBox
        });
      
      symbol.append(conf.tag).attr(conf.attrs);
      
    }
    
  }
  
  proc.url = function() {
   return `${window.location}#${id}`;
  }
  
  return proc;
   
};

const NONE = function() {};
NONE.url = () => "none";

export default {symbol, NONE};
