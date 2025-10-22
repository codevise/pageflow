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
 * @param {Object.<string, Function>} options.processingFunctions
 *   Map of provider names to processing functions. Each function receives
 *   the oEmbed response and should return a transformed/normalized URL string.
 *
 * @example
 *
 *   new OembedUrlInputView({
 *     model: contentElement,
 *     propertyName: 'url',
 *     displayPropertyName: 'displayUrl',
 *     providerNameProperty: 'provider',
 *     processingFunctions: {
 *       bluesky: function(response) {
 *         // Return canonical URL from response
 *         return response.url || response.author_url;
 *       }
 *     }
 *   });
 *
 * @class
 */
export const OembedUrlInputView = UrlInputView.extend({
  supportedHosts: function() {
    // Accept all hosts - provider-specific validation happens via oEmbed
    return ['.*'];
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

    var providerName = this.model.get(this.options.providerNameProperty);
    var processingFunction = this.options.processingFunctions &&
                             this.options.processingFunctions[providerName];

    if (processingFunction) {
      return processingFunction(oembedResponse);
    }

    return value;
  }
});
