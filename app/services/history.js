import Ember from 'ember';
/* global Em */

const NS = "mapp-project",
      MAX = 30;

var History = Ember.Service.extend(Ember.Evented, {
  
    stack: null,
    needle: null,
    
    init() {
      //this.clear();
      this._super();
      this.restore();
    },
    
    stackChange: function() {
      
      if (this.get('stack').length > MAX) {
        this.get('stack').splice(0, this.get('stack').length - MAX);
      }
      
      this.set('needle', this.get('stack').length - 1);
      
    }.observes('stack.[]').on("init"),
    
    top() {
      if (this.get('stack') && this.get('stack').length > 0) {
        return this.get('stack')[this.get('needle')];
      }
      return undefined;
    },
    
    undo() {
      if (this.get('canUndo')) {
        this.set('needle', this.get('needle') - 1);
        this.trigger("undo");
      }
    },
    
    redo() {
      if (this.get('canRedo')) {
        this.set('needle', this.get('needle') + 1);
        this.trigger("redo");
      }
    },
    
    canUndo: function() {
      return this.get('stack').length > 1 && this.get('needle') > 0;
    }.property('stack.[]', 'needle'),
    
    canRedo: function() {
      return this.get('needle') < this.get('stack').length - 1;
    }.property('needle', 'stack.[]'),
  
    save(o) {
      this.set('stack', this.get('stack').slice(0, this.get('needle') + 1));
      this.get('stack').addObject( o.export() );
      window.localStorage.setItem(NS, JSON.stringify(this.get('stack')));
      return o;
    },

    restore() {
      let stack = JSON.parse(window.localStorage.getItem(NS));
      this.set('stack', stack || Em.A());
      return this.top();
    },
    
    clear() {
      window.localStorage.setItem(NS, null);
    }
  
});


export default History;
