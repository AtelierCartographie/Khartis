import Ember from 'ember';

export default Ember.Route.extend({

  updatePresented: false,
  store: Ember.inject.service(),

  beforeModel() {
    return this.get('Dictionary').load();
  },

  actions: {

    navigateTo(url) {

      switch(url) {
        case 'spreadsheet':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        case 'graph':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        default:
          this.transitionTo(url);
      }

    },

    setLocale(locale) {
      this.set('i18n.locale', locale);
    },

    didTransition: function didTransition() {
      if (window.process) {
        let reqVal = "electron";
        const {ipcRenderer} = require(reqVal);
        ipcRenderer.on("importProject", (evt, data) => {
          this.send("loadExternalProject", data);
        });
        ipcRenderer.on("exportProject", (evt) => {
          this.send("exportProject");
        });
        ipcRenderer.on("updateAvailable", (evt, data) => {
          this.send("presentUpdate", data);
        });
        ipcRenderer.send("startup");
      }
    },

    loadExternalProject(data) {
      this.get('store').loadFromFile(data)
        .then( res => {
          this.transitionTo('graph', res);
        })
        .catch( res => {
          if (res.error === "problem:file") {
            this.get('ModalManager')
              .show('confirm', Ember.String.capitalize(this.get('i18n').t('project.step1.importPoject.loadError').string),
                Ember.String.capitalize(this.get('i18n').t('general.error', {count: 1}).string),
                null,
                Ember.String.capitalize(this.get('i18n').t('general.cancel').string));
          } else if (res.error === "problem:exists") {
            this.get('ModalManager')
              .show('confirm', Ember.String.capitalize(this.get('i18n').t('project.step1.importPoject.projectExists').string),
                Ember.String.capitalize(this.get('i18n').t('general.warning', {count: 1}).string),
                Ember.String.capitalize(this.get('i18n').t('general.overwrite').string),
                Ember.String.capitalize(this.get('i18n').t('general.duplicate').string))
              .then( () => {
                this.get('store').overwriteProject(res.project);
                this.transitionTo('graph', res.project._uuid);
              })
              .catch( () => {
                this.transitionTo('graph', this.get('store').forkProject(res.project)._uuid);
              });
          }
        })
        .catch(console.log)
    },

    exportProject() {
      this.get('store').saveAsFile();
    },

    presentUpdate(data) {


      if (this.get('updatePresented')) return;
      this.set('updatePresented', true);

      console.info("An update is available");

      let reqVal = "electron";
      const ipcRenderer = window.process && require(reqVal).ipcRenderer;

      /*get and convert markdown to html using github api*/
      //extract tag from url
      // https://github.com/AtelierCartographie/Khartis/releases/download/khartis-v2.0.0"
      // github.com / user / repo / tag
      data.update = data.update + '/';
      let repoUrl = data.update.endsWith('/') ? data.update.substring(0, data.update.length - 1) : data.update;
      var fragments = repoUrl.match(/(?:github\.com\/)(.*)\/(.*)(?:\/releases\/download\/)(.*)/)

      if( ! fragments) console.error("Updater: unable to parse Github URL");

      // let [user, repo, tag] = data.update.match(/(?:github\.com\/)(.*)\/(.*)(?:\/releases\/download\/)(.*)\//).slice(1);
      let [user, repo, tag] = fragments.slice(1);

      new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.github.com/repos/${user}/${repo}/releases/tags/${tag}`, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = (e) => {
          if (e.target.status == 200) {
            res({meta: JSON.parse(e.target.response)});
          }
        };

        xhr.send();
      }).then( ({meta}) => new Promise((res, rej) => {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.github.com/markdown`, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = (e) => {
          if (e.target.status == 200) {
            res({html: e.target.response});
          }
        };

        xhr.send(JSON.stringify({
          text: meta.body
        }));

      })).then(({html}) => {
        let body = `<h2>${Ember.String.capitalize(this.get('i18n').t('updater.title').string)} (v${data.version})</h2>
          <div class="release-notes markdown"><div class="sticker">${Ember.String.capitalize(this.get('i18n').t('updater.releaseNotes').string)}</div>${html}</div>`;
        this.get('ModalManager')
          .show('confirm', body,
            `Khartis - ${Ember.String.capitalize(this.get('i18n').t('updater.title').string)}`,
            Ember.String.capitalize(this.get('i18n').t('updater.installAndRestart').string),
            Ember.String.capitalize(this.get('i18n').t('general.later').string),
            null,
            "updater"
          )
          .then( () => {
            ipcRenderer && ipcRenderer.send("acceptUpdate");
            this.get('ModalManager')
            .show('confirm', '<div class="loading-bar"></div>',
              `Khartis - ${Ember.String.capitalize(this.get('i18n').t('updater.installation').string)}`,
              null,
              null,
              null,
              "updater-install"
            )
            .catch(() => {
              //todo cancel
            })
          })
      });

    }

  }

});
