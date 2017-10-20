const epsilon = 1e-6;
const pi = Math.PI;
const halfPi = pi / 2;
const {atan2, cos, sin, asin, abs, sqrt} = Math;
const deg = 180/pi;

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

function spherical(cartesian) {
  return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
  return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
}

export function solve(project, precision) {

  function makeGrid(bounds, sqrtSize=2) {
    let grid = [],
        stepX = (bounds[2]-bounds[0])/sqrtSize,
        stepY = (bounds[3]-bounds[1])/sqrtSize;
    for (let i = 0; i < sqrtSize; i++) {
      for (let j = 0; j < sqrtSize; j++) {
        grid[i*sqrtSize+j] = [
          bounds[0]+i*stepX,
          bounds[1]+j*stepY,
          bounds[0]+(i+1)*stepX,
          bounds[1]+(j+1)*stepY
        ];
      }
    }
    return grid;
  }

  function insideBounds(coords, bounds) {
    let cartesianBounds = [...project([bounds[0], bounds[1]]), ...project([bounds[2], bounds[3]])];
    return (coords[0] - cartesianBounds[0])*(coords[0] - cartesianBounds[2]) <= 0
      && (coords[1] - cartesianBounds[1])*(coords[1] - cartesianBounds[3]) <= 0;
  }

  function boundsDistance(coords, bounds) {
    let cartesianBounds = [
      project([bounds[0]*deg, bounds[1]*deg]),
      project([bounds[0]*deg, bounds[3]*deg]),
      project([bounds[2]*deg, bounds[1]*deg]),
      project([bounds[2]*deg, bounds[3]*deg])
    ];
    return cartesianBounds.reduce( (sum, point) => {
      return sum += (point[0] - coords[0])*(point[0] - coords[0]) + (point[1] - coords[1])*(point[1] - coords[1]);
    }, 0);
  }

  function nearestCorner(coords, bounds) {
    let corners = [
      [bounds[0]*deg, bounds[1]*deg],
      [bounds[0]*deg, bounds[3]*deg],
      [bounds[2]*deg, bounds[1]*deg],
      [bounds[2]*deg, bounds[3]*deg]
    ];
    return corners.reduce( (out, point) => {
      let cartPoint = project(point);
      let sqrtDist = (cartPoint[0] - coords[0])*(cartPoint[0] - coords[0]) + (cartPoint[1] - coords[1])*(cartPoint[1] - coords[1]);
      if (sqrtDist < out.min) {
        return {min: sqrtDist, point};
      }
      return out;
    }, {min: +Infinity, point: null}).point;
  }

  function invert(coords) {
    let maxIteration = 30,
        iteration = 0,
        bounds = [-pi+epsilon, -halfPi-epsilon, pi-epsilon, halfPi+epsilon];
    while (iteration < maxIteration) {
      let grid = makeGrid(bounds, 2);
      let min = grid.reduce( (out, b) => {
        let sqrtDist = boundsDistance(coords, b);
        if (sqrtDist < out.min) {
          return {
            min: sqrtDist,
            bound: b
          };
        }
        return out;
       }, {min: +Infinity, bound: null});
      bounds = min.bound;
      iteration++;
    }
    return nearestCorner(coords, bounds);
  }

  return invert;

};

// export function solve(project, precision) {
  
  
//   function invert (coords) {
//     let n = 100,
//       step = (halfPi - epsilon) / n,
//       i,
//       j,
//       grid = [];
//       for (i = 0; i <= 4 * n; i++) {
//         grid[i] = [];
//         for (j = 0; j <= 2 * n; j++) {
//           grid[i][j] = project([(i - 2 * n) * step, (j - n) * step]);
//         }
//       }
//     // find a start point c "close enough" to x,y
//     let x = coords[0],
//       y = coords[1],
//       c,
//       m,
//       min = +Infinity;
//     // d3.scan
//     for (i = 0; i <= 4 * n; i++) {
//       for (j = 0; j <= 2 * n; j++) {
//         m = abs(x - grid[i][j][0]) + abs(y - grid[i][j][1]);
//         if (m < min) {
//           c = [grid[i][j][0], grid[i][j][1]];
//           min = m;
//         }
//       }
//     }
//     //c = [ step * (c[0] - 2 * n), step * (c[1] - n) ];
//     c = cartesian(c);

//     console.log(x, y, grid, c);

//     // solve for x,y
//     var solution = Newton.Solve(g => {
//       var norm = g[0] * g[0] + g[1] * g[1] + g[2] * g[2];
//       //g = cartesianScale(g, 1 / sqrt(norm));
//       var s = spherical(g),
//       p = project([s[0], s[1]]);
      
//       //console.log(s, p);
//       return [p[0], p[1], norm];
//     }, [x, y, 1], { start: c, acc: precision });
//     console.log(solution);
//     var norm = solution[0] * solution[0] + solution[1] * solution[1] + solution[2] * solution[2];
//     solution = cartesianScale(solution, 1 / sqrt(norm));
//     return spherical(solution);
//   }

//   return invert;
// }

// /*
//   * Newton's method for finding roots
//   *
//   * code adapted from D.V. Fedorov,
//   * “Introduction to Numerical Methods with examples in Javascript”
//   * http://owww.phys.au.dk/~fedorov/nucltheo/Numeric/11/book.pdf
//   * (licensed under the GPL)
//   * by Philippe Riviere <philippe.riviere@illisible.net> March 2014
//   * modified for compatibility with Chrome/Safari
//   * added a max iterations parameter
//   *
//   * Usage: Newton.Solve(Math.exp, 2)); => ~ log(2)
//   *        Newton.Solve(d3.geo.chamberlin(), [200,240])
//   */
// var Newton = {version: "1.0.0"}; // semver

