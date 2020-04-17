import $ from 'jquery';
import _ from 'underscore';

export const widgetTypes = (function() {
  var registry = {};

  var base = {
    enhance: function(element) {}
  };

  return {
    register: function(name, widgetType) {
      registry[name] = _.extend({}, base, widgetType);
    },

    enhance: function(container) {
      function enhance(element) {
        var typeName = $(element).data('widget');

        if (registry[typeName]) {
          registry[typeName].enhance(element);
        }
      }

      container.find('[data-widget]').each(function() {
        enhance($(this));
      });
    }
  };
}());