import Ember from 'ember';
/* global Em */

const NS = "mapp-project",
      MAX = 30;

var History = Ember.Service.extend({
  
    stack: null,
    needle: null,
    
    init() {
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
        return this.get('stack').objectAt(this.get('needle'));
      }
      return null;
    },
    
    undo() {
      this.set('needle', this.get('needle') - 1);
      return this.get('stack').objectAt(this.get('needle'));
    },
    
    redo() {
      this.set('needle', this.get('needle') + 1);
      return this.get('stack').objectAt(this.get('needle'));
    },
    
    canUndo: function() {
      return this.get('stack').length > 0;
    }.property('stack.[]'),
    
    canRedo: function() {
      return this.get('needle') < this.get('stack').length - 1;
    }.property('needle'),
  
    save(o) {
      this.get('stack').addObject(o);
      let json = this.get('stack').map( o => o.export() );
      window.localStorage.setItem(NS, JSON.stringify(json));
      return o;
    },

    restore() {
      let stack = JSON.parse(window.localStorage.getItem(NS));
      this.set('stack', stack || Em.A());
      return this.top();
    }
  
  
});


export default History;
