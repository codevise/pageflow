import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/urlInput.jst';

/**
 * Input view for URLs.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string[]} options.supportedHosts
 *   List of allowed url prefixes.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the url is blank.
 *
 * @param {boolean} [options.permitHttps=false]
 *   Allow urls with https protocol.
 *
 * @class
 */
export const UrlInputView = Marionette.Layout.extend(
  /** @lends UrlInputView.prototype */{

  mixins: [inputView],

  template,

  ui: {
    input: 'input',
    validation: '.validation'
  },

  events: {
    'change': 'onChange'
  },

  onRender: function() {
    this.ui.validation.hide();
    this.load();
    this.validate();
  },

  onChange: function() {
    var view = this;

    this.saveDisplayProperty();

    this.validate().done(function() {
      view.save();
    });
  },

  saveDisplayProperty: function() {
    this.model.set(this.options.displayPropertyName, this.ui.input.val());
    this.model.unset(this.options.propertyName);
  },

  save: function() {
    var view = this;

    $.when(this.transformPropertyValue(this.ui.input.val())).then(function(value) {
      view.model.set(view.options.propertyName, value);
    });
  },

  load: function() {
    this.ui.input.val(this.model.get(this.options.displayPropertyName));
    this.onLoad();
  },

  /**
   * Override to be notified when the input has been loaded.
   */
  onLoad: function() {},

  /**
   * Override to validate the untransformed url. Validation error
   * message can be passed as rejected promise. Progress notifications
   * are displayed. Only valid urls are stored in the configuration.
   *
   * @return Promise
   */
  validateUrl: function(url) {
    return $.Deferred().resolve().promise();
  },

  /**
   * Override to transform the property value before it is stored.
   *
   * @return Promise | String
   */
  transformPropertyValue: function(value) {
    return value;
  },

  /**
   * Override to change the list of supported host names.
   */
  supportedHosts: function() {
    return this.options.supportedHosts;
  },

  validate: function(success) {
    var view = this;
    var options = this.options;
    var value = this.ui.input.val();

    if (options.required && !value) {
      displayValidationError(I18n.t('pageflow.ui.views.inputs.url_input_view.required_field'));
    }
    else if (value && !isValidUrl(value)) {
      var errorMessage = I18n.t('pageflow.ui.views.inputs.url_input_view.url_hint');

      if (options.permitHttps) {
        errorMessage = I18n.t('pageflow.ui.views.inputs.url_input_view.url_hint_https');
      }

      displayValidationError(errorMessage);
    }
    else if (value && !hasSupportedHost(value)) {
      displayValidationError(I18n.t('pageflow.ui.views.inputs.url_input_view.supported_vendors') +
                             _.map(view.supportedHosts(), function(url) {
                               return '<li>' + url +'</li>';
                             }).join(''));
    }
    else {
      return view.validateUrl(value)
        .progress(function(message) {
          displayValidationPending(message);
        })
        .done(function() {
          resetValidationError();
        })
        .fail(function(error) {
          displayValidationError(error);
        });
    }

    return $.Deferred().reject().promise();

    function isValidUrl(url) {
      return options.permitHttps ? url.match(/^https?:\/\//i) : url.match(/^http:\/\//i);
    }

    function hasSupportedHost(url) {
      return _.any(view.supportedHosts(), function(host) {
        return url.match(new RegExp('^' + host));
      });
    }

    function displayValidationError(message) {
      view.$el.addClass('invalid');
      view.ui.validation
        .removeClass('pending')
        .addClass('failed')
        .html(message)
        .show();
    }

    function displayValidationPending(message) {
      view.$el.removeClass('invalid');
      view.ui.validation
        .removeClass('failed')
        .addClass('pending')
        .html(message)
        .show();
    }

    function resetValidationError(message) {
      view.$el.removeClass('invalid');
      view.ui.validation.hide();
    }
  }
});
