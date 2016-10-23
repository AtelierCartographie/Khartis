import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  classes: null,
  totalClasses: null,
  possibilities: null,

  center: function() {
    return Math.floor(this.get('totalClasses') / 2);
  }.property('totalClasses'),

  centerIndex: function() {
    return this.get('possibilities').length - this.get('possibilities').indexOf(this.get('center'));
  }.property('center', 'possibilities.[]'),

  min: function() {
    return this.get('possibilities').reduce(
      (idx, cl) => idx -= cl < this.get('centerIndex') ? 1:0,
      0
    );
  }.property('centerIndex'),

  max: function() {
    return this.get('possibilities').length - this.get('centerIndex');
  }.property('centerIndex'),

  editable: function() {
    return (this.get('max') - this.get('min')) > 0;
  }.property('min', 'max'),

  cursor: Ember.computed('classes', 'possibilities.[]', {

    get() {
      return this.get('possibilities').length - this.get('possibilities').indexOf(this.get('classes')) - this.get('centerIndex');
    },
    set(k, v) {
      let idx = this.get('possibilities').length - (this.get('centerIndex') + v);
      this.set('classes', this.get('possibilities')[idx]);
      return v;
    }

  })
  
});
