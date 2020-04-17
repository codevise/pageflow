import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/urlDisplay.jst';

/**
 * Display view for a link to a URL, to be used like an input view.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string} [options.propertyName]
 *   Target URL for link
 *
 * @class
 */
export const UrlDisplayView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,

  ui: {
    link: 'a'
  },

  modelEvents: {
    'change': 'update'
  },

  events: {
    'click a': function(event) {
      // Ensure default is not prevented by parent event listener.
      event.stopPropagation();
    }
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    var url = this.model.get('original_url');

    this.$el.toggle(this.model.isUploaded() && !_.isEmpty(url));
    this.ui.link.attr('href', url);
  }
});
