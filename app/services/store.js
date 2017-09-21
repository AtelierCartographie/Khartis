import Ember from 'ember';
import Project from 'khartis/models/project';
import Hookable from 'khartis/mixins/hookable';
/* global Em */

const NS = "khartis-project",
      SIZE = 10,
      MAX = 30,
      FREEZE_EVT = "freeze",
      UNDO_EVT = "undo",
      REDO_EVT = "redo";
    
export const HOOK_BEFORE_SAVE_PROJECT = "hook_bf_merge";

var Store = Ember.Service.extend(Hookable, {

    transient: false,

    projects: null,
    mounted: null,

    versioning: null,

    init() {
      this._super();
      this._restore();
    },

    _restore() {
      if (!this.get('transient') && window.localStorage.getItem(NS)) {
        this.set('projects', JSON.parse(window.localStorage.getItem(NS)));
      } else {
        this.set('projects', Em.A());
      }
    },

    _save() {
      this.get('projects').splice(0, this.get('projects').length - SIZE);
      if (!this.get('transient')) {
        window.localStorage.setItem(NS, JSON.stringify(this.get('projects')));
      }
    },

    saveAsFile() {
      let project = Object.assign({}, this.get('mounted'));
      
      let json = JSON.stringify(project),
          blob = new Blob([json], {type: "application/octet-stream"});

      saveAs(blob, "Projet-Khartis.kh");
    },

    loadFromFile(data) {
      return new Promise( (res, rej) => {
        let json,
            parsedData; 
        try {
          parsedData = JSON.parse(json = data)
        } catch (e) { //not json, try decompress for old khartis files
          json = LZString.decompressFromBase64(data);
        }
        try {
          if (json) {
            parsedData = JSON.parse(json);
            if (parsedData._uuid) {
              let exists = this.get('projects').some( p => p._uuid === parsedData._uuid );
              if (exists) {
                rej({error: "problem:exists", project: parsedData});
              } else {
                this.get('projects').unshift(parsedData);
                this.set('mounted', null);
                res(parsedData._uuid);
              }
            }
          } else {
            throw new Error("Unable to decompress file");
          }
        } catch(e) {
          rej({error: "problem:file"});
        }
      });
    },

    overwriteProject(project) {
      let old = this.get('projects').find( p => p._uuid === project._uuid );
      this.get('projects').splice(this.get('projects').indexOf(old), 1, project);
    },

    forkProject(project) {
      project._uuid = Project._nextId.next().value;
      this.get('projects').unshift(project);
      return project;
    },

    clear() {
      this.get('projects').clear();
      this.save();
    },

    list() {
      return this.get('projects');
    },

    has() {
      return this.list().length > 0
    },

    select(uuid) {
      return new Promise( (res, rej) => {
        let project = this.get('projects').find( p => p._uuid === uuid );
        if (project) {
          this.startVersioning(project);
          this.set('mounted', project);
          Project.restore(project).then( p => res(p) ).catch(console.log);
        } else {
          res(false);
        }
      });
    },

    persist(project) {
      if (!this.get('projects').some( p => p._uuid === project._uuid )) {
        this.get('projects').addObject( project.export() );
        return this.processHooks(HOOK_BEFORE_SAVE_PROJECT, [project]).then( () => {
          this._save();
          this.set('mounted', project.export());
          return project;
        });
      } else {
        throw new Error("Can't persist : a project with same UUID is already persisted");
      }
    },

    merge(project) {

      let old = this.get('projects')
        .find( p => p._uuid === project._uuid );

      if (old) {
        let json = project instanceof Project ? project.export() : project;
        this.get('projects').splice(this.get('projects').indexOf(old), 1,
           json);
        this.get('projects').enumerableContentDidChange();
        this.set('mounted', json);
        return this.processHooks(HOOK_BEFORE_SAVE_PROJECT, [project]).then( () => {
          this._save();
          return project;
        });
      } else {
        return this.persist(project);
      }

    },

    remove(project) {
      if (this.get('projects').some( p => p._uuid === project._uuid )) {
        this.set('projects', this.get('projects').filter( p => p._uuid !== project._uuid ));
        this._save();
        return true;
      } else {
        throw new Error("Can't remove : project not found");
      }
    },

    startVersioning(project) {
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
      this._super();
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
      project = project instanceof Project ? project.export() : project;
      if (JSON.stringify(project) !== JSON.stringify(this.current())) {
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
    o.get('stack').addObject(project instanceof Project ? project.export() : project);
    return o;
  }
})


export default Store;
