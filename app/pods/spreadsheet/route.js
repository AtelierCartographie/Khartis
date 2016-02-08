import Ember from 'ember';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';


let blankData = [
  ["Colonne 1"],
  [""]
  /*["Col 1", "Col 2", "Col 3", "Col 4", "Col 5", "Col 6"],
   ["1", "2", "3", "4", "3", "1"],
   ["4", "5", "6", "3", "4", "2"],
   ["7", "8", "9", "1", "2", "3"],
   ["10", "11", "12", "4", "3", "4"],
   ["10", "11", "12", "4", "3", "5"],
   ["10", "11sf", "12", "4", "3", "9"],
   ["10", "11sdf", "12", "4", "3", "6"],
   ["10", "11sdf", "12", "4", "3", "9"],
   ["10", "11sdf", "12", "4", "3", "8"],
   ["10", "11df", "12", "4", "3", "7"],
   ["10", "11sdf", "12", "4", "3", "9"]*/

];

export default Ember.Route.extend({
  
    store: Ember.inject.service(),
    
    renderTemplate: function() {
        this.render("spreadsheet.sidebar", { outlet: "sidebar" });
        this.render({ outlet: "main" });
    },
    
    newProject() {
      let project = Project.create({
        data: DataStruct.createFromRawData(blankData)
      });
      return project;
    },
    
    init() {
      
      this._super();
      
      //TODO : implémenter la sélection du projet sélectionné en dehors de cette route
      let projects = this.get('store').list(),
          project;
          
      if (projects.length) {
        project = this.get('store.projects')[0]; //TODO : remove
      } else {
        project = this.get('store').persist(this.newProject().export());
      }
      
      this.get('store').follow(project)
        .on("undo", () => this.refresh() )
        .on("redo", () => this.refresh() );
        
    },
    
    model() {
      return Project.restore(this.get('store').versions().current());
    },
    
    actions: {
      
        navigateTo(url) {
          this.transitionTo("/"+url);
        }
        
    }
    
});
