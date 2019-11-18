import Backbone from 'backbone';
import _ from 'underscore';

support.fakeEventEmitter = function(obj) {
  return _.extend(obj || {}, Backbone.Events);
};
