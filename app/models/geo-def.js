import Ember from 'ember';
import Struct from './struct';

let GeoDef = Struct.extend({
  
  columns: null,
  
  init() {
    this._super();
    if (!this.get('columns')) {
      this.set('columns', Em.A());
    }
  },
  
  isGeoRef: function() {
    return this.get('columns').length === 1 && this.get('columns')[0].get('meta.type') === "geo";
  }.property('columns.[]'),
  
  isLatLon: function() {
    return this.get('columns').length === 2 
      && (this.get('columns')[0].get('meta.type') === "lat" || this.get('columns')[0].get('meta.type') === "lat_dms")
      && (this.get('columns')[1].get('meta.type') === "lon" || this.get('columns')[1].get('meta.type') === "lon_dms");
  }.property('columns.[]'),
  
  label: function() {
    if (this.get('isGeoRef')) {
      return this.get('geo.header.value');
    } else if (this.get('isLatLon')) {
      return this.get('lat.header.value') + "/" + this.get('lon.header.value');
    }
  }.property('columns.[]', 'isGeoRef', 'isLatLon'),
 
  geo: function() {
    return this.get('columns')[0];
  }.property('isGeoRef'),
  
  lat: function() {
    return this.get('columns')[0];
  }.property('isLatLon'),
  
  lon: function() {
    return this.get('columns')[1];
  }.property('isLatLon'),

  latLonCouples: function() {
    let lat = this.get('lat'),
        lon = this.get('lon'),
        min = Math.min(lat.get('body').length, lon.get('body').length),
        couples = [];

    for (let i = 0; i < min; i++) {
      couples.push({lat: lat.get('body')[i], lon: lon.get('body')[i]});
    }
    return couples;
  }.property('isLatLon'),
  
  type: function() {
    if (this.get('isGeoRef')) {
      return "geo";
    } else {
      return "lat";
    }
  }.property('isGeoRef', 'isLatLon'),
  
  inconsistency: function() {
    return this.get('columns').reduce( (s, c) => s += c.get('inconsistency'), 0 );
  }.property('columns.[]'),
  
  deferredChange: Ember.debouncedObserver(
    'columns.@each._defferedChangeIndicator',
    function() {
      this.notifyDefferedChange();
    },
    10),
  
  
  export() {
    return this._super({
      columns: this.get('columns').map( c => c._uuid )
    });
  }
  
});

GeoDef.reopenClass({
  
  createWithColumns({geo, lat, lon}) {
    if (geo) {
      return this.create({columns: Em.A([geo])});
    } else if (lat && lon) {
      return this.create({columns: Em.A([lat, lon])});
    } else {
      throw new Error("bad arguments");
    }
  },
  
  restore(json, refs = {}) {
    return this._super(json, refs, {
      columns: json.columns != null ? json.columns.map( c => refs[c] ) : null
    });
  }
  
});

export default GeoDef;
