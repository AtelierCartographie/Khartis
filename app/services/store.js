import Ember from 'ember';
import Project from 'khartis/models/project';
/* global Em */

const NS = "khartis-project",
      SIZE = 1,
      MAX = 30,
      FREEZE_EVT = "freeze",
      UNDO_EVT = "undo",
      REDO_EVT = "redo";

var Store = Ember.Service.extend({

    transient: false,

    projects: null,
    mounted: {},

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
      let project = Object.assign({}, this.get('projects')[0]);
      
      let json = JSON.stringify(project),
          blob = new Blob([LZString.compressToBase64(json)], {type: "application/octet-stream"});

      saveAs(blob, "Projet-Khartis.kh");
    },

    loadFromFile(data) {
      return new Promise( (res, rej) => {
        let json = LZString.decompressFromBase64(data),
          parsedData; 
        try {
          if (json) {
            parsedData = JSON.parse(json);
            parsedData._uuid = Project._nextId.next().value;
            this.set('projects', Em.A([parsedData]));
            this.set('mounted', {});
            res(parsedData._uuid);
          } else {
            throw new Error("Unable to decompress file");
          }
        } catch(e) {
          rej(false);
        }
      });
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
        let project = this.get('mounted')[uuid] ?
          this.get('mounted')[uuid] : this.get('projects').find( p => p._uuid === uuid );
        if (project) {
          this.startVersioning(project);
          this.get('mounted')[uuid] = project;
          Project.restore(project).then( p => res(p) );
        } else {
          res(false);
        }
      });
    },

    persist(project) {
      if (!this.get('projects').some( p => p._uuid === project._uuid )) {
        this.get('projects').addObject( project.export() );
        this._save();
        this.get('mounted')[project._uuid] = project.export();
        return project;
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
        this.get('mounted')[project._uuid] = json;
        this._save();
        return project;
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
