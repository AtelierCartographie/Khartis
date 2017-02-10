export function insideInterval(ext, v) {
  return v >= ext[0] && v <= ext[1];
};

export function nestedMeans(values, classes) {

  let means = [],
      ext = d3.extent(values),
      mean = (ext) => {
        return d3.mean(values.filter( v => insideInterval(ext, v) ));
      };
  
  for (;means.length+1 < classes;) {
    let exts = [ext[0], ...means, ext[1]].reduce( (out, m, i, arr) => {
      if (i < arr.length-1) {
        out.push([arr[i], arr[i+1]]);
      }
      return out;
    }, []);
    means = means.concat(exts.map( ext => mean(ext) )).sort(d3.ascending);
  }
  return means.sort(d3.ascending);

};

export function standardDeviation(values, classes) {
  let ext = d3.extent(values),
      mean = d3.mean(values),
      theta = d3.deviation(values),
      even = classes % 2 === 0,
      lgt = classes-1,
      intervals = [];
  if (even) {
    intervals = Array.from({length: lgt}, (x, i) => {
      x = mean - theta*(i-(Math.floor(lgt/2)));
      x = Math.min(Math.max(ext[0], x), ext[1]);
      return x;
    });
  } else {
    intervals = Array.from({length: lgt}, (x, i) => {
      x = mean - theta*(i-(Math.floor(lgt/2))) - theta/2;
      x = Math.min(Math.max(ext[0], x), ext[1]);
      return x;
    });
  }
  return intervals.sort(d3.ascending);
};

export function compressIntervals(intervals) {
  return intervals.reduce( (arr, v) => {
    if (!arr.length || Math.abs(arr[arr.length-1] - v) > 0.0000001) {
      arr.push(v);
    }
    return arr;
  }, []);
};
