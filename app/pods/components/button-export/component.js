import Ember from 'ember';
import snap from 'khartis/utils/snap';

export default Ember.Component.extend({

    open: false,

    show() {
        $(document).on('click.export-button', this.handleOuterClick.bind(this));
        this.set('open', true);
        Ember.run.later(() => {
            this.$('.export-menu').css({
                visibility: "visible"
            });
            let snapped = snap(this.$('.export-menu')[0], 'bottom right')
                .to(this.$('.export-button')[0],  'top right');
            this.set('_snapped', snapped);
        });
    },

    hide() {
        $(document).off('click.export-button');
        this.set('open', false);
        this.$('.export-menu').css({
            visibility: "hidden"
        });
        this.get('_snapped') && this.get('_snapped').dispose();
    },

    handleOuterClick(e){

        let trigger = this.$('.export-menu')[0];
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
    

    actions: {
        toggle(e) {
            var isOpen = this.get('open')
            isOpen ? this.hide() : this.show()
        },
        export(type, opts) {
            this.sendAction('export', type, opts);
        }
    }
});