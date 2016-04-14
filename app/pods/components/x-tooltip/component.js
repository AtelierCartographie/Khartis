import Ember from 'ember';
import snap from 'mapp/utils/snap';
/* global $ */

var positionsMap = {
  top: 'top center',
  right: 'middle right',
  bottom: 'bottom center',
  left: 'middle left'
}

var positionsOppositesMap = {
  top: 'bottom',
  middle: 'middle',
  bottom: 'top',
  left: 'right',
  center: 'center',
  right: 'left'
}

function getOpposite(pos) {
  return positionsOppositesMap[pos]
}

function getOffset(pos, offset){
  switch(pos){
    case 'top':
      return {top: offset, left:0 }
    case 'right':
      return {top:0, left:-offset}
    case 'bottom':
      return {top: -offset, left:0}
    case 'left':
      return {top:0, left:offset}
  }
}

export default Ember.Component.extend({

  tagName: '',
  position: 'bottom',
  offset:5,
  
  positionClassName: function() {

    var position = positionsMap[this.get('position')];
    var [v, h] = position.split(' ');

    return /middle/.test(v) ? h : v;
    
  }.property('position'),

  computePosition () {

    var position = positionsMap[this.get('position')];
    var [v, h] = position.split(' ');

    return {
      tooltip: `${getOpposite(v)} ${getOpposite(h)}`,
      trigger: position
    }
  },

  draw: function () {

    const tooltip = this.$()
    const trigger = tooltip.next()

    this.triggerEl = trigger
    this.tooltipEl = tooltip
    
    Ember.run.later(this, () => {
      this.positions =  this.computePosition();
      this.computedOffset = getOffset(this.get('position'), this.get('offset'));
    });

    const show = this.show.bind(this);
    const hide = this.hide.bind(this);

    tooltip.appendTo($(document.body))
    trigger.hover(show, hide)
    
  }.on("didInsertElement"),

  '$': function () {
    return $("#" + this.elementId);
  },

  show(){
    this.snap = snap(this.tooltipEl[0], this.positions.tooltip, this.computedOffset.left, this.computedOffset.top)
      .to(this.triggerEl[0], this.positions.trigger)
    this.tooltipEl.addClass('visible')
  },

  hide(){
    this.tooltipEl.removeClass('visible')
    this.snap.dispose()
  }

});
