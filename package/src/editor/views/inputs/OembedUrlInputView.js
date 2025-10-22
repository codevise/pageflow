import $ from 'jquery';
import I18n from 'i18n-js';

import {UrlInputView} from 'pageflow/ui';

/**
 * Input view for oEmbed URLs that resolves and normalizes URLs via oEmbed.
 *
 * Extends UrlInputView to validate URLs via oEmbed and optionally transform
 * them using provider-specific processing functions. The oEmbed response is
 * not stored; it's only used during validation to normalize/transform the URL.
 *
 * @param {Object} [options]
 *
 * @param {string} options.providerNameProperty
 *   Name of the property on the model that contains the provider name.
 *
 * @param {Object.<string, Object>} [options.providers]
 *   Map of provider names to provider configuration objects. Each provider
 *   config can have:
 *   - `supportedHosts`: Array of supported host patterns (e.g., ['bsky.app', 'bsky.social']).
 *     If not specified, all hosts are accepted.
 *   - `transform`: Function that receives the oEmbed response and returns
 *     a transformed/normalized URL string.
 *   - `skipOembedValidation`: Boolean to skip oEmbed validation entirely
 *     for this provider.
 *
 * @example
 *
 *   new OembedUrlInputView({
 *     model: contentElement,
 *     propertyName: 'url',
 *     displayPropertyName: 'displayUrl',
 *     providerNameProperty: 'provider',
 *     providers: {
 *       bluesky: {
 *         supportedHosts: ['bsky.app', 'bsky.social'],
 *         transform: function(response) {
 *           // Return canonical URL from response
 *           return response.url || response.author_url;
 *         }
 *       },
 *       instagram: {
 *         supportedHosts: ['instagram.com', 'www.instagram.com'],
 *         skipOembedValidation: true
 *       }
 *     }
 *   });
 *
 * @class
 */
export const OembedUrlInputView = UrlInputView.extend({
  onRender: function() {
    UrlInputView.prototype.onRender.call(this);

    this.displayUrlsByProvider = {};
    this.listenTo(this.model, 'change:' + this.options.providerNameProperty, this.onProviderChange);
  },

  onProviderChange: function() {
    var oldProvider = this.model.previous(this.options.providerNameProperty);
    var newProvider = this.model.get(this.options.providerNameProperty);
    var currentDisplayUrl = this.model.get(this.options.displayPropertyName);

    if (currentDisplayUrl) {
      this.displayUrlsByProvider[oldProvider] = currentDisplayUrl;
    }

    var restoredDisplayUrl = this.displayUrlsByProvider[newProvider];

    this.model.set({
      [this.options.propertyName]: '',
      [this.options.displayPropertyName]: restoredDisplayUrl || ''
    });

    this.onChange();
  },

  providerOptions: function() {
    var providerName = this.model.get(this.options.providerNameProperty);
    return (this.options.providers && this.options.providers[providerName]) || {};
  },

  supportedHosts: function() {
    return this.providerOptions().supportedHosts || ['.*'];
  },

  permitHttps: function() {
    return true;
  },

  validateUrl: function(url) {
    var providerName = this.model.get(this.options.providerNameProperty);
    var deferred = $.Deferred();

    if (!url || !providerName) {
      deferred.resolve();
      return deferred.promise();
    }

    if (this.providerOptions().skipOembedValidation) {
      deferred.resolve();
      return deferred.promise();
    }

    deferred.notify(I18n.t('pageflow.editor.views.inputs.oembed_url_input_view.status.resolving'));

    $.ajax({
      url: '/editor/oembed',
      data: {
        provider: providerName,
        url: url
      },
      dataType: 'json'
    }).done((response) => {
      deferred.resolve(response);
    }).fail((xhr) => {
      if (xhr.statusText === 'abort') {
        deferred.reject();
        return;
      }

      var errorKey;
      if (xhr.status === 422) {
        errorKey = 'invalid_provider';
      }
      else if (xhr.status === 404) {
        errorKey = 'not_found';
      }
      else {
        errorKey = 'error';
      }

      deferred.reject(I18n.t('pageflow.editor.views.inputs.oembed_url_input_view.status.' + errorKey));
    });

    return deferred.promise();
  },

  transformPropertyValue: function(value, oembedResponse) {
    if (!oembedResponse) {
      return value;
    }

    var transformFunction = this.providerOptions().transform;

    if (transformFunction) {
      return transformFunction(oembedResponse);
    }

    return value;
  }
});
