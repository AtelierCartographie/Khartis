import Ember from 'ember';
import d3 from 'd3';
import projector from 'mapp/utils/projector';
import config from 'mapp/config/environment';
import GraphLayer from 'mapp/models/graph-layer';
import Mapping from 'mapp/models/mapping/mapping';
import Projection from 'mapp/models/projection';
import topojson from 'npm:topojson';

/*var CRC = function() {
	
	this.crc = 0xffffffff;	
	
};

CRC.table = null;

CRC.make_table = function() {
	
	var table = [];
    for (var n = 0; n<256; n++) {
    	var c = n;
    	for (var k = 0; k<8; k++) {
    		if (c & 1) {
    			c = 0xedb88320 ^ (c >>> 1);
    		}
    		else {
    			c = c >>> 1;
    		}
    	}
    	table[n] = c;
    }
	
    CRC.table = table;
};

CRC.prototype.update = function(array, index, len) {

	if (CRC.table == null) {
		CRC.make_table();
	}
	
	var crc = this.crc;
	var table = CRC.table;


    while (len >= 8) {
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8)
        len -= 8;
    }
    if (len) do {
        crc = table[(crc ^ array[index++]) & 0xff] ^ (crc >>> 8);
    } while (--len);
	
	this.crc = crc;
	return crc;
};*/

let table = new Uint32Array(256),
    crc;
for (var i = 0, j; i < 256; i++) {
  crc = i>>>0;
  for (j = 0; j < 8; j++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  table[i] = crc;
}

function calcCRC(buffer) {
  var crc = (-1>>>0), len = buffer.length, i;
  for (i = 0; i < len; i++) crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xff];
  return (crc ^ -1)>>>0;
}

export default Ember.Controller.extend({
  
  queryParams: ['currentTab'],
  currentTab: null,

  states: [
    "visualizations",
    "export"
  ],
  state: "visualizations",
  
  basemapData: null,

  sidebarSubExpanded: false,
  
  editedLayer: null,
  editedColumn: null,

  onCurrentTabChange: function() {
    if (this.get('states').indexOf(this.get('currentTab')) !== -1) {
      this.set('state', this.get('currentTab'));
    }
  }.observes('currentTab').on("init"),
  
  availableProjections: function() {
    return this.get('Dictionnary.data.projections')
      .filter( p => p.id !== "lambert_azimuthal_equal_area");
  }.property('Dictionnary.data.projections'),
  
  isInStateVisualization: function() {
    return this.get('state') === "visualizations";
  }.property('state'),
  
  isInStateExport: function() {
    return this.get('state') === "export";
  }.property('state'),
  
  sidebarPartial: function() {
    return `graph/_sidebar/${this.get('state')}`;
  }.property('state'),

  sidebarActiveTab: function() {
    return this.get('state');
  }.property('state'),

  hasNextState: function() {
    return this.get('states').indexOf(this.get('state')) < (this.get('states').length - 1);
  }.property('state'),

  helpTemplate: function() {
    return `help/{locale}/graph/${this.get('state')}`;
  }.property('state'),
  
  setup() {
    this.loadBasemap(this.get('model.graphLayout.basemap'))
      .then( (json) => {
        let j = JSON.parse(json),
            partition = j.objects.land.geometries
              .reduce( (part, g) => {
                part[g.properties.square ? "left" : "right"].push(g);
                return part;
              }, {left: [], right: []});

        this.set('basemapData', {
          land: topojson.merge(j, partition.right),
          squares: topojson.mesh(j, {type: "GeometryCollection", geometries: partition.left}),
          lands: topojson.feature(j, j.objects.land),
          borders: topojson.mesh(j, j.objects.border, function(a, b) {
              return a.properties.featurecla === "International";
            }),
          bordersDisputed: topojson.mesh(j, j.objects.border, function(a, b) { 
              return a.properties.featurecla === "Disputed"; 
            }),
          centroids: topojson.feature(j, j.objects.centroid)
        });
      });
  },
  
  //TODO : basemap selection
  loadBasemap(basemap) {
    
    return new Promise((res, rej) => {
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${config.rootURL}data/map/${basemap}`, true);

      xhr.onload = (e) => {
        
        if (e.target.status == 200) {
          res(e.target.response);
        }
        
      };

      xhr.send();
      
    });
    
  },
  
  layoutChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayout.width', 'model.graphLayout.height', 'model.graphLayout.zoom',
    'model.graphLayout.tx', 'model.graphLayout.ty',
    'model.graphLayout.backgroundColor', 'model.graphLayout.backMapColor',
    'graphLayout.showGrid', 'graphLayout.showLegend', 'graphLayout.showBorders',
    'model.graphLayout.title', 'model.graphLayout.author', 'model.graphLayout.dataSource', 'model.graphLayout.comment'),
  
  layersChange: function() {
    this.send('onAskVersioning', 'freeze');
  }.observes('model.graphLayers.[]', 'model.graphLayers.@each._defferedChangeIndicator'),
  
  exportSVG() {
    var blob = new Blob([this.exportAsHTML()], {type: "image/svg+xml"});
    saveAs(blob, "export_mapp.svg");
  },

  exportPNG() {

    let _this = this;

    var svgString = this.exportAsHTML();

    var fact = 4.16;
    var canvas = document.getElementById("export-canvas");
    canvas.width = this.get('model.graphLayout.width')*fact;
    canvas.height = this.get('model.graphLayout.height')*fact;
    var ctx = canvas.getContext("2d");
    ctx.scale(fact, fact);
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml"});
    var url = DOMURL.createObjectURL(svg);
    

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {

          var arrayBuffer;
          var fileReader = new FileReader();
          fileReader.onload = function() {
              arrayBuffer = this.result;
              let dv = new DataView(arrayBuffer),
                  firstIDATChunkPos = undefined,
                  pos = 8;

              /*dv.setUint32(16, _this.get('model.graphLayout.width'), false);
              dv.setUint32(20, _this.get('model.graphLayout.height'), false);*/

              let concatBuffers = function(buffer1, buffer2) {
                var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
                tmp.set(new Uint8Array(buffer1), 0);
                tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
                return tmp.buffer;
              };

              function getUint32() {                 // and for Uint16 etc.
                var data = dv.getUint32(pos, false); // use big-endian byte-order
                pos += 4;
                return data
              }

              // decode chunk name to string (from pngtoy)
              function getFourCC() {
                  var v = getUint32(),
                      c = String.fromCharCode;
                  return  c((v & 0xff000000)>>>24) + c((v & 0xff0000)>>>16) + 
                          c((v & 0xff00)>>>8) + c((v & 0xff)>>>0)
              }

              function string2Uint32(s) {
                  let arr = new Uint8Array(4);
                  for (let i = 0; i < arr.length; i++) {
                    arr[i] = s.charCodeAt(i);
                  }
                  let bin = (arr[0])<<24 | (arr[1])<<16 | (arr[2])<<8 | arr[3];
                  
                  let c = String.fromCharCode;
                  console.log(
                    c((bin & 0xff000000)>>>24) + c((bin & 0xff0000)>>>16) + 
                    c((bin & 0xff00)>>>8) + c((bin & 0xff)>>>0)
                  );

                  return bin;
              }

              while (pos < dv.buffer.byteLength) {
                let size = getUint32(),
                    name = getFourCC(),
                    crc;
                if (name === "IHDR") {
                  let crcBuffer = new Uint8Array(dv.buffer, pos-4, size+4);
                  let width = getUint32();
                  let height = getUint32();
                  pos += size - 8;
                  dv.setUint32(pos, calcCRC(crcBuffer));
                } else if (name === "IDAT" && !firstIDATChunkPos) {
                  firstIDATChunkPos = pos - 8;
                  pos += size;
                } else {
                  pos += size;
                }
                crc = getUint32();
              }

              //append pHYs
              let left = arrayBuffer.slice(0, firstIDATChunkPos),
                  right = arrayBuffer.slice(firstIDATChunkPos),
                  pHYs = new ArrayBuffer(4+4+4+4+1+4),
                  dvPHYs = new DataView(pHYs);

              dvPHYs.setUint32(0, 9, false);
              dvPHYs.setUint32(4, string2Uint32("pHYs"), false);
              dvPHYs.setUint32(8, Math.round(300/0.0254), false);
              dvPHYs.setUint32(12, Math.round(300/0.0254), false);
              dvPHYs.setUint8(16, 1, false);

              let crcBuffer = new Uint8Array(dvPHYs.buffer, 4, pHYs.byteLength-4);
              dvPHYs.setUint32(17, calcCRC(crcBuffer));

              let pngBuffer = concatBuffers(concatBuffers(left, dvPHYs.buffer), right);

              //check
              dv = new DataView(pngBuffer);
              pos = 8;
              while (pos < dv.buffer.byteLength) {
                let size = getUint32(),
                    name = getFourCC(),
                    crc;
                  console.log(name, size);
                  pos += size;
                  crc = getUint32();
              }
            
            saveAs(new Blob([pngBuffer], {type: "image/png"}), "export_mapp.png");
            DOMURL.revokeObjectURL(url);

          };
          fileReader.readAsArrayBuffer(blob);

        }, "image/png", 1);

        
    };
    img.src = url;

  },

  exportAsHTML() {
    
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    let node = d3.select("svg.map-editor")
        .node().cloneNode(true);
        
    let d3Node = d3.select(node);
    
    let x = d3Node.selectAll("g.offset line.vertical-left").attr("x1"),
        y = d3Node.selectAll("g.offset line.horizontal-top").attr("y1"),
        w = this.get('model.graphLayout.width'),
        h = this.get('model.graphLayout.height');
    
    d3Node.attr({
      width: this.get('model.graphLayout.width'),
      height: this.get('model.graphLayout.height'),
      viewBox: `${x} ${y} ${w} ${h}`
    });

    d3Node.selectAll("g.margin,g.offset").remove();
    d3Node.selectAll("rect.fg").remove();
    
    /*d3Node.select("defs")
      .append("clipPath")
      .attr("id", "view-clip")
      .append("rect")
      .attr({
        x: 0,
        y: 0,
        width: w,
        height: h
      });*/
      
    d3Node.select(".outer-map")
      .attr("clip-path", "url(#viewport-clip)");
              
    let html = d3Node.node()
      .outerHTML
      .replace(/http:[^\)"]*?#/g, "#")
      .replace(/&quot;/, "")
      .replace(/NS\d+\:/g, "xlink:");

    d3Node.remove();

    return html;
    
  },
  
  freeze: function() {
    this.get('store').versions().freeze(this.get('model').export());
  },
  
  invertSliderFn: function() {
    let fn = function(val) {
      return -val;
    }
    fn.invert = function(val) {
      return -val;
    }

    return fn;
  }.property(),
  
  actions: {
    
    bindProjection(proj) {
      this.set('model.graphLayout.projection', Projection.create(proj.export()));
      this.send('onAskVersioning', 'freeze');
    },
    
    editColumn(col) {
      if (col.get('incorrectCells.length')) {
        this.transitionToRoute('graph.column', col.get('_uuid'));
      }
    },
    
    addLayer(col) {
      let layer = GraphLayer.createDefault(col, this.get('model.geoDef'));
      this.get('model.graphLayers').unshiftObject(layer);
      this.transitionToRoute('graph.layer', layer.get('_uuid'));
    },
    
    editLayer(layerIndex) {
      let layer = this.get('model.graphLayers').objectAt(layerIndex);
      if (layer != this.get('editedLayer')) {
        this.transitionToRoute('graph.layer.edit', layer.get('_uuid'));
      } else {
        this.transitionToRoute('graph');
      }
    },
    
    removeLayer(layer) {
      this.get('ModalManager')
        .show('confirm', "Êtes vous sur de vouloir supprimer ce calque ?",
          "Confirmation de suppression", 'Oui', 'Annuler')
        .then(() => {
          this.get('model.graphLayers').removeObject(layer);
        });
    },
    
    toggleLayerVisibility(layer) {
      layer.toggleProperty('visible');
    },
    
    bindLayerMapping(type) {
      this.set('editedLayer.mapping', Mapping.create({
        type: type,
        varCol: this.get('editedLayer.mapping.varCol'),
        geoDef: this.get('editedLayer.mapping.geoDef')
      }));
    },
    
    bindMappingScaleOf(layer, type) {
      layer.set('mapping.scaleOf', type);
    },
    
    bindMappingPattern(layer, pattern) {
      layer.set('mapping.pattern', pattern);
    },
    
    bindMappingShape(layer, shape) {
      layer.set('mapping.shape', shape);
    },
    
    bindMappingLabelCol(layer, col) {
      layer.set('mapping.labelCol', col);
    },
    
    bindScaleIntervalType(scale, type) {
      scale.set('intervalType', type);
    },
    
    bind(root, prop, value) {
      root.set(prop, value);
    },
    
    toggleRuleVisibility(rule) {
      rule.toggleProperty('visible');
    },

    toggleBordersVisibility() {
      this.toggleProperty('model.graphLayout.showBorders');
    },

    toggleGridVisibility() {
      this.toggleProperty('model.graphLayout.showGrid');
    },

    toggleLegendVisibility() {
      this.toggleProperty('model.graphLayout.showLegend');
    },
    
    resetTranslate() {
      this.get('model.graphLayout').setProperties({
        zoom: 1,
        tx: 0,
        ty: 0
      });
    },
    
    zoomPlus() {
      if (this.get('model.graphLayout.zoom') < 12) {
        this.incrementProperty('model.graphLayout.zoom');
      }
    },
    
    zoomMoins() {
      if (this.get('model.graphLayout.zoom') > 0) {
        this.decrementProperty('model.graphLayout.zoom');
      }
    },

    onIntervalTypeTabChange(id) {
      if (id === "linear-tab") {
        this.send('bindScaleIntervalType', this.get('editedLayer.mapping.scale'), 'linear');
      } else if (this.get('editedLayer.mapping.scale.intervalType') === "linear") {
        this.send('bindScaleIntervalType', this.get('editedLayer.mapping.scale'), 'regular');
      }
    },

    onValueBreakFocusOut() {
      this.get('editedLayer.mapping').clampValueBreak();
    },
    
    export(format) {
      if (format === "svg") {
        this.exportSVG();
      } else {
        this.exportPNG();
      }
    },
    
    selectState(state) {
      this.set('state', state);
      this.transitionToRoute('graph');
    },
    
    next() {
      this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))+1]);
    },
    
    back() {
      if (this.get('states').indexOf(this.get('state')) > 0) {
        this.set('state', this.get('states')[this.get('states').indexOf(this.get('state'))-1]);
      } else {
        this.send('navigateToProject');
      }
    },

    closeSidebarSub() {
      this.transitionToRoute('graph');
    },

    navigateToProject() {
      this.transitionToRoute('project.step2', this.get('model._uuid'));
    },

    navigateToVisualizations() {
      this.send('selectState', 'visualizations');
    },

    navigateToExport() {
      this.send('selectState', 'export');
    },
    
    onAskVersioning(type) {
      switch (type) {
        case "undo":
          this.get('store').versions().undo();
          break;
        case "redo": 
          this.get('store').versions().redo();
          break;
        case "freeze":
          Ember.run.debounce(this, this.freeze, 1000);
          break;
      }
    }
    
  }
  
});
