import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),

  hasWarnings: function() {
    return this.get('model.project.report.warnings').length > 0;
  }.property('model.project.report.warnings'),

  hasErrors: function() {
    return this.get('model.project.report.errors').length > 0;
  }.property('model.project.report.errors'),
  
  bodyPreview: function() {
    return this.get('model.project.data.body').slice(0, 10);
  }.property('model.project.data.body.[]'),

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

    back() {
      this.transitionToRoute('project.step1');
    },

    next(){
      this.get('store').merge(this.get('model.project'));
      this.transitionToRoute('graph', this.get('model.project._uuid'));
    }

  }

});
