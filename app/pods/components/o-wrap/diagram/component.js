import Ember from 'ember';
import {DISPLAY_METHOD as DIAGRAM_METHOD} from 'khartis/pods/components/distribution-graph/component';

export default Ember.Component.extend({

  tagName: "",

  diagramMethods: DIAGRAM_METHOD,
  selectedDiagramMethod: DIAGRAM_METHOD.CLASSES,

});
