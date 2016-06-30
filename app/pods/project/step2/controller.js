import Ember from 'ember';

export default Ember.Controller.extend({

  sidebarActiveTab: 'data',
  sidebarTabVisualizationsDisabled: function() {
    return this.get('hasErrors') || !this.get('model.project.geoDef');
  }.property('hasErrors', 'model.project.geoDef'),

  sidebarTabExportDisabled: function() {
    return this.get('hasErrors') || !this.get('model.project.geoDef');
  }.property('hasErrors', 'model.project.geoDef'),

  store: Ember.inject.service(),

  hasWarnings: function() {
    return this.get('model.project.report.warnings').length > 0;
  }.property('model.project.report.warnings'),

  hasErrors: function() {
    return this.get('model.project.report.errors').length > 0;
  }.property('model.project.report.errors'),
  
  bodyPreview: function() {
    return this.get('model.project.data.body').slice(0, 15);
  }.property('model.project.data.body.[]'),

  setupGeoDef: function() {
    if (!this.get('model.project.geoDef') && this.get('model.project.data.availableGeoDefs').length) {
      this.set('model.project.geoDef', this.get('model.project.data.availableGeoDefs').objectAt(0));
    }
  }.observes('model.project.data.availableGeoDefs.[]'),

  actions: {
    
    bindColumnType(column, type) {
      if (type != null) {
        column.set('meta.type', type);
        column.set('meta.manual', true);
      } else {
        column.set('meta.manual', false);
      }
    },
    
    bind(root, prop, value) {
      root.set(prop, value);
    },
    
    editColumn(col) {
      if (col.get('incorrectCells.length')) {
        this.transitionToRoute('project.step2.column', col.get('_uuid'));
      }
    },

    closeSidebarSub() {
      this.transitionToRoute('project.step2');
    },

    back() {
      this.transitionToRoute('project.step1');
    },

    next(){
      this.get('store').merge(this.get('model.project'));
      this.transitionToRoute('graph', this.get('model.project._uuid'));
    },

    navigateToProject() {
    },

    navigateToVisualizations() {
      if (!this.get('sidebarTabVisualizationsDisabled')) {
        this.get('store').merge(this.get('model.project'));
        this.transitionToRoute('graph', this.get('model.project._uuid'), { queryParams: { currentTab: 'visualizations' }});
      }
    },

    navigateToExport() {
      if (!this.get('sidebarTabExportDisabled')) {
        this.get('store').merge(this.get('model.project'));
        this.transitionToRoute('graph', this.get('model.project._uuid'), { queryParams: { currentTab: 'export' }});
      }
    }

  }

});
