import Ember from 'ember';
import d3 from 'd3';
import 'mapp/utils/d3slider'
/* global $ */

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['slider'],

  value:0,
  min:0,
  max:10,
  step:null,
  scale:null,
  
  _tmpValue: null,

  didInsertElement(){
    
    var slider = d3.slider().axis(true)
      .value(this.get('value'))
      .min(this.get('min'))
      .max(this.get('max'))

    var step = this.get('step')
    if(step && typeof step === 'number'){
      slider.step(step)
    }

    var scale = this.get('scale')
    if(scale){
      slider.scale(scale)
    }
    
    slider.on('slide', (e, val) => this.set('_tmpValue', val));

    this.d3l().call(slider);
    
  },
  
  tmpValueChange: Ember.debouncedObserver('_tmpValue', function() {
    this.set('value', this.get('_tmpValue'));
  }, 50)

});
