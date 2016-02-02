import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';

let Project = Struct.extend({
  
    data: null,
    
    importRawData(data) {
      this.set('data', DataStruct.createFromRawData(data));
    },
    
    export() {
        return this._super({
            data: this.get('data').export()
        });
    }
    
});

Project.reopenClass({
    restore(json, refs = {}) {
        let o = this._super(json, refs);
        o.setProperties({
            data: DataStruct.restore(json.data, refs)
        });
        return o;
    }
});

export default Project;
