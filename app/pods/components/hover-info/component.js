import Ember from 'ember';

export default Ember.Component.extend({

  data: null,

  layers: null,

  geoInfos: function() {
    
    if (this.get('data').land) {
        
      let nameLabel = "",
          ks = [
            "name_ISO_"+this.get('i18n.locale').toUpperCase(),
            "name_"+this.get('i18n.locale').toUpperCase(),
            "Name",
            "name",
            "name_EN"
          ];
      
      for (let k of ks) {
        if (this.get('data').land[k]) {
          nameLabel = this.get('data').land[k];
        }
      }
  
      return [{
        label: nameLabel
      }];
    } else {
      return [{
        label: `${this.get('data').coordinates[0]},${this.get('data').coordinates[1]}`
      }]
    }
  }.property('data.land'),

  cellInfos: function() {
    if (this.get('data.row')) {
      return this.get('data.row.cells').map( c => {
        return {
          value: c.get('value'),
          column: c.get('column'),
          mapped: this.get('layers').find( l => l.get('mapping.varCol') == c.get('column') )
        };
      });
    } else {
      return [];
    }
  }.property('data.row')

});
