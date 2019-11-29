import Backbone from 'backbone';
import _ from 'underscore';

// Class-y constructor by github.com/opensas
// https://github.com/jashkenas/backbone/issues/2601

export default function BaseObject(options) {
  this.initialize.apply(this, arguments);
}

_.extend(BaseObject.prototype, Backbone.Events, {
  initialize: function(options) {}
});

// The self-propagating extend function that Backbone classes use.
BaseObject.extend = Backbone.Model.extend;
