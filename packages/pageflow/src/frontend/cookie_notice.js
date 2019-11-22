pageflow.cookieNotice = {
  request: function() {
    pageflow.ready.then(function() {
      pageflow.events.trigger('cookie_notice:request');
    });
  },
};
