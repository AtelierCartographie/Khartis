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

export function compressIntervals(intervals) {
  return intervals.reduce( (arr, v) => {
    if (!arr.length || Math.abs(arr[arr.length-1] - v) > 0.0000001) {
      arr.push(v);
    }
    return arr;
  }, []);
};
