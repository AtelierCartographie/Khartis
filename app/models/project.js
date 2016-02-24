import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';
import GraphLayout from './graph-layout';

let Project = Struct.extend({
  
    data: null,
    graphLayout: GraphLayout.create(),
    
    report: null,
    
    importRawData(data) {
      this.set('data', DataStruct.createFromRawData(data));
      this.set('report', this.get('data').analyse());
    },
    
    export() {
        return this._super({
            data: this.get('data') ? this.get('data').export() : null
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
        let o = this._super(json, refs);
        o.setProperties({
            data: DataStruct.restore(json.data, refs)
        });
        return o;
    }
    
});

export default Project;
