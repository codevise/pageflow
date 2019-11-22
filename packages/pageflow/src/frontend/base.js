window.pageflow = {
  log: function(text, options) {
    if (window.console && (pageflow.debugMode() || (options && options.force))) {
      window.console.log(text);
    }
  },

  debugMode: function() {
    return (window.location.href.indexOf('debug=true') >= 0);
  }
};
