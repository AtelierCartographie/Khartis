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
    _cache = new Map();

function GeoMatcher() {

  Object.defineProperty(this, "dic", {
    get() {
      return this._dic;
    },
    set(v) {
      this._dic = v;
      this._buildIndex();
    }
  });

  Object.defineProperty(this, "keyCodes", {
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

}

GeoMatcher.prototype.isReady = function() {
  return this._dic != undefined;
};

GeoMatcher.prototype.match = function(code) {

  if (code && code.length > 0) {
    
    let str = _strNorm.$((""+code).toLowerCase().trim()),
        strEq = function(s) {
          return str && s && str === _strNorm.$((""+s).toLowerCase());
        },
        dic = this.dic,
        lIndex = this._lIndex,
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

    if (o !== undefined) {
      
      return {
        type: "name",
        value: o
      };
      
    }
  }
  
  return false;
};

GeoMatcher.prototype._keys = undefined;
GeoMatcher.prototype._dic = undefined;
GeoMatcher.prototype._lIndex = undefined;
GeoMatcher.prototype._buildIndex = function() {
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

let matcher = new GeoMatcher();

export {matcher};
