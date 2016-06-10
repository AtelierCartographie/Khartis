import Ember from 'ember';

export default Ember.Controller.extend({

  sidebarActiveTab: 'data',
  sidebarTabVisualizationsDisabled: false,
  sidebarTabExportDisabled: false,

  actions: {

    navigateToProject() {
    },

    navigateToVisualizations() {
      this.transitionToRoute('graph', { queryParams: { currentTab: 'visualisations' }})
    },

    navigateToExport() {
    }

  }
  
});
