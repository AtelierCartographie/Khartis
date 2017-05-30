import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),
  
  sidebarActiveTab: 'data',
  sidebarTabVisualizationsDisabled: true,
  sidebarTabExportDisabled: true,

  actions: {

    navigateToProject() {
    },

    navigateToVisualizations() {
    },

    navigateToExport() {
    }

  }
  
});
