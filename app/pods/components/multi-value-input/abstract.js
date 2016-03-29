import Ember from 'ember';

/* global Em */
export default Ember.Component.extend({

    layoutName: 'components/multi-value-input',

    classNameBindings: ['hasMultipleSelections:multiple-selections'],
    
    editable: true,
    
    query: "",

    selection: Em.A([]),

    uniqueSelection: Ember.computed('selection.[]', {

        get: function () {
            return this.get('selection.length') > 0 ? this.get('selection').objectAt(0) : null;
        },

        set: function (key, val) {
            this.set('selection', Em.A(val != null ? [val] : []));
            return val;
        }
        
    }),

    hasMultipleSelections: Ember.computed('selection.[]', function () {
        return this.get('selection.length') > 0;
    }),

    selectionMaxLength: 100,

    suggestionProvider: Em.A([]),

    suggestions: Em.A([]),

    exclusions: Em.A([]),

    debounce: 100, /* increase for async */

    placholder: "Type here to filter",

    'async': false,

    loading: 0,

    queryMinLength: 1,

    suggestionRowDiv: {isSuggestionRow: true},
    selectedValueDiv: {isSelectedValue: true},

    didInsertElement: function () {
        
        this.$().on('mouseover', e => {
            if ($(e.target).hasClass('suggestion')) {
                this.$('.suggestion').removeClass('active');
                $(e.target).addClass('active');
            }
        });
        
        this.$().parents().on("scroll."+this.elementId, () => {
          
          this.$('.suggestions-wrapper').css({
            visibility: "hidden"
          });
          this.positionSuggestions()
          
        });

        this.hideSuggestions();
    },
    
    willDestroyElement() {
      this.$().parents().off("scroll."+this.elementId);
    },

    click: function () {
        
        this.$('input').focus();
        
    },

    raisedMinLength: function () {

        return this.get('query.length') >= this.get('queryMinLength');

    }.property('query', 'queryMinLength'),

    raisedMaxLength: function () {

        return (!this.get('async') && this.get('selection.length') == this.get('suggestionProvider.length')) || this.get('selection.length') >= this.get('selectionMaxLength');

    }.property('selectionMaxLength', 'selection.[]', 'suggestionProvider.[]', 'async'),

    shouldDisplaySuggestions: function () {

        return this.get('editable') && this.get('query').length >= this.get('queryMinLength') && !this.get('raisedMaxLength');

    }.property('query', 'raisedMaxLength'),

    /* DATA */

    suggest: function () {
        
        if (this.get('query.length') >= this.get('queryMinLength')) {

            this.incrementProperty('loading');

            this.filterData().then((suggestions) => {

                if (suggestions) {

                    this.set('suggestions', suggestions.filter(x => {

                        return !this.get('selection').find(u => this.areEqual(u, x))
                            && !this.get('exclusions').find(u => this.areEqual(u, x));

                    }));

                    this.displaySuggestions();

                } else {

                    this.hideSuggestions();

                }


            }).catch(err => {
                console.log(err);
                this.hideSuggestions();
                throw new Error("Unable to load suggestions ");

            }).finally(() => this.decrementProperty('loading'));

        } else {

            this.set('suggestions', Em.A());
            this.hideSuggestions();

        }

    },

    filterData: function () {
        /* not implemented, should return promise */
    },

    /* should be overrided to handle comparisons based on properties */
    areEqual: function (a, b) {

        if (typeof a.equals === "function") {
            return a.equals(b);
        } else {
            return a == b;
        }

    },

    /* UI */
    displaySuggestions: function () {
        
        this.$('.suggestions-wrapper').css({
            'display': 'block',
            'width': this.$().width() + "px"
        });
        
        this.$('.suggestions-wrapper').css({
            'width': this.$().width() + "px"
        });
        
        this.positionSuggestions();

    },
    
    positionSuggestions: function() {
      
      Ember.run.later(this, () => {
        
        let top = this.$().offset().top + this.$().height() + 1;
        
        if (top + this.$('.suggestions').height() > $(window).height()) {
          top = this.$().offset().top - this.$('.suggestions').height() - 1;
        }
        
        this.$('.suggestions-wrapper').css({
          top: top,
          visibility: "visible"
        });
        
      });
        
    },

    hideSuggestions: function () {
        this.$('.suggestions-wrapper').fadeOut(100);
    },

    actions: {

        keyPressed: function (event) {
            
            if (!this.get('editable')) {
                
                event.preventDefault();
                return false;
                
            }

            if (event.keyCode == 8 && this.get('query').length == 0) {
                
                if (this.get('selection.length') > 0) {
                    this.get('selection').removeAt(this.get('selection.length') - 1);
                } else if (this.get('query.length') == 0) {
                    event.preventDefault();
                    return false;
                }

            } else if ([38, 40].indexOf(event.keyCode) >= 0) {

                var $suggestions = this.$('.suggestion'),
                    $active = this.$('.suggestion.active'),
                    index = !$active.length ? -1 : $suggestions.index($active);

                if (index < $suggestions.length) {

                    index += event.keyCode === 38 ? -1 : 1;

                    $suggestions.removeClass('active');

                    if (index >= 0) {
                        ($active = $suggestions.eq(index)).addClass('active');
                    }

                    //scroll
                    if ($active.position()) {

                        var $container = this.$('.suggestions'),
                            speed = 150;

                        if ($active.position().top < 0) {
                            $container.animate({scrollTop: $container.scrollTop() + $active.position().top - 3 * $active.height()}, speed);
                        } else if ($active.height() + $active.position().top > $container.height()) {
                            $container.animate({scrollTop: $container.scrollTop() + $active.position().top - $active.height()}, speed);
                        }

                    }

                }

                event.preventDefault();

            } else if (event.keyCode === 13) {

                var $suggestions = this.$('.suggestion'),
                    $active = this.$('.suggestion.active'),
                    index = !$active.length ? 0 : $suggestions.index($active);


                if (index >= 0) {
                    this.send('select', this.get('suggestions').objectAt(index));
                }

                event.preventDefault();

            } else {
                Ember.run.debounce(this, this.suggest, this.get('debounce'));
            }
        },

        focus: function (event) {
            
            if (this.get('editable')) {
                
                this.suggest();
                this.$().addClass("focused");
                
            }

        },

        focusLost: function (event) {
            setTimeout(() => {
                if (!this.isDestroyed && !this.$(":focus").length) {
                    this.hideSuggestions();
                    this.set('query', '');
                    this.$().removeClass("focused");
                }
            }, 140);
        },

        /**
         * Click on Selection DOM Element should set it as focused
         * and attach an eventListener for deletion
         * @param o
         * @param domIndex
         */
        focusOnSelection: function (o, domIndex) {

            let node = $(`[data-selection='${domIndex}']`, this.$())

            const scheduleCleanup = () => {
                node.off('keydown', onKeydownWithSelection)
                node.off('blur', scheduleCleanup)
            }

            const onKeydownWithSelection = (e) => {
                if (e.keyCode === 8 || e.keyCode === 46) {
                    scheduleCleanup();
                    this.get('selection').removeObject(o);
                    Ember.run.scheduleOnce('afterRender', this, function () {
                        this.$('input').focus();
                    });
                    e.preventDefault()
                }
            }

            node.attr('tabindex', -1)
                .on('keydown', onKeydownWithSelection)
                .on('blur', scheduleCleanup)
                .focus();
        },

        select: function (o) {
            this.get('selection').addObject(o);
            this.set('query', '');
            this.$().attr('tabindex', -1).focus();
            this.sendAction()
        },

        remove: function (o) {
            this.get('selection').removeObject(o);
            this.set('query', '');
            this.sendAction()
        }

    }

});
