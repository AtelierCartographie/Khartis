import XModal from '../x-modal/component';
import config from '../../../config/environment';
import proj4 from "npm:proj4";

var ReProjModal = XModal.extend({

  classNames: ["modal", "fade", "confirm"],
  name: 'modal-reproj',
  _promise: null,
  preventBackdropClick: true,
  model: null,

  state: 'loading',
  errorMessage: null,

  wktText: null,
  epsgDict: null,

  selectedEpsg: null,

  isLoading: function() {
    return this.get('state') === "loading";
  }.property('state'),

  isLoaded: function() {
    return this.get('state') === "loaded";
  }.property('state'),

  isCommitable: function() {
    return this.get('wktText') != null && this.get('wktText').length;
  }.property('wktText'),

  epsgDictAsArray: function() {
    return Object.keys(this.get('epsgDict') || [])
      .map(k => {
        return Ember.Object.create({
          ...this.get('epsgDict')[k],
          code: k
        });
      })
      .filter(o => o.name)
      .sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      });
  }.property('epsgDict'),

  loadEspg() {

    if (!this.get('epsgDict')) {
      return new Promise((res, _) => {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${config.rootURL}data/epsg.json`, true);
        
        xhr.onload = (e) => {
          console.log(e);
          if (e.target.status == 200) {
            res(JSON.parse(e.target.response));
          }
          
        };
  
        xhr.send();
      
      });
    } else {
      return Promise.resolve(this.get('epsgDict'));
    }
  },

  show: function (opts) {

    this.set('wktText', null);
    this.set('selectedEpsg', null);
    this.set('state', 'loading');
    this._super(opts);

    return this.loadEspg().then(epsgDict => {
      this.set('epsgDict', epsgDict);
      this.set('state', 'loaded');
    }).then(() => {
      return new Promise( (resolve, reject) => {
        this.set('_promise', {resolve: (...params) => resolve.apply(this, params), reject: () => reject()});
      })
    });
  },

  commit() {
    const wkt = this.get('wktText');
    try {
      proj4(wkt); //raise exception if invalid
      this.get('_promise').resolve(wkt);
      this.hide();
    } catch (e) {}
  },

  actions: {
    reject() {
      this.hide();
      this.get('workerStream').terminate();
      this.get('_promise').reject();
    },
    next() {
      this.commit();
    },

    selectEspg(selection) {
      console.log(selection);
      this.set('wktText', selection[0].proj4);
    }
  }
});

export default ReProjModal;
