const epsilon = 1e-6;
const pi = Math.PI;
const halfPi = pi / 2;
const {abs, sqrt} = Math;

export function solve(project, precision) {

  function clampX(x) {
    if (x < -180) {
      return 180+(x%180);
    } else if (x > 180) {
      return -180+(x%180)
    } else {
      return x;
    }
  }

  function clampY(y) {
    if (y < -90) {
      return 90+(y%90);
    } else if (y > 90) {
      return -90+(y%90)
    } else {
      return y;
    }
  }

  function makeGrid(bounds, center = [0,0]) {
    let nodes = [],
        s = 3, //should be impair
        start = Math.floor(s/2),
        stepX = bounds[0]/s,
        stepY = bounds[1]/s;
    for (let i = 0; i < s; i++) {
      for (let j = 0; j < s; j++) {
        nodes[i*s+j] = [
          clampX(center[0] + (i-start)*stepX),
          clampY(center[1] + (j-start)*stepY)
        ];
      }
    }
    return {nodes, stepX, stepY};
  }

  function reBoundGrid(grid, node) {
    let bounds = [
          2.1*grid.stepX,
          2.1*grid.stepY
        ];
    return makeGrid(bounds, node);
  }

  function nearestNode(coords, nodes) {
    return nodes.reduce( (out, node) => {
      let cartPoint = project([node[0], node[1]]);
      let sqrtDist = (cartPoint[0] - coords[0])*(cartPoint[0] - coords[0]) + (cartPoint[1] - coords[1])*(cartPoint[1] - coords[1]);
      if (sqrtDist < out.min) {
        return {min: sqrtDist, node, ratio: sqrtDist/out.min};
      }
      return out;
    }, {min: +Infinity, node: null, ratio: 1});
  }

  function invert(coords) {
    let distPrecision = 1e-4,
        coordPrecision = 10e-7,
        it = 0,
        bounds = [360, 180],
        grid = makeGrid(bounds, [0,0]),
        nearest = nearestNode(coords, grid.nodes);
    while (it < 100 && nearest.min > distPrecision && grid.stepX > coordPrecision && grid.stepY > coordPrecision) {
      grid = reBoundGrid(grid, nearest.node);
      nearest = nearestNode(coords, grid.nodes);
      it++;
    }
    console.log(`itérations : ${it}`);
    return nearest.node;
  }

  invert.debug = function(coords) {
    let distPrecision = 1e-3,
      coordPrecision = 10e-7,
      it = 0,
      bounds = [360, 180],
      grid = makeGrid(bounds, [0,0]),
      nearest = nearestNode(coords, grid.nodes),
      debugNodes = [];
    console.log(grid.nodes);
    while (it < 100 && nearest.min > distPrecision && grid.stepX > coordPrecision && grid.stepY > coordPrecision) {
      debugNodes = debugNodes.concat(grid.nodes.map( n => project([n[0], n[1]])) );
      grid = reBoundGrid(grid, nearest.node);
      nearest = nearestNode(coords, grid.nodes);
      console.log(nearest.min);
      it++;
    }
    debugNodes = debugNodes.concat(grid.nodes.map( n => project([n[0], n[1]])) );
    console.log(`itérations : ${it}`);
    return {node: nearest.node, debugNodes};
  }
 
  return invert;

};
