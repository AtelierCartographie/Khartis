/* eslint-env node */
'use strict';
const fs = require('fs-extra'),
     path = require("path"),
     puppeteer = require('puppeteer'),
     express = require('express');

const elBbox = async function(el) {
  const layoutMetrics = await el._client.send('Page.getLayoutMetrics');
  const boxModel = await el._client.send('DOM.getBoxModel', { objectId: el._remoteObject.objectId });
  if (!boxModel || !boxModel.model)
    return null;
  return {
    x: boxModel.model.margin[0] + (layoutMetrics && layoutMetrics.layoutViewport ? layoutMetrics.layoutViewport.pageX : 0),
    y: boxModel.model.margin[1] + (layoutMetrics && layoutMetrics.layoutViewport ? layoutMetrics.layoutViewport.pageY : 0),
    width: boxModel.model.width,
    height: boxModel.model.height
  };
}

module.exports = {
  name: 'map-thumbnails',
  configObject: {},

  isDevelopingAddon: function() {
    return true;
  },
  outputReady: function (results) {
    let serv = express();
    serv.use("/assets", express.static(results.directory+"/assets"));
    serv.use("/data", express.static(results.directory+"/data"));
    serv.all("/*", function(req, res) {
      res.sendFile('index.html', { root: results.directory });
    });
    let servInst = serv.listen(3001, function () {
      console.log(`Express server started in ${results.directory}`);
      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // page.on('console', (...args) => {
        //   for (let i = 0; i < args.length; ++i)
        //     console.log(`${i}: ${args[i]}`);
        // });
        page.waitFor(() => document.querySelector(".map-editor") != null)
          .then( () => {
            console.log(`-> Generating map thumbnails`);
            return page.$$(".map-editor").then( els => {
                return Promise.all(els.map( el => {
                  return elBbox(el).then( bbox => page.screenshot({path: 'example.png', clip: bbox}) );
                }));
            });
          })
          .then( () => {
            //servInst.close();
            return browser.close();
          })
          .catch(console.log);
        await page.goto("http://localhost:3001/map-thumbnails");
      })();
    });
  },
  config: function (env, baseConfig) {
    this.configObject = baseConfig;
  }
};
