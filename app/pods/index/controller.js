import Ember from 'ember';

export default Ember.Controller.extend({

  testValue: 2,

  hasProject:function(){
    return this.get('store').has()
  }.property('store'),

  actions: {


    /* Modal Implementation

    - Trigger btn in ./template.header.hbs
    - {{confirm-dialog name="confirm"}} added to mapp/templates/application.hbs

    testModal(){

      this.get('ModalManager')
        .show('confirm', "Êtes vous sur de vouloir supprimer cet élément ?", "Confirmation de suppression", 'Oui', 'Annuler')
        .then(() => {
          console.log('Ok then')
        });

    },
     */


    resumeProject() {
      this.transitionToRoute('graph', this.get('store').list().get('lastObject._uuid'));
    },

    newProject(){
      this.transitionToRoute('project', 'new');
    }
  }

});
