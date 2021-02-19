module.exports = {
  resolve: {
    alias: {
      // By default Video.js now includes the http-streaming
      // plugin. To reduce bundle size on mobile devices, we load it
      // dynamically in src/frontend/dash only if HLS is not natively
      // supported by the browser.
      'video.js$': 'video.js/core.es.js'
    },
  }
};
