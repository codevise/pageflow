//= require ./url_input_view

pageflow.ProxyUrlInputView = pageflow.UrlInputView.extend({
  /** @override */
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

  /** @override */
  transformPropertyValue: function(url) {
    return this.rewriteUrl(url);
  },

  /** @override */
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