importScripts(
  'mapshaper/zip.js',
  'mapshaper/deflate.js',
  'mapshaper/inflate.js',
  'mapshaper/rsvp.js',
  'mapshaper/modules.js',
  'mapshaper/mapshaper.js',
  'mapshaper/main.js'
);

zip.useWebWorkers = false;
zip.workerScripts = {
  deflater: ['mapshaper/z-worker.js', 'mapshaper/pako.deflate.js', 'mapshaper/codecs.js'],
  inflater: ['mapshaper/z-worker.js', 'mapshaper/pako.inflate.js', 'mapshaper/codecs.js']
};

/* Sequential promises - Arnaud PEZEL */
function Sequence(promises) {
  return promises.reduce(function(out, p) {
    return out.then(function(res) {
      return (p instanceof Deffered ? p.promise() : p)
        .then(function(x) {
          return (res.push(x), res);
        })
      });
  }, RSVP.Promise.resolve([]));
}

var Deffered = function(runLater) {
    this.runLater = runLater;
}
Deffered.prototype = Object.create(RSVP.Promise.prototype);
Deffered.prototype.constructor = Deffered;
Deffered.prototype.promise = function() {
    return new RSVP.Promise(this.runLater);
}
/* --- */

var model;
var exportControl;
var importControl;
var asyncSimplifyConfirm;

var importedCb = function() {
  exportControl.export();
};

var noFilesCb = function() {
  postMessage({action: "import-error", error: "noFile"})
};

var generalErrorCb = function(error) {
  postMessage({action: "import-error", error})
};

var listLayerCb = function(layers) {
  postMessage({action: "list-layers", layers});
};

var confirmSimplifyCb = function(layer, cb) {
  postMessage({action: "confirm-simplify", layer});
  asyncSimplifyConfirm = cb;
};

var exportCb = function(tuples) {
  postMessage({action: "exported", tuples});
};

var exportErrorCb = function(error) {
  postMessage({action: "export-error", error});
};

self.addEventListener('message', function(e) {

  var data = e.data;
  if (data.action === "init") {
    model = new Model();
    importControl = new ImportControl(model, importedCb, noFilesCb, generalErrorCb);
    exportControl = new ExportControl(
      model,
      data.opts,
      listLayerCb,
      confirmSimplifyCb,
      exportCb,
      exportErrorCb
    );
    importControl.receiveFiles(data.opts.files);
    asyncSimplifyConfirm = null;
  } else if (data.action === "processLayers") {
    exportControl.export(data.layers);
  } else if (data.action === "confirmSimplify") {
    asyncSimplifyConfirm(data);
    asyncSimplifyConfirm = null;
  }

}, false);

// Ping the Ember service to say that everything is ok.
postMessage(true);
