import Ember from 'ember';
import d3 from 'd3';
/* global $ */

export default Ember.Component.extend({

  tagName: "",

  minWidth: 140,

  target: null,

  targetChange: function () {
    if (this.get('target') != null) {

      let $el = $('#hresizer'),
        el = d3.select($el[0]),
        handle = el.select(".handle");

      //fake mousedown
      var event = document.createEvent('MouseEvent');
      event.initEvent("mousedown", true, true);
      handle.node().dispatchEvent(event);

    }
  }.observes('target'),

  didInsertElement() {

    let $el = $('#hresizer'),
      el = d3.select($el[0]),
      resizer = el.select(".handle"),
      dashWidth = $('.dash').width();

    var dragResize = d3.behavior.drag()
      .on('dragstart', () => {
        el.classed('dragged', true);
        this.set('target.cell.state.sheet.resizing', true);

        $el.offset({
          top: this.get('target').$().offset().top,
          left: this.get('target').$().offset().left + this.get('target').$().outerWidth() - $el.width() + $el.parent('.sheet').scrollLeft()
        });
      })
      .on('dragend', () => {
        this.commitResize();
        el.classed('dragged', false);
      })
      .on('drag', () => {

        let x = d3.mouse(el.node().parentNode)[0] + $el.parent('.sheet').scrollLeft(),
          cellOffset = this.get('target').$().offset().left - this.get('target').$().parent().offset().left + dashWidth;

        x = ( (x - cellOffset) < this.get('minWidth') ) ? this.get('minWidth') + cellOffset : Math.max(cellOffset, x)

        el.style('left', x + 'px');
      });

    resizer.call(dragResize);

  },

  commitResize() {
    let width = $('#hresizer').offset().left - this.get('target').$().offset().left;
    this.set('target.cell.state.sheet.resizing', false);
    this.sendAction('apply-resize', width, this.get('target.cell'));
    this.sendAction('stop-resize', this.get('target'));
    this.set('target', null);
  },

  actions: {
    onStartResizeHeader(cell, component) {
      this.set('target', component);
    }
  }

});
