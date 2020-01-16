import $ from 'jquery';
import I18n from 'i18n-js';
import _ from 'underscore';

import {UrlInputView} from './UrlInputView';

/**
 * Input view that verifies that a certain URL is reachable via a
 * proxy. To conform with same origin restrictions, this input view
 * lets the user enter some url and saves a rewritten url where the
 * domain is replaced with some path segment.
 *
 * That way, when `/example` is setup to proxy requests to
 * `http://example.com`, the user can enter an url of the form
 * `http://example.com/some/path` but the string `/example/some/path`
 * is persisited to the database.
 *
 * See {@link inputView} for further options
 *
 * @param {Object} options
 *
 * @param {string} options.displayPropertyName
 *   Attribute name to store the url entered by the user.
 *
 * @param {Object[]} options.proxies
 *   List of supported proxies.
 *
 * @param {string} options.proxies[].url
 *   Supported prefix of an url that can be entered by the user.
 *
 * @param {string} options.proxies[].base_path
 *   Path to replace the url prefix with.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the url is blank.
 *
 * @param {boolean} [options.permitHttps=false]
 *   Allow urls with https protocol.
 *
 * @example
 *
 * this.input('url, ProxyUrlInputView, {
 *   proxies: [
 *     {
 *       url: 'http://example.com',
 *       base_path: '/example'
 *     }
 *   ]
 * });
 *
 * @class
 */
export const ProxyUrlInputView = UrlInputView.extend(
  /** @lends ProxyUrlInputView.prototype */{

  // @override
  validateUrl: function(url) {
    var view = this;

    return $.Deferred(function(deferred) {
      deferred.notify(I18n.t('pageflow.ui.views.inputs.proxy_url_input_view.url_validation'));

      $.ajax({
        url: view.rewriteUrl(url),
        dataType: 'html'
      })
        .done(deferred.resolve)
        .fail(function(xhr) {
          deferred.reject(I18n.t('pageflow.ui.views.inputs.proxy_url_input_view.http_error', { status: xhr.status}));
        });
    }).promise();
  },

  // override
  transformPropertyValue: function(url) {
    return this.rewriteUrl(url);
  },

  // override
  supportedHosts: function() {
    return _.pluck(this.options.proxies, 'url');
  },

  rewriteUrl: function(url) {
    _.each(this.options.proxies, function(proxy) {
      url = url.replace(new RegExp('^' + proxy.url + '/?'), proxy.base_path + '/');
    });

    return url;
  }
});
