import d3 from 'npm:d3';

let d3_behavior_zoomUnboundedScale = [0, Infinity],
    d3_behavior_zoomUnboundedTranslate = [[-Infinity, -Infinity], [Infinity, Infinity]];

// https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel
let d3_behavior_zoomDelta, d3_behavior_zoomWheel
    = "onwheel" in document ? (d3_behavior_zoomDelta = function() { return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1); }, "wheel")
    : "onmousewheel" in document ? (d3_behavior_zoomDelta = function() { return d3.event.wheelDelta; }, "mousewheel")
    : (d3_behavior_zoomDelta = function() { return -d3.event.detail; }, "MozMousePixelScroll");

export default function() {
  var translate = [0, 0],
      translate0, // translate when we started zooming (to avoid drift)
      translateExtent = d3_behavior_zoomUnboundedTranslate,
      absScale = 1,
      scale = 1,
      scale0, // scale when we started touching
      scaleExtent = d3_behavior_zoomUnboundedScale,
      dispatcher = d3.dispatch("zoom"),
      band = 0.001,
      x0,
      x1,
      y0,
      y1,
      touchtime; // time of last touchstart (to detect double-tap)

  function zoom(sel) {
    sel.on("mousedown.zoom", mousedown)
        .on("mousemove.zoom", mousemove)
        .on(d3_behavior_zoomWheel + ".zoom", mousewheel)
        .on("dblclick.zoom", dblclick);
  }

  zoom.translate = function(x) {
    if (!arguments.length) return translate;
    translate = x.map(Number);
    rescale();
    return zoom;
  };

  zoom.translateExtent = function(x) {
    if (!arguments.length) return translateExtent;
    translateExtent = x == null
        ? d3_behavior_zoomUnboundedTranslate
        : [[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]];
    return zoom;
  };

  zoom.scale = function(x) {
    if (!arguments.length) return scale;
    absScale = scale = +x;
    rescale();
    return zoom;
  };

  zoom.scaleExtent = function(x) {
    if (!arguments.length) return scaleExtent;
    scaleExtent = x == null
        ? d3_behavior_zoomUnboundedScale
        : [+x[0], +x[1]];
    return zoom;
  };

  zoom.x = function(z) {
    if (!arguments.length) return x1;
    x1 = z;
    x0 = z.copy();
    translate = [0, 0];
    scale = 1;
    return zoom;
  };

  zoom.y = function(z) {
    if (!arguments.length) return y1;
    y1 = z;
    y0 = z.copy();
    translate = [0, 0];
    scale = 1;
    return zoom;
  };
  
  zoom.band = function(b) {
    band = b;
    return zoom;
  }
  
  zoom.on = function(type, listener) {
    dispatcher.on("zoom", listener);
    return zoom;
  };
  
  zoom.toPoint = function(s, x, y) {
    if (!translate0) translate0 = location([x, y]);
    scaleTo(s);
    translateTo([x, y], translate0);
    dispatch();
  };
  
  zoom.toScaleAndTranslate = function(s, tx, ty) {
    //if (!translate0) translate0 = location([x, y]);
    scaleTo(s);
    translate[0] = tx;
    translate[1] = ty;
    dispatch();
  };
    

  function location(p) {
    return [(p[0] - translate[0]) / scale, (p[1] - translate[1]) / scale];
  }

  function point(l) {
    return [l[0] * scale + translate[0], l[1] * scale + translate[1]];
  }

  function scaleTo(s) {
    absScale = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    let stepped = stepScaleValue(absScale);
    if (scale != stepped) {
      zoom.scale(scale = stepped);
      return true;
    }
    return false;
  }

  function translateTo(p, l) {
    l = point(l);
    translate[0] = Math.max(translateExtent[0][0], Math.min(translateExtent[1][0], p[0] - l[0] + translate[0]));
    translate[1] = Math.max(translateExtent[0][1], Math.min(translateExtent[1][1], p[1] - l[1] + translate[1]));
  }
  
  function stepScaleValue(val) {

    if (band > 0) {

      if (val === scaleExtent[0] || val === scaleExtent[1]) {
        return val;
      }

      let alignValue = val,
          valModStep = (val - scaleExtent[0]) % band;
          
      alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= band) {
        alignValue += (valModStep > 0) ? band : -band;
      }
      
      return alignValue;
      
    } else {
      
      return val;
      
    }

  };

  function rescale() {
    if (x1) x1.domain(x0.range().map(function(x) { return (x - translate[0]) / scale; }).map(x0.invert));
    if (y1) y1.domain(y0.range().map(function(y) { return (y - translate[1]) / scale; }).map(y0.invert));
  }

  function dispatch() {
    rescale();
    if (d3.event) {
      d3.event.preventDefault();
    }
    dispatcher._.zoom[0].value.apply(this, [scale, translate]);
  }

  function prevent() {
    if (d3.event) {
      d3.event.preventDefault();
    }
  }

  function mousedown() {
    if (d3.event.defaultPrevented) return;
    var target = this,
        eventTarget = d3.event.target,
        moved = 0,
        w = d3.select(window).on("mousemove.zoom", mousemove).on("mouseup.zoom", mouseup),
        l = location(d3.mouse(target));

    window.focus();
    
    d3.event.stopPropagation();
    d3.event.preventDefault();

    function mousemove() {
      moved = 1;
      translateTo(d3.mouse(target), l);
      dispatch();
    }

    function mouseup() {
      if (moved) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
      }
      w.on("mousemove.zoom", null).on("mouseup.zoom", null);
      if (moved && d3.event.target === eventTarget) w.on("click.zoom", click, true);
    }

    function click() {
      d3.event.stopPropagation();
      d3.event.preventDefault();
      w.on("click.zoom", null);
    }
  }

  function mousewheel() {
    if (!translate0) translate0 = location(d3.mouse(this));
    let commited = scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * absScale);
    translateTo(d3.mouse(this), translate0);
    if (commited) {
      dispatch();
    } else {
      prevent();
    }
  }

  function mousemove() {
    translate0 = null;
  }

  function dblclick() {
    var p = d3.mouse(this), l = location(p), k = Math.log(scale) / Math.LN2;
    scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));
    translateTo(p, l);
    dispatch();
  }

  return zoom;
  
};
