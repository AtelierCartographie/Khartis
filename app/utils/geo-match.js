let _cache = new Map(),
    _find = function(str) {
      
      let strEq = (s1, s2) => {
        return s1 && s2 && (""+s1).toLowerCase().trim() === (""+s2).toLowerCase().trim();
      };
      
      let dic = geoMatch.dic,
          keys = geoMatch.keyCodes,
          key = str,
          idx = _cache.get(key),
          o = idx >= 0 ? dic[idx] : undefined;
      
      if (o === undefined) {
      
        for (let l = dic.length, i = 0; i < l; i++) {
          if (keys.some( (k) => strEq(dic[i][k], str) )) {
            _cache.set(key, i);
            o = dic[i];
            break;
          }
        }
        
      }
      
      return o;
      
    };

function geoMatch(code) {
  
  if (code && code.length > 0) {
    
    let o = _find(code);
    if (o !== undefined) {
      
      let type;
          
      if (o.iso_a2.toLowerCase() === code.toLowerCase()) {
        type = "iso2";
      } else if (o.iso_a3.toLowerCase() === code.toLowerCase()) {
        type = "iso3";
      } else {
        type = "isoname";
      }
      
      return {
        type: type,
        value: o
      };
    }
  }
  
  return false;
}


geoMatch._keys = undefined;

geoMatch.dic = [];

Object.defineProperty(geoMatch, "keyCodes", {
  get() {
    if (!this._keys) {
      this._keys = this.dic.reduce( 
        (kSet, v) => {
          Object.keys(v).forEach( k => kSet.add(k));
          return kSet;
        }, new Set());
    }
    return [...this._keys];
  } 
});

export {geoMatch};
