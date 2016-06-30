let StringNormalizer = function() {

  let map = {
      "a": "àáâãäå",
      "c": "ç",
      "e": "èéêë",
      "i": "ìíîï",
      "n": "ñ",
      "o": "òóôõöø",
      "s": "ß",
      "u": "ùúûü",
      "y": "ÿ",
      " ": "-"
    },
    mapKeys = Object.keys(map);

  this.rgx = new RegExp(Object.values(map).map( v => `([${v.replace(/\-/g, "\\-")}])` ).join("|"), "g");
  this.consume = function(grps) {
    for (let i = 0; i < grps.length; i++) {
      if (grps[i]) {
        return mapKeys[i];
      }
    }
  };

};

StringNormalizer.prototype.$ = function(inStr) {
  let self = this;
  return inStr.replace(this.rgx, function() {
      return self.consume(Array.prototype.slice.call(arguments, 1, arguments.length-2));
  });

};

let _strNorm = new StringNormalizer(),
    _cache = new Map(),
    _find = function(str) {

      str = _strNorm.$((""+str).toLowerCase().trim());

      let strEq = function(s) {
        return str && s && str === _strNorm.$((""+s).toLowerCase());
      };
      
      let dic = geoMatch.dic,
          lIndex = geoMatch._lIndex,
          cidx = _cache.get(str),
          o = cidx >= 0 ? dic[cidx] : undefined;
      
      if (o === undefined) {
        if (lIndex.has(str.length)) {
          for (var [idx, keys] of lIndex.get(str.length).entries()) {
            if (keys.some( k => strEq(dic[idx][k], str) )) {
              _cache.set(str, idx);
              o = dic[idx];
              break;
            }
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
geoMatch._dic = undefined;
geoMatch._lIndex = undefined;
geoMatch._buildIndex = function() {
  this._lIndex = new Map();
  this._dic.forEach( (r, idx) => {
    this.keyCodes.forEach( k => {
      let l = (""+r[k]).length;
      if (!this._lIndex.has(l)) {
        this._lIndex.set(l, new Map());
      }
      if (!this._lIndex.get(l).has(idx)) {
        this._lIndex.get(l).set(idx, []);
      }
      this._lIndex.get(l).get(idx).push(k);
    });
  });
};

Object.defineProperty(geoMatch, "dic", {
  get() {
    return this._dic;
  },
  set(v) {
    this._dic = v;
    this._buildIndex();
  }
});

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
