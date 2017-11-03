const epsilon = 1e-6;
const pi = Math.PI;
const halfPi = pi / 2;
const {atan2, cos, sin, asin, abs, sqrt} = Math;
const deg = 180/pi;

export function solve(project, precision) {

  function clampX(x) {
    return Math.min(Math.max(-180, x), 180);
  }

  function clampY(x) {
    return Math.min(Math.max(-90, x), 90);
  }

  function makeGrid(bounds, center = [0,0]) {
    let nodes = [],
        s = 3,
        stepX = (bounds[2]-bounds[0])/s,
        stepY = (bounds[3]-bounds[1])/s;
    for (let i = 0; i < s; i+=2) {
      for (let j = 0; j < s; j+=2) {
        nodes[i*2+j] = [
          clampX(center[0] + (i-1)*stepX),
          clampY(center[1] + (j-1)*stepY)
        ];
      }
    }
    nodes.push(center);
    return {nodes, stepX, stepY};
  }

  function reBoundGrid(grid, node) {
    let bounds = [
        node[0]-grid.stepX,
        node[1]-grid.stepY,
        node[0]+grid.stepX,
        node[1]+grid.stepY
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
    let precision = 10e-7,
      it = 0,
      bounds = [-180+epsilon, -90-epsilon, 180-epsilon, 90+epsilon],
      grid = makeGrid(bounds, [0,0]),
      nearest = nearestNode(coords, grid.nodes);
    while (grid.stepX > precision && grid.stepY > precision) {
      grid = reBoundGrid(grid, nearest.node);
      nearest = nearestNode(coords, grid.nodes);
      console.log(nearest.ratio);
      it++;
    }
    console.log(`itérations : ${it}`);
    return nearest.node;
  }
 
  return invert;

};