//   Newton.Norm = function (v) {
//       return Math.sqrt(v.reduce(function (s, e) {
//           return s + e * e
//       }, 0));
//   }

//   Newton.Dot = function (a, b) {
//       var s = 0;
//       for (var i in a) s += a[i] * b[i];
//       return s;
//   }

//   // QR - decomposition A=QR of matrix A
//   Newton.QRDec = function(A){
//     var m = A.length, R = [], i, j, k;
//     for (j in A) {
//         R[j] = [];
//         for (i in A) R[j][i] = 0;
//     }

//     var Q = [];
//     for (i in A) {
//         Q[i] = [];
//         for (j in A[0]) Q[i][j] = A[i][j];
//     }

//     // Q is a copy of A
//     for (i = 0; i < m; i++) {
//         var e = Q[i],
//             r = Math.sqrt(Newton.Dot(e, e));
//         if (r == 0) throw "Newton.QRDec: singular matrix"
//         R[i][i] = r;
//         for (k in e) e[k] /= r;
//         // normalization
//         for (j = i + 1; j < m; j++) {
//             var q = Q[j],
//                 s = Newton.Dot(e, q);
//             for (k in q) q[k] -= s * e[k];
//             // orthogonalization
//             R[j][i] = s;
//         }
//     }
//     return [Q, R];
//   };

//   // QR - backsubstitution
//   // input: matrices Q,R, array b; output: array x such that QRx=b
//   Newton.QRBack = function(Q, R, b) {
//     var m = Q.length,
//         c = new Array(m),
//         x = new Array(m),
//         i, k, s;
//     for (i in Q) {
//         // c = QˆT b
//         c[i] = 0;
//         for (k in b) c[i] += Q[i][k] * b[k];
//     }
//     for (i = m - 1; i >= 0; i--) {
//         // back substitution
//         for (s = 0, k = i + 1; k < m; k++) s += R[k][i] * x[k];
//         x[i] = (c[i] - s) / R[i][i];
//     }
//     return x;
//   }

//   // calculates inverse of matrix A
//   Newton.Inverse = function(A){
//     var t = Newton.QRDec(A),
//         Q = t[0],
//         R = t[1];
//     var m = [], i, k, n;
//     for (i in A) {
//         n = [];
//         for (k in A) {
//             n[k] = (k == i ? 1 : 0)
//         }
//         m[i] = Newton.QRBack(Q, R, n);
//     }
//     return m;
//   };

//   Newton.Zero = function (fs, x, opts={} /* acc, dx, max */) {
//     // Newton's root-finding method
//     var i, j, k;

//     if (opts.acc == undefined) opts.acc = 1e-6
//     if (opts.dx == undefined) opts.dx = 1e-3
//     if (opts.max == undefined) opts.max = 40 // max iterations
//     var J = [];
//     for (i in x) {
//         J[i] = [];
//         for (j in x) J[i][j] = 0;
//     }

//     var minusfx = [];
//     var v = fs(x);
//     if (v == null) throw "unable to compute fs at "+JSON.stringify(x)
//     for (i in x) minusfx[i] = -v[i];
//     do {
//         if (opts.max-- < 0) return null;
//         for (i in x)
//             for (k in x) {
//                 // calculate Jacobian
//                 x[k] += opts.dx
//                 v = fs(x);
//                 if (v == null) throw "unable to compute fs at "+JSON.stringify(x)
//                 J[k][i] = (v[i] + minusfx[i]) / opts.dx
//                 x[k] -= opts.dx
//             }
//         var t = Newton.QRDec(J),
//             Q = t[0],
//             R = t[1],
//             Dx = Newton.QRBack(Q, R, minusfx)
//             // Newton's step
//             var s = 2
//         do {
//             // simple backtracking line search
//             s = s / 2;
//             var z = [];
//             for (i in x) {
//                 z[i] = x[i] + s * Dx[i];
//             }

//             var minusfz = [];
//             v = fs(z);
//             if (v == null) throw "unable to compute fs at "+JSON.stringify(z)
//             for (i in x) {
//                 minusfz[i] = -v[i];
//             }
//         }
//         while (Newton.Norm(minusfz) > (1 - s / 2) * Newton.Norm(minusfx) && s > 1. / 128)
//         minusfx = minusfz;
//         x = z;
//         // step done
//     }
//     while (Newton.Norm(minusfx) > opts.acc)

//     return x;
//   }

//   Newton.Solve = function(fs, res, opts={}){
//     if (typeof res != 'object') res = [ typeof res == 'number'
//         ? + res
//         : 0
//     ];
//     var _fs = fs;
//     fs = function(x) {
//         var r = _fs(x);
//         if (typeof r == 'number') r = [ r ];
//         for (var i in r) r[i] -= res[i];
//         return r;
//     }

//     var start = [];
//     if (opts.start) {
//         start = opts.start;
//     } else {
//         for (var i in res) start[i]=0;
//     }

//     var n = Newton.Zero(fs, start, opts);
//     if (n && n.length == 1) n = n[0];
//     return n;
//   };
  
