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

function getOpposite(pos){
  return positionsOppositesMap[pos]
}

export default Ember.Component.extend({

  tagName: "",
  tooltip: null,
  position: 'bottom',
  positionClassName: '',

  computePosition (){

    var position = positionsMap[this.get('position')]
    var [v, h] = position.split(' ')

    this.set('positionClassName', /middle/.test(v) ? h : v)

    return {
      tooltip: `${getOpposite(v)} ${getOpposite(h)}`,
      trigger: position
    }
  },

  didInsertElement: function () {

    const tooltip = this.$()
    const trigger = tooltip.next()

    this.set('tooltip', tooltip)

    const show = this.show.bind(this);
    const hide = this.hide.bind(this);

    var positions = this.computePosition()

    snap(tooltip[0], positions.tooltip)
      .to(trigger[0],  positions.trigger)

    tooltip.appendTo($(document.body))
    trigger.hover(show, hide)
  },

  '$': function () {
    return $("#" + this.elementId);
  },

  show(){
    this.get('tooltip').addClass('visible')
  },

  hide(){
    this.get('tooltip').removeClass('visible')
  }

});
