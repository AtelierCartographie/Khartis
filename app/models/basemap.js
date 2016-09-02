import Ember from 'ember';
import Struct from './struct';
import config from 'mapp/config/environment';
import {matcher as geoMatcher} from 'mapp/utils/geo-matcher';

var Basemap = Struct.extend({
  
  id: null,

  /* transients */
  mapConfig: null,
  mapData: null,
  dictionaryData: null,
  /* ---------- */

  idChange: function() {

    this.setProperties({
      mapConfig: null,
      mapData: null,
      dictionaryData: null
    });


    if (this.get('id') !== null) {
      this.set('mapConfig', config.maps.find( c => c.id === this.get('id') ));
    }
    console.log("idChange", this.get('mapConfig'));

  }.observes('id').on("init"),

  loadMapData() {

    return new Promise((res, rej) => {
      
      if (!this.get('mapData')) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${config.rootURL}data/map/${this.get('mapConfig.source')}`, true);

        xhr.onload = (e) => {
          
          if (e.target.status == 200) {
            res(this.set('mapData', e.target.response));
          }
          
        };

        xhr.send();
      } else {
        res(this.get('mapData'));
      }
      
    });
    
  },

  loadDictionaryData() {
		
    return new Promise( (res, rej) => {
      
      if (!this.get('dictionaryData')) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${config.rootURL}data/dictionary/${this.get('mapConfig.dictionary.source')}`, true);

        xhr.onload = (e) => {
          
          if (e.target.status == 200) {
            res(geoMatcher.dic = this.set('dictionaryData', JSON.parse(e.target.responseText).map( x => Ember.Object.create(x))));
          }
          
        };

        xhr.send();
      } else {
        res(geoMatcher.dic = this.get('dictionaryData'));
        console.log(geoMatcher.dic);
      }
      
    });
		
	},
  
  deferredChange: Ember.debouncedObserver(
    'config', 'mapData', 'dictionaryData',
    function() {
      this.notifyDefferedChange();
    },
    50),
  
  export() {
    return this._super({
      id: this.get('id')
    });
  }
  
});

Basemap.reopenClass({
  
  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
        id: json.id
      });
      return o;
  }
    
});

export default Basemap;
