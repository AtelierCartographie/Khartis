import Ember from 'ember';
import CSV from 'npm:csv-string';
import Project from 'khartis/models/project';
import {DataStruct} from 'khartis/models/data';
import Basemap from 'khartis/models/basemap';
import ab2string from 'khartis/utils/ab2string';
import config from 'khartis/config/environment';

export default Ember.Controller.extend({
  
  store: Ember.inject.service(),

  dictionary: Ember.inject.service(),

  basemap: null,

  importReport: null,
  
  canResumeProject: function() {
    return this.get('store').has();
  }.property('store'),
  
  parsable: function() {
    return this.get('model.csv') && this.get('model.csv').length > 0;
  }.property('model.csv'),
  
  examples: function() {
    return this.get('model.project.graphLayout.basemap.mapConfig.examples');
  }.property('model.project.graphLayout.basemap.mapConfig.examples'),

  dictionaryDataHeaders: function() {
    return Array.from(
      this.get('model.project.graphLayout.basemap.dictionaryData')
        .reduce( (headers, row) => (Object.keys(row).forEach( k => headers.add(k) ), headers), new Set() )
    );
  }.property('model.project.graphLayout.basemap.dictionaryData'),

  truncatedDictionaryData: function() {
    return this.get('model.project.graphLayout.basemap.dictionaryData').slice(0, 8);
  }.property('model.project.graphLayout.basemap.dictionaryData'),

  downloadTemplate() {

    let modelKeys = Object.keys(this.get('model.project.graphLayout.basemap.dictionaryData')[0]),
        modelName = this.get('model.project.graphLayout.basemap.id').replace(/\s/g, '-'),
        idField = this.get('model.project.graphLayout.basemap.mapConfig.dictionary.identifier'),
        extraFields = [],
        csvData, rowData;
    modelKeys.forEach(field => {
      if (field !== idField && !/^name/i.test(field)) {
        extraFields.push(field);
      }
    });
    
    csvData = "ID,NAME" + (extraFields.length ? "," + extraFields.join(",") : "") + "\n";
    this.get('model.project.graphLayout.basemap.dictionaryData').forEach( row => {
      rowData = [row[idField]];
      rowData.push(row["name_"+this.get('i18n.locale').toUpperCase()] ||
        row["name_ISO_"+this.get('i18n.locale').toUpperCase()] ||
        row["Name"] ||
        row["name_EN"]);
      extraFields.forEach(field => { rowData.push(row[field]) });
      csvData += '"' + rowData.map(val => (val+"").replace(/"/g, '""')).join('","') + '"\n';
    });

    let blob = new Blob([csvData], {type: "text/csv"});
    saveAs(blob, "Khartis_template_"+modelName+".csv");

  },
  
  loadFile(source) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${config.rootURL}data/examples/${source}`, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = (e) => {
      
      if (e.target.status == 200) {
        
        let data = CSV.parse(ab2string(e.target.response));

        data = data.map( r => {
          return r.map( c => c.trim() );
        });
        
        let project = this.get('model.project');
        project.importRawData(data);
        project.set('csv', null);
        this.transitionToRoute('project.step2', "new");
        
      }
      
    };

    xhr.send();
    
  },
  
  actions: {
    
    selectBasemap(mapId) {
      this.get('model.project.graphLayout').setBasemap(Basemap.create({id: mapId}));
    },

    resumeProject() {
      this.transitionToRoute('graph', this.get('store').list().get('lastObject._uuid'));
    },

    loadCsv(text) {
      this.set('model.csv', text);
    },

    fileDroppedInEditor(file) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = (e) => {
        this.set('model.csv', ab2string(e.target.result));
      };
    },

    parseCsvContent() {

      let sep = CSV.detect(this.get('model.csv'));

      CSV.readAll(this.get('model.csv'), sep, (data) => {
        if (data.length === 0) {
          this.get('ModalManager')
            .show('error', "Impossible d'importer le CSV",
              "Erreur lors de l'importation", 'Fermer');
        } else {
          this.get('model.project').importRawData(data);
          this.transitionToRoute('project.step2', 'new');
        }
      });
      
    },
    
    selectDataSet(set) {
      this.loadFile(set.source);
    },

    downloadTemplate() {
      this.downloadTemplate();
    }
    
  }
  
});
