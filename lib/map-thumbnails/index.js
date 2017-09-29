/* eslint-env node */
'use strict';
const fs = require('fs-extra'),
     path = require("path"),
     Thumbnailer = require('./thumbnailer'),
     mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'map-thumbnails',
  configObject: {},

  isDevelopingAddon: function() {
    return true;
  },
  postprocessTree(type, tree) {
    if (!this.configObject.mapThumbnail.generate || type !== 'all') {
      return tree;
    }
    return mergeTrees([tree, new Thumbnailer([tree])]);
  },
  config: function (env, baseConfig) {
    this.configObject = baseConfig;
  }
};
