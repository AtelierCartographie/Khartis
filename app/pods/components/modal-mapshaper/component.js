import Ember from 'ember';
import XModal from '../x-modal/component';

var MapShaperModal = XModal.extend({

  worker: Ember.inject.service("mapshaper-worker"),

  classNames: ["modal", "fade", "confirm"],
  name: 'modal-mapshaper',
  _promise: null,

  model: null,
  workerStream: null,
  layers: null,
  dictIds: null,
  mapConfigs: null,

  state: null,

  didInsertElement: function() {
    this.get('ModalManager').connect(this);
    this.$().on('hidden.bs.modal', e => {
      this.sendAction('reject');
    });
  },

  isProcessing: function() {
    return this.get('state') === "processing";
  }.property('state'),

  isAskingForLayers: function() {
    return this.get('state') === "layers";
  }.property('state'),

  isStateValid: function() {
    if (this.get('isProcessing')) {
      return false;
    } else if (this.get('isAskingForLayers')) {
      return this.get('layersCbx').find( cbx => cbx.get('checked') );
    } else {
      return true;
    }
  }.property('state', 'layersCbx.@each.checked'),

  layersCbx: function() {
    return this.get('layers').map(layer => Ember.Object.create({
      checked: true,
      selectedPropKey: (layer.propKeys.find( p => p.unique ) || layer.propKeys[0] || {field: null}).field,
      layer
    }) )
  }.property('layers.[]'),

  buildMapConfigs(tuples) {
    return tuples.map( (tuple, i) => {
      let file = tuple.files[0];
      let json = JSON.parse(file.content);

      //normalize names
      let basename;
      Object.keys(json.objects).forEach( (k, i) => {
        let name;
        if (i === 0) {
          name = "poly";
          basename = k;
        } else {
          name = k.replace(basename+"::", "");
        }
        json.objects[name] = json.objects[k];
        json.objects[k] = undefined;
      });

      return {
        id: file.filename,
        custom: true,
        attribution: "",
        sources: [
          {topojson: json, projection: "wkt", wkt: tuple.proj4Wkt}
        ],
        dictionary: {
          source: tuple.dict,
          identifier: this.get('dictIds')[i]
        },
        _debug_simplify: tuple.simplifyPct
      }
    });
  },

  onImportWorkerMessage(data) {
    if (data.action === "list-layers") {
      this.set('layers', data.layers);
      this.set('state', "layers");
    } else if (data.action === "exported") {
      this.set('mapConfigs', this.buildMapConfigs(data.tuples));
      this.set('state', 'finish');
    }
  },

  show: function (opts) {
    this._super(opts);
    let files = opts && opts.model;
    this.get('worker').open("mapshaper")
      .then(stream => {
        this.set('workerStream', stream);
        this.processFiles(files);
        stream.onMessage(this.onImportWorkerMessage.bind(this));
      });

    let promise = new Promise( (resolve, reject) => {
      this.set('_promise', {resolve: (...params) => resolve.apply(this, params), reject: () => reject()});
    });

    return promise;
  },

  processFiles(files) {
    this.set('state', 'processing');
    this.get('workerStream').postMessage({action: "init", files});
  },

  processLayers() {
    let selected = this.get('layersCbx')
          .filter( cbx => cbx.get('checked') ),
        layers = selected.map( cbx => cbx.get('layer') ),
        dictIds = selected.map( cbx => cbx.get('selectedPropKey') );
    this.set('dictIds', dictIds)
    this.set('state', 'processing');
    this.get('workerStream').postMessage({
      action: "processLayers",
      layers
    });
  },

  actions: {
    selectPropKey(cbx, key) {
      cbx.set('selectedPropKey', key);
    },
    reject() {
      this.hide();
      this.get('workerStream').terminate();
      this.get('_promise').reject();
    },
    next() {
      if (this.get('state') === "layers") {
        this.processLayers();
      } if (this.get('state') === "finish") {
        this.get('_promise').resolve(this.get('mapConfigs'));
        this.hide();
      }
    },
    downloadDebug(mc) {
      let blob = new Blob([JSON.stringify(mc.sources[0].topojson)], {type: "application/octet-stream"});
      saveAs(blob, mc.id);
    }
  }
});

export default MapShaperModal;
