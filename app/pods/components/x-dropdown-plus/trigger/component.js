/* global $ */

// TODO: DropDown Ember position param

import Ember from 'ember';
import snap, {forceUpdate} from 'khartis/utils/snap';


export default Ember.Component.extend({

  tagName: "",
  triggerEl: null,
  targetEl: null,
  snapped:null,
  open: false,
  dropdownPivot:'top left',
  triggerPivot:'bottom left',
  noWrap: false,
  
  dropdown: null,

  didInsertElement: function () {

    const trigger = this.$().next('.dropdown-trigger')
    const dropdown = trigger.next('.dropdown')
    this.set('triggerEl', trigger)
    this.set('targetEl', dropdown)

    this.toggle = this.toggle.bind(this)
    this.handleOuterClick = this.handleOuterClick.bind(this)

    trigger.on('click', this.toggle)
  },


  handleOuterClick(e){

      var dropdown = this.get('targetEl')
      var trigger = this.get('triggerEl')
      var target = e.target

      do {
        if($(target).is(trigger) || $(target).hasClass("no-close")) {
          break
        }
      } while(target = target.parentNode)

      // Target IS the dropdown or the trigger
      if (target) {
        return
      }

      // Target can be everything else
      this.hide()
  },

  toggle(e){
    var isOpen = this.get('open')
    isOpen ? this.hide() : this.show()
    e.stopImmediatePropagation();
  },

  show() {

    this.set('dropdown.expanded', true);
      
    $(document).on('click', this.handleOuterClick)

    this.set('open', true)
    this.get('targetEl').addClass('visible')
    this.get('triggerEl').addClass('active')

    if(this.get('snapped')){
      this.get('snapped').dispose()
    }
    
    Ember.run.later(() => {
      var snapped = snap(this.get('targetEl')[0], this.get('dropdownPivot'))
        .to(this.get('triggerEl')[0],  this.get('triggerPivot'))

      this.set('snapped', snapped);

      if (this.get('dropdown.stretch')) {
        this.get('targetEl').width(this.get('triggerEl').width());
      }
    });
    
  },

  hide() {
    
    this.set('dropdown.expanded', false);

    $(document).off('click', this.handleOuterClick)

    this.set('open', false)
    this.get('targetEl').removeClass('visible')
    this.get('triggerEl').removeClass('active')
  },

  '$': function () {
    return $("#" + this.elementId);
  },

  willDestroyElement(){

    var dropdown = this.get('targetEl')
    var trigger = this.get('triggerEl')

    // Make sure document click will not leak
    $(document).off('click', this.handleOuterClick);
    
    if (trigger) {
      trigger.off('click', this.toggle);
    }
    
    if (dropdown) {
      dropdown.off('click', this.toggle)
    }

    if(this.get('snapped')){
      this.get('snapped').dispose()
    }
  }

});
