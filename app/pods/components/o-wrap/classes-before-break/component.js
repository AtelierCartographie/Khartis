import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  classes: null,
  totalClasses: null,
  possibilities: null,

  min: 0,

  max: function() {
    return this.get('possibilities').length - 1;
  }.property('possibilities.[]'),

  editable: function() {
    return (this.get('max') - this.get('min')) > 0;
  }.property('min', 'max'),

  cursor: Ember.computed('classes', 'possibilities.[]', {

    get() {
      return this.get('possibilities').indexOf(this.get('totalClasses') - this.get('classes'));
    },
    set(k, v) {
      this.set('classes', this.get('possibilities')[this.get('possibilities').length - v - 1]);
      return v;
    }

  })
  
});
