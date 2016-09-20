import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, this._trackPage);
  },

  _trackPage() {

      let routeName = this.get('currentRouteName').replace(/\.index$/g, ""),
          page = routeName.replace(/\./g, "/");
      
      if (routeName === "graph") {
        let state = this.get('router.state.queryParams.currentTab');
        routeName = routeName + "$" + (state ? state : "visualizations");
        page = page.replace(/\/index$/i, "/"+state);
      }

      let title = config.metricsRouteLabels[routeName];

      if (title) { //track only if a title has bean found
        this.get('metrics').trackPage({ page, title });
      }

  }

});

Router.map(function() {

    this.route("index", {path: "/"});

    this.route("project", {path:"project/:uuid"}, function(){
        this.route("step1");
        this.route("step2", function() {
          this.route("column", {path: "column/:columnId"});
        });
    });

    this.route("graph", {path: "graph/:uuid"}, function() {
        this.route("projection");
        this.route("layer", {path: "layer/:layerId"}, function() {
          this.route("edit");
        });
    });

});

export default Router;
