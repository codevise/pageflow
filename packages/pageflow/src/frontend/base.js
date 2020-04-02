export const log = function(text, options) {
  if (window.console && (debugMode() || (options && options.force))) {
    window.console.log(text);
  }
};

export const debugMode = function() {
  return (window.location.href.indexOf('debug=true') >= 0);
};

