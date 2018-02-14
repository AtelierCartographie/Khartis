import Ember from 'ember';

export default Ember.Component.extend({

    classNames: ["subsetting"],
    classNameBindings: ["shouldDisplay::hidden"],
    _triggers: null,
    facet: null,
    selectedFacetIndex: null,

    init() {
        this._super();
        this.set('facet', Ember.Object.create());
    },

    triggers: Ember.computed({
        get() {
            return this.get('_triggers');
        },
        set(k, v) {
            this.set('_triggers', v);
            this.initTriggers();
            return v;
        }
    }),

    initTriggers() {
        this.set('facet', Ember.Object.create());
        this.set('selectedFacetIndex', null);
        this.get('_triggers').forEach( (t, i) => {
            $(t).unbind('click.subsettingTrigger');
            $(t).bind('click.subsettingTrigger', this.onTriggerClick.bind(this, i));
        });
    },

    shouldDisplay: function() {
        return this.get('selectedFacetIndex') != null;
    }.property('selectedFacetIndex'),

    onSelectedFacetIndexChange: function() {
        this.get('_triggers').forEach( (t, i) => {
            this.set(`facet.trigger${i}`, i === this.get('selectedFacetIndex'));
        });
        if (this.get('selectedFacetIndex') != null) {
            Ember.run.later(() => {
                let $el = $(this.get('_triggers').objectAt(this.get('selectedFacetIndex'))),
                    offsetX = $el.offset().left  + $el.outerWidth()/2 - this.$().offset().left;
                this.$('.arrow').css({
                    left: offsetX
                });
            });
        }
    }.observes('selectedFacetIndex'),

    onTriggerClick(index) {
        if (this.get('selectedFacetIndex') === index) {
            this.set('selectedFacetIndex', null);
        } else {
            this.set('selectedFacetIndex', index);
        }
    }

});