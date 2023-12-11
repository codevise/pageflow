module.exports = {
  resolve: {
    alias: {
      // By default Video.js now includes the http-streaming
      // plugin. To reduce bundle size on mobile devices, we load it
      // dynamically in src/frontend/dash only if HLS is not natively
      // supported by the browser.
      'video.js$': 'video.js/core.es.js'
    },
  },
  entry: {
    'pageflow-scrolled/widgets/defaultNavigation': {
      import: [
        'pageflow-scrolled/widgets/defaultNavigation',
        'pageflow-scrolled/widgets/defaultNavigation.css'
      ]
    },
    'pageflow-scrolled/widgets/consentBar': {
      import: [
        'pageflow-scrolled/widgets/consentBar',
        'pageflow-scrolled/widgets/consentBar.css'
      ]
    },
    'pageflow-scrolled/widgets/iconInlineFileRights': {
      import: [
        'pageflow-scrolled/widgets/iconInlineFileRights',
        'pageflow-scrolled/widgets/iconInlineFileRights.css'
      ]
    },
    'pageflow-scrolled/widgets/textInlineFileRights': {
      import: [
        'pageflow-scrolled/widgets/textInlineFileRights',
        'pageflow-scrolled/widgets/textInlineFileRights.css'
      ]
    }
  }
};
