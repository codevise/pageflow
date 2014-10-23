//= require ./url_input_view

pageflow.ProxyUrlInputView = pageflow.UrlInputView.extend({
  /** @override */
  validateUrl: function(url) {
    var view = this;

    return $.Deferred(function(deferred) {
      deferred.notify('Pr<C3><BC>fe Erreichbarkeit der URL...');

      $.ajax({
        url: view.rewriteUrl(url),
        dataType: 'html'
      })
        .done(deferred.resolve)
        .fail(function(xhr) {
          deferred.reject('Die URL konnte nicht erfolgreich abgerufen werden (Der Server antwortete mit HTTP Status Code ' + xhr.status + ')');
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