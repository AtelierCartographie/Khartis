import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import Struct from './struct';
import Projection from './projection';
import Basemap from './basemap';
import ImportedBasemap from './imported-basemap';
import LegendLayout from './legend/legend-layout';
import DrawingFactory from './drawing/factory';

const MARGIN_DEFAULTS = {t: 30, b: 30, l: 16, r: 16};

var Margin = Struct.extend({

  manual: false,
  l: MARGIN_DEFAULTS.l,
  r: MARGIN_DEFAULTS.r,
  t: MARGIN_DEFAULTS.t,
  b: MARGIN_DEFAULTS.b,

  h: function() {
    return this.get('l') + this.get('r');
  }.property('l', 'r'),

  v: function() {
    return this.get('t') + this.get('b');
  }.property('t', 'b'),

  getInitialValue(k) {
    return MARGIN_DEFAULTS[k];
  },

  resetValue(k) {
    this.set(k, MARGIN_DEFAULTS[k]);
  },

  deferredChange: Ember.debouncedObserver(
    'l', 'r', 't', 'b', 'h', 'v',
    function() {
      this.notifyDefferedChange();
    },
    50),

  export() {
    return this._super({
      manual: this.get('manual'),
      l: this.get('l'),
      r: this.get('r'),
      t: this.get('t'),
      b: this.get('b')
    });
  }

});

Margin.reopenClass({

  restore(json, refs = {}) {
      let o = this._super(json, refs);
      o.setProperties({
          manual: json.manual,
          l: json.l,
          r: json.r,
          t: json.t,
          b: json.b
      });
      return o;
  }

});

var GraphLayout = Struct.extend({

  basemap: null,

	stroke: "#ffffff",
	strokeWidth: 1,

	backgroundColor: "#ffffff",
  backmapColor: "#dad5cc",

  // backlandsColor: function() {
  //   return "#e3e0d9";
  // }.property('backmapColor'),

  showBorders: true,

	showParallel: true,
  parallelColor: "#d9d9d9",

  showGrid: true,
  gridColor: "#d9d9d9",

	showSphere: true,
	sphereColor: "#d9d9d9",

	showSea: false,
	seaColor: "#f2f6f9",

  showLegend: null,
  legendLayout: null,

  drawings: null,

	autoCenter: false,

  canDisplayGrid: function() {
    return !this.get('projection.isComposite') && this.get('basemap.type') !== "imported";
  }.property('projection', 'projection.isComposite'),

  canDisplaySphere: function() {
    return !this.get('projection.isComposite') && this.get('basemap.type') !== "imported";
  }.property('projection', 'projection.isComposite'),

	canDisplaySea: function() {
    return !this.get('projection.isComposite') && this.get('basemap.type') !== "imported";
  }.property('projection', 'projection.isComposite'),

	canDisplayParallel: function() {
    return !this.get('projection.isComposite') && this.get('basemap.type') !== "imported";
  }.property('projection', 'projection.isComposite'),

  tx: 0,
  ty: 0,
	width: 900,
	height: 700,
	margin: null,
  zoom: 1,
  precision: 2.5,

  projection: null,

  init() {
    this._super();
    if (!this.get('legendLayout')) {
      this.set('legendLayout', LegendLayout.create());
    }
    if (!this.get('drawings')) {
      this.set('drawings', Em.A());
    }
  },

	hOffset: function(screenWidth) {
		return (screenWidth - this.get('width')) / 2;
	},

	vOffset: function(screenHeight) {
		return (screenHeight - this.get('height')) / 2;
	},

  setBasemap(basemap) {
    return this.set('basemap', basemap)
      .setup()
      .then( res => {
        this.set('projection', basemap.assumeProjection());
      });
  },

  export() {
    return this._super({
      basemap: this.get('basemap') ? this.get('basemap').export() : null,
      projection: this.get('projection') ? this.get('projection').export() : null,
      margin: this.get('margin') ? this.get('margin').export() : null,
      backgroundColor: this.get('backgroundColor'),
      backmapColor: this.get('backmapColor'),
      gridColor: this.get('gridColor'),
			sphereColor: this.get('sphereColor'),
			seaColor: this.get('seaColor'),
      stroke: this.get('stroke'),
      tx: this.get('tx'),
      ty: this.get('ty'),
      width: this.get('width'),
      height: this.get('height'),
      zoom: this.get('zoom'),
      precision: this.get('precision'),
      showBorders: this.get('showBorders'),
      showGrid: this.get('showGrid'),
      showLegend: this.get('showLegend'),
      legendStacking : this.get('legendStacking'),
      legendTx: this.get('legendTx'),
      legendTy: this.get('legendTy'),
      legendOpacity: this.get('legendOpacity'),
      legendLayout: this.get('legendLayout').export(),
      drawings: this.get('drawings').map( d => d.export() )
    });
  },

  restoreLegend(json, refs) {
    if (json.legendLayout) {
      this.set('legendLayout', LegendLayout.restore(json.legendLayout, refs));
    }
  }

});

GraphLayout.reopenClass({

  createDefault() {
    let o = GraphLayout.create({margin: Margin.create()});
    return o;
  },

  restoreBasemap(json) {
    if (json) {
      return (json.type === "imported" ? ImportedBasemap : Basemap).restore(json);
    }
    return null;
  },

  restore(json, refs = {}) {
      let o = this._super(json, refs, {
        basemap: GraphLayout.restoreBasemap(json.basemap),
        backgroundColor: json.backgroundColor,
        backmapColor: json.backmapColor,
        gridColor: json.gridColor,
				sphereColor: json.sphereColor,
				seaColor: json.seaColor,
        stroke: json.stroke,
        projection: json.projection ? Projection.restore(json.projection) : null,
        margin: json.margin ? Margin.restore(json.margin) : null,
        width: json.width,
        tx: json.tx,
        ty: json.ty,
        height: json.height,
        zoom: json.zoom,
        precision: json.precision,
        showBorders: json.showBorders,
        showGrid: json.showGrid,
        showLegend: json.showLegend,
        drawings: (json.drawings && json.drawings.map( d => DrawingFactory.restoreInstance(d, refs) )) || null
      });
      return o;
  }

});


export default GraphLayout;
