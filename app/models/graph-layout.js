import Ember from 'ember';
import d3 from 'd3';
import d3lper from 'khartis/utils/d3lper';
import Struct from './struct';
import Projection from './projection';
import Basemap from './basemap';

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
	
	backgroundColor: "#f8f8f8",
  backmapColor: "#cfd1d1",

  backlandsColor: function() {
    /*let color = d3.rgb(this.get('backmapColor')),
        contrast = d3lper.yiqColor(color);
    return contrast === "lighten" ? color.brighter(0.222) : color.darker(0.222);*/
    return "#e0e1e1";
  }.property('backmapColor'),
  
  showBorders: true,

  showGrid: true,
  gridColor: "#e1e3ee",
  
  showLegend: null,
	
	autoCenter: false,

  canDisplayGrid: function() {
    return !this.get('projection.isComposite');
  }.property('projection', 'projection.isComposite'),

  canDisplaySphere: function() {
    return !this.get('projection.isComposite');
  }.property('projection', 'projection.isComposite'),
	
  tx: 0,
  ty: 0,
	width: 1024,
	height: 1024,
	margin: null,
  zoom: 1,
  precision: 2.5,
  legendTx: null,
  legendTy: null,
  legendOpacity: 0.85,
  
  projection: null,

	hOffset: function(screenWidth) {
		return (screenWidth - this.get('width')) / 2;
	},
	
	vOffset: function(screenHeight) {
		return (screenHeight - this.get('height')) / 2;
	},

  setBasemap(basemap) {
    this.set('basemap', basemap)
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
      legendTx: this.get('legendTx'),
      legendTy: this.get('legendTy'),
      legendOpacity: this.get('legendOpacity')
    });
  }
  
});

GraphLayout.reopenClass({
  
  createDefault() {
    let o = GraphLayout.create({margin: Margin.create()});
    return o;
  },
  
  restore(json, refs = {}) {
      let o = this._super(json, refs, {
        basemap: json.basemap ? Basemap.restore(json.basemap) : null,
        backgroundColor: json.backgroundColor,
        backmapColor: json.backmapColor,
        gridColor: json.gridColor,
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
        legendTx: json.legendTx,
        legendTy: json.legendTy,
        legendOpacity: json.legendOpacity
      });
      return o;
  }
    
});


export default GraphLayout;
