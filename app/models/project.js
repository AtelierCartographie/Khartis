import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';
import GraphLayout from './graph-layout';
import GraphLayer from './graph-layer';
import GeoDef from './geo-def';
/* global Em */

let Project = Struct.extend({
  
    data: null,
    
    graphLayout: null,
    
    graphLayers: null,

    labellingLayers: null,
    
    geoDef: null,
    
    title: "",
    dataSource: null,
    author: null,
    comment: null,

    report: null,

    blindnessMode: null,

    hasLabelling: function() {
      return this.get('labellingLayers') && this.get('labellingLayers').length > 0
       && this.get('labellingLayers').some( ll => ll.get('displayable') );
    }.property('labellingLayers.[]', 'labellingLayers.@each.displayable'),
    
    init() {
      this._super();
      if (!this.get('graphLayout')) {
        this.set('graphLayout', GraphLayout.createDefault());
      }
      this.set('graphLayers', Em.A());
      this.set('labellingLayers', Em.A());
    },
    
    importRawData(data) {
      this.set('graphLayers', Em.A());
      this.set('labellingLayers', Em.A());
      this.set('geoDef', null);
      this.set('data', DataStruct.createFromRawData(data));
      this.set('report', this.get('data').analyse());
    },
    
    export() {
      return this._super({
        data: this.get('data') ? this.get('data').export() : null,
        graphLayout: this.get('graphLayout').export(),
        graphLayers: this.get('graphLayers').map( gl => gl.export() ),
        labellingLayers: this.get('labellingLayers').map( gl => gl.export() ),
        geoDef: this.get('geoDef') ? this.get('geoDef').export() : null,
        title: this.get('title'),
        dataSource: this.get('dataSource'),
        author: this.get('author'),
        comment: this.get('comment'),
        blindnessMode: this.get('blindnessMode'),
        report: this.get('report')
      });
    }
    
});

Project.reopenClass({
  
    createEmpty() {
      return Project.create({
        data: DataStruct.createFromRawData([])
      })
    },
    
    restore(json, refs = {}) {
        let o = this._super(json, refs, {
          title: json.title,
          dataSource: json.dataSource,
          author: json.author,
          comment: json.comment,
          blindnessMode: json.blindnessMode,
          graphLayout: GraphLayout.restore(json.graphLayout, refs)
        });
        return new Promise( (res, rej) => {
          if (o.get('graphLayout.basemap')) {
            o.get('graphLayout.basemap').loadDictionaryData()
              .then( () => {
                res(o);
              });
          } else {
            res(o);
          }
        }).then( (o) => {
          o.setProperties({
            data: DataStruct.restore(json.data, refs),
            graphLayers: json.graphLayers.map( gl => GraphLayer.restore(gl, refs) ),
            labellingLayers: json.labellingLayers.map( gl => GraphLayer.restore(gl, refs) ),
            geoDef: json.geoDef ? GeoDef.restore(json.geoDef, refs) : null,
            report: json.report
          });
          return o;
        });
    }
    
});

export default Project;
