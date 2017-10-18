import Ember from 'ember';
import spectrum from './spectrum';

export default Ember.Component.extend({

  value: null,
  showInput: true,
  showAlpha: true,
  stroke: false,
  liveRendering: true,
  showPalette: true,

  init() {
    if (!document.getElementById("picker-wormhole")) {
      let div = document.createElement("div");
      div.setAttribute("id", "picker-wormhole");
      document.body.appendChild(div);
    }
    this._super();
  },

  palette: [
    ["#f6e8c3","#e3c497","#cda16f","#b3824c","#97632e","#764815","#543005"],
    ["#c7eae5","#9bcdc3","#72afa2","#4d9284","#2c7566","#0e584a","#003c30"],
    ["#fddbc7","#f6b19c","#e68976","#d16155","#b43c3a","#921728","#67001f"],
    ["#deebf7","#b3cae4","#8ba9cf","#6389b8","#3e6b9e","#1c4d82","#053061"],
    ["#d9f0d3","#abd5aa","#7fb883","#589b61","#347e44","#12612c","#00441b"],
    ["#e7d4e8","#ceaed3","#b387bd","#9864a5","#7c418b","#5f216d","#40004b"],
    ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
    ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2"]
  ],

  didInsertElement: function() {
    let spect = spectrum(this.$('.sp-replacer').get(0), {
      container: document.getElementById(`color-picker-${this.get('customElementId')}`),
      color: this.get('value'),
      showInput: this.get('showInput'),
      showAlpha: this.get('showAlpha'),
      preferredFormat: "rgb",
      palette: this.get('palette'),
      showPalette: this.get('showPalette'),
      borderPreview: this.get('stroke'),
      backgroundPreview: !this.get('stroke'),
      replacerClassName: this.get('stroke') ? 'of-stroke' : 'of-fill',
      move: (color) => {
        if (this.get('liveRendering')) {
          this.set('value', color.toRgbString());
        }
      },
      change: (color) => {
        console.log("change");
        this.set('value', color.toRgbString());
      }
    });
    this.set('spectrum', spect);
  },

  valueChange: function() {
    this.get('spectrum').set(this.get('value'));
  }.observes('value')

});
