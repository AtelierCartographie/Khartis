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

/**
	 * Inspired by https://github.com/simogeo/geostats
	 */
export function jenks(values, classes) {
	
		let data = values.slice().sort(d3.ascending);

		let lgt = data.length,
        variance = 0,
        mLcl = [], //lower class limits
        mVc = []; //variance combinations

		for ( let x = 0; x <= lgt; x++) {
			mLcl[x] = []; mVc[x] = [];
			for ( var j = 0; j <= classes; j++) {
				mLcl[x][j] = x === 0 ? 1 : 0;
        mVc[x][j] = x === 0 ? 0 : Infinity;
			}
		}

		for ( let l = 2; l <= lgt; l++ ) {
			
      let sum = 0.0, //sum of the values seen thus far when calculating variance.
			    sum_sq = 0.0, //sum squares
			    w = 0.0;

			for ( let m = 1; m <= l; m++ ) {

				let i4 = l - m,
            lcl = i4 + 1, //lower class limit
				    val = data[i4];

				sum_sq += val * val;
				sum += val;
				w += 1;
				variance = sum_sq - (sum * sum) / w;

				if (i4 != 0) {
					for ( let p = 2; p <= classes; p++ ) {
						if (mVc[l][p] >= (variance + mVc[i4][p - 1])) {
							mLcl[l][p] = lcl
							mVc[l][p] = variance + mVc[i4][p - 1]
						}
					}
				}
			}
      
			mLcl[l][1] = 1;
			mVc[l][1] = variance;
		}

    let kclass = [],
        cnt = classes,
        k = lgt-1;
		
    while (cnt > 1) {
        kclass[cnt - 2] = data[mLcl[k][cnt] - 2];
        k = mLcl[k][cnt] - 1;
        cnt--;
    }

    return kclass;

};

export function compressIntervals(intervals, extent = []) {
  return intervals.reduce( (arr, v) => {
    if (!arr.concat(extent).some( v2 => Math.sign(v2) === Math.sign(v) && Math.abs(v2 - v) < Math.abs(v)*Number.EPSILON )) {
      arr.push(v);
    }
    return arr;
  }, []);
};
