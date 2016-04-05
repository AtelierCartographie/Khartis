import Ember from 'ember';
import Struct from 'mapp/models/struct';
import Colorbrewer from 'mapp/utils/colorbrewer';

let Scale = Struct.extend({
  
  type: null,
  
  classes: 8,
  
  intervalType: "average",
  
  asD3: function() {
    return eval("d3.scale."+this.get('type')+"()");
  }.property('type'),
  
  getIntervals: function(vals) {
    
    if (this.get('intervalType') === "regular") {
      let ext = d3.extent(vals),
          band = (ext[1] - ext[0])/this.get('classes');
      return Array.from({length: this.get('classes')-1}, (v, i) => (i+1)*band );
    } else if (this.get('intervalType') === "quantile") {
      return d3.scale.quantile()
        .domain(vals)
        .range(Array.from({length: this.get('classes')}, (v, i) => i))
        .quantiles();
    } else if (this.get('intervalType') === "average") {
      
      let means = [],
          isInside = (ext, v) => v >= ext[0] && v <= ext[1],
          mean = (ext) => {
            return d3.mean(vals.filter( v => isInside(ext, v) ));
          };
      
      for (;means.length+1 < this.get('classes');) {
        let exts = means.reduce( (arr, m, i) => {
          let e = arr[i];
          arr[i] = [e[0], m];
          arr.push([m, e[1]]);
          return arr;
        }, [d3.extent(vals)]);
        console.log(exts);
        means = exts.map( ext => mean(ext) );
      }
      
      console.log(means);
      return means;
      
    }
    
  },
  
  export(props) {
    return this._super(Object.assign({
      type: this.get('type')
    }, props));
  }
  
});

Scale.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      type: json.type
    });
    return o;
  }
});


export default Scale;
