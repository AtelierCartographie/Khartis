import Ember from 'ember';
import Struct from './struct';
import {DataStruct} from './data';

let Project = Struct.extend({
  
    data: null,
    
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
