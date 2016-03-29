import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['slider'],

  value:0,
  min:0,
  max:10,
  ticks: null,
  tickValues: null,
  
  tickAppend: null,
  tickFormat: ",.2f",
  
  _tmpValue: null,
  
  didInsertElement(){
    
    var slider = d3.slider(true)
      .value(this.get('value'))
      .min(this.get('min'))
      .max(this.get('max'));

    if (this.get('tickValues')) {
      slider.tickValues(this.get('tickValues'));
    }
    
    if (this.get('ticks')) {
      slider.ticks(this.get('ticks'));
    }
    
    let formatter = (d) => d;
    if (this.get('tickFormat')) {
      formatter = (d) => d3.format(this.get('tickFormat'))(d);
    }
    
    if (this.get('tickAppend') != null) {
      slider.tickFormat( (d) => {
        return formatter(d) + this.get('tickAppend');
      } );
    } else {
      slider.tickFormat( (d) => {
        return formatter(d);
      } );
    }
    
    slider.callback( (s) => this.set('_tmpValue', s.value()) );
    
    this.addObserver('value', () => slider.setValue(this.get('value')) );

    this.d3l().call(slider);
    
  },
  
  tmpValueChange: Ember.debouncedObserver('_tmpValue', function() {
    this.set('value', this.get('_tmpValue'));
  }, 50)

});
