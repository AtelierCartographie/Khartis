import Ember from 'ember';
/* global Em */

const NS = "mapp-project",
      MAX = 30,
      FREEZE_EVT = "freeze",
      UNDO_EVT = "undo",
      REDO_EVT = "redo";
      
var Store = Ember.Service.extend({
  
    transient: false,
    
    projects: null,
    
    versioning: null,
    
    init() {
      this._super();
      this.restore();
    },
    
    restore() {
      if (!this.get('transient') && window.localStorage.getItem(NS)) {
        this.set('projects', JSON.parse(window.localStorage.getItem(NS)));
      } else {
        this.set('projects', Em.A());
      }
    },
    
    save() {
      if (!this.get('transient')) {
        window.localStorage.setItem(NS, JSON.stringify(this.get('projects')));
      }
    },
    
    clear() {
      this.get('projects').clear();
      this.save();
    },
    
    list() {
      return this.get('projects');
    },
    
    persist(project) {
      if (!this.get('projects').some( p => p._uuid === project._uuid )) {
        this.get('projects').addObject( project );
        this.save();
        return project;
      } else {
        throw new Error("Can't persist : a project with same UUID is already persisted");
      }
    },
    
    merge(project) {
      
      let old = this.get('projects')
        .find( p => p._uuid === project._uuid );
        
      if (old) {
        this.get('projects').splice(this.get('projects').indexOf(old), 1, project);
        this.get('projects').enumerableContentDidChange();
        this.save();
        return project;
      } else {
        throw new Error("Can't merge : project not found");
      }
      
    },
    
    remove(project) {
      if (this.get('projects').some( p => p._uuid === project._uuid )) {
        this.set('projects', this.get('projects').filter( p => p._uuid !== project._uuid ));
        this.save();
        return true;
      } else {
        throw new Error("Can't remove : project not found");
      }
    },
    
    follow(project) {
      let self = this,
          versioning = Version.begin(project),
          changeFn = function() {
            self.merge(this.current());
          };
          
      versioning.on(FREEZE_EVT, changeFn)
           .on(UNDO_EVT, changeFn)
           .on(REDO_EVT, changeFn);
           
      return this.set('versioning', versioning);
    },
    
    versions() {
      if (this.get('versioning')) {
        return this.get('versioning');
      } else {
        throw new Error("Unable to return versions() : no versioning found. Use Store.follow(project) first.");
      }
    }
  
});

var Version = Ember.Object.extend(Ember.Evented, {
  
    stack: null,
    needle: null,
    
    init() {
      this.set('stack', Em.A());
    },
    
    stackChange: function() {
      
      if (this.get('stack').length > MAX) {
        this.get('stack').splice(0, this.get('stack').length - MAX);
      }
      
      this.set('needle', this.get('stack').length - 1);
      
    }.observes('stack.[]').on("init"),
    
    current() {
      if (this.get('stack') && this.get('stack').length > 0) {
        return this.get('stack')[this.get('needle')];
      }
      return undefined;
    },
    
    undo() {
      if (this.get('canUndo')) {
        this.set('needle', this.get('needle') - 1);
        this.trigger(UNDO_EVT);
      }
    },
    
    redo() {
      if (this.get('canRedo')) {
        this.set('needle', this.get('needle') + 1);
        this.trigger(REDO_EVT);
      }
    },
    
    canUndo: function() {
      return this.get('stack').length > 1 && this.get('needle') > 0;
    }.property('stack.[]', 'needle'),
    
    canRedo: function() {
      return this.get('needle') < this.get('stack').length - 1;
    }.property('needle', 'stack.[]'),
  
    freeze(project) {
      if (JSON.stringify(project) !== JSON.stringify(this.current())) {
        console.log("diff");
        this.set('stack', this.get('stack').slice(0, this.get('needle') + 1));
        this.get('stack').addObject(project);
        this.trigger(FREEZE_EVT);
      }
      return project;
    }
  
});

Version.reopenClass({
  begin(project) {
    let o = Version.create();
    o.get('stack').addObject(project);
    return o;
  }
})


export default Store;
