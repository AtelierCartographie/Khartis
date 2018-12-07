import Ember from 'ember';
import XModal from '../x-modal/component';
import ImportedBasemap from 'khartis/models/imported-basemap';

var MapShaperModal = XModal.extend({

  worker: Ember.inject.service("mapshaper-worker"),

  classNames: ["modal", "fade", "confirm"],
  name: 'modal-mapshaper',
  _promise: null,
  preventBackdropClick: true,
  model: null,
  workerStream: null,
  layers: null,
  dictIds: null,
  mapConfigs: null,
  mapConfigsOnError: null,

  state: null,
  errorMessage: null,

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
    } else if (this.get('state') === "finish") {
      return this.get('mapConfigs.length');
    }
  }.property('state', 'layersCbx.@each.checked'),

  layersCbx: function() {
    return this.get('layers').map(layer => Ember.Object.create({
      checked: true,
      selectedPropKey: (layer.propKeys.find( p => p.unique ) || layer.propKeys[0] || {field: null}).field,
      layer
    }) )
  }.property('layers.[]'),

  onImportWorkerMessage(data) {
    if (data.action === "list-layers") {
      this.set('layers', data.layers);
      this.set('state', "layers");
    } else if (data.action === "exported") {
      console.log(data.tuples);
      let mapConfigs = ImportedBasemap.buildMapConfigs(data.tuples, this.get('dictIds'));
      Promise.all(mapConfigs.map( mc => ImportedBasemap.checkValidity(mc) ) )
        .then( errorsArr => {
          let partition = errorsArr.reduce( (out, errors, i) => {
            if (errors) {
              mapConfigs[i]._debug_errors = errors;
              out.invalid.push(mapConfigs[i]);
            } else {
              out.valid.push(mapConfigs[i]);
            }
            return out;
          }, {valid: [], invalid: []});
          this.set('mapConfigs', partition.valid);
          this.set('mapConfigsOnError', partition.invalid);
          this.set('state', 'finish');
        })
        .catch( e => {
          console.log(e);
          this.setProperties({
            state: 'error',
            errorMessage: 'unknow'
          });
        });
      
    } else if (data.action === "import-error" || data.action === "export-error") {
      this.set('state', "error");
      this.set('errorMessage', data.error);
    }
  },

  show: function (opts) {
    this.set('state', "processing");
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
