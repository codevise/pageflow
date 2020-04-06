import Backbone from 'backbone';
import _ from 'underscore';

export const fakeEventEmitter = function(obj) {
  return _.extend(obj || {}, Backbone.Events);
};
