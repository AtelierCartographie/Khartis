import Ember from 'ember';
import {insideInterval, nestedMeans} from 'khartis/utils/stats';
import ValueMixins from './value';
import {compressIntervals} from 'khartis/utils/stats';

let LegendMixin = Ember.Mixin.create({

  getLegendIntervals() {

    let intervals = this.get('intervals').slice();

    if (ValueMixins.Data.detect(this)) {
      
      if (ValueMixins.Surface.detect(this)) {
        intervals.push(this.get('extent')[1]); //push max
        intervals = compressIntervals(intervals);
      } else {

        if (this.get('scale.usesInterval')) {
          intervals = compressIntervals(intervals, this.get('extent'));
          intervals.push(this.get('extent')[0]); //push min
          intervals = intervals.sort(d3.descending);
        } else {
          if (this.get('values').length > 2) {
            if (this.get('shouldDiverge')) {
              intervals = this.symbolLinearDiverging();
              intervals.push(this.get('scale.valueBreak'));
              intervals = compressIntervals(intervals);
              intervals = intervals.sort(d3.descending);
            } else {
              intervals = this.symbolLinear();
              this.get('scale.diverging') && intervals.push(this.get('scale.valueBreak'));
              intervals = compressIntervals(intervals);
              intervals = intervals.sort(d3.descending);
            }
          }
        }
      }
    }
    return intervals;
  },

  symbolLinear() {
    if (this.get('values').length >= 4) {
      return [this.get('extent')[0], ...nestedMeans(this.get('values'), 4), this.get('extent')[1]];
    } else if (this.get('values') >= 2) {
      return [this.get('extent')[0], ...nestedMeans(this.get('values'), 2), this.get('extent')[1]];
    } else {
      return this.get('extent');
    }
  },

  symbolLinearDiverging() {
    let neg = this.get('values').filter( v => v < this.get('scale.valueBreak') ),
        pos = this.get('values').filter( v => v > this.get('scale.valueBreak') ),
        minNeg = d3.max(neg),
        minPos = d3.min(pos);

    if (this.get('values').length >= 4) {
      return [this.get('extent')[0], ...nestedMeans(neg, 2), minNeg, minPos, ...nestedMeans(pos, 2), this.get('extent')[1]];
    } else if (neg >= 2) {
      return [this.get('extent')[0], ...nestedMeans(neg, 2), minNeg, minPos, this.get('extent')[1]];
    } else if (pos >= 2) {
      return [this.get('extent')[0], ...nestedMeans(pos, 2), minNeg, minPos, this.get('extent')[1]];
    } else {
      return this.get('extent');
    }
  }

});

export default LegendMixin;
