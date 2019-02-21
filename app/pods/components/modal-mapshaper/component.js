import Ember from 'ember';
import config from '../../../config/environment';
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

  doSimplify: true,
  keepVars: true,

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

  isAskingForOtherVars: function() {
    return this.get('state') === "other-vars";
  }.property('state'),

  isAskingForSimplifyConfirm: function() {
    return this.get('state') === "confirm-simplify";
  }.property('state'),

  isStateValid: function() {
    if (this.get('isProcessing')) {
      return false;
    } else if (this.get('isAskingForLayers')) {
      return this.get('layersCbx').find( cbx => cbx.get('checked') );
    } else if (this.get('isAskingForOtherVars') || this.get('isAskingForSimplifyConfirm')) {
      return true;
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

  hasNonUniquePropKey: function() {
    return this.get('layersCbx').some(cbx => !cbx.layer.propKeys.find(pk => pk.field === cbx.get('selectedPropKey')).unique);
  }.property('layersCbx.@each.selectedPropKey'),

  onImportWorkerMessage(data) {
    if (data.action === "list-layers") {
      this.set('layers', data.layers);
      this.set('state', "layers");
    } else if (data.action === "confirm-simplify") {
      this.set('state', "confirm-simplify");
    } else if (data.action === "exported") {
      if (!this.keepVars) {
        data.tuples.forEach((t, i) => {
          let dictId = this.get('dictIds')[i];
          t.dict = t.dict.map(d => ({[dictId]: d[dictId]}));
        });
      }
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
          if (this.get('mapConfigsOnError').length) {
            this.set('state', 'finish');
          } else {
            this.commit();
          }
        })
        .catch( e => {
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
    this.set('errorMessage', null);
    this.set('keepVars', true);
    this.set('doSimplify', true);
    this.set('state', "processing");
    this._super(opts);
    let files = opts && opts.model;
    this.get('worker').open("work")
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
    this.get('workerStream').postMessage({action: "init", opts: {files, arcsLimit: config.mapshaper.arcsLimit || 15000}});
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

  confirmSimplify() {
    this.get('workerStream').postMessage({
      action: "confirmSimplify",
      simplify: this.get('doSimplify')
    });
  },

  commit() {
    this.get('_promise').resolve(this.get('mapConfigs'));
    this.hide();
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
        if (this.get('layers').some(lyr => lyr.propKeys.length > 1)) {
          this.set('state', "other-vars");
        } else {
          this.processLayers();
        }
      } else if (this.get('isAskingForOtherVars')) {
        this.processLayers();
      } else if (this.get('isAskingForSimplifyConfirm')) {
          this.confirmSimplify();
      } else if (this.get('state') === "finish") {
        this.commit();
      }
    },
    downloadDebug(mc) {
      let blob = new Blob([JSON.stringify(mc.sources[0].topojson)], {type: "application/octet-stream"});
      saveAs(blob, mc.id);
    }
  }
});

export default MapShaperModal;
