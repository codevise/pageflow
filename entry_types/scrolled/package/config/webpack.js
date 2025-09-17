module.exports = {
  resolve: {
    alias: {
      // By default Video.js now includes the http-streaming
      // plugin. To reduce bundle size on mobile devices, we load it
      // dynamically in src/frontend/dash only if HLS is not natively
      // supported by the browser.
      'video.js$': 'video.js/core.es.js'
    },
    fallback: {
      // Silently ignore minimatch trying to load Node built-in module.
      'path': false
    }
  },
  entry: {
    'pageflow-scrolled/contentElements/tikTokEmbed-frontend': {
      import: [
        'pageflow-scrolled/contentElements/tikTokEmbed-frontend',
        'pageflow-scrolled/contentElements/tikTokEmbed-frontend.css'
      ]
    },
    'pageflow-scrolled/contentElements/hotspots-frontend': {
      import: [
        'pageflow-scrolled/contentElements/hotspots-frontend',
        'pageflow-scrolled/contentElements/hotspots-frontend.css'
      ]
    },
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
    'pageflow-scrolled/widgets/excursionSheet': {
      import: [
        'pageflow-scrolled/widgets/excursionSheet',
        'pageflow-scrolled/widgets/excursionSheet.css'
      ]
    },
    'pageflow-scrolled/widgets/mainStorylineSheet': {
      import: [
        'pageflow-scrolled/widgets/mainStorylineSheet',
        'pageflow-scrolled/widgets/mainStorylineSheet.css'
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
    },
    'pageflow-scrolled/widgets/iconScrollIndicator': {
      import: [
        'pageflow-scrolled/widgets/iconScrollIndicator',
        'pageflow-scrolled/widgets/iconScrollIndicator.css'
      ]
    }
  }
};
