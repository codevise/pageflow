pageflow.PageType = pageflow.Object.extend({
  initialize: function(name, options, seed) {
    this.name = name;
    this.options = options;
    this.seed = seed;
  },

  translationKey: function() {
    return this.seed.translation_key;
  },

  thumbnailCandidates: function() {
    return this.seed.thumbnail_candidates;
  },

  pageLinks: function(configuration) {
    if ('pageLinks' in this.options) {
      return this.options.pageLinks(configuration);
    }
  },

  configurationEditorView: function() {
    return this.options.configurationEditorView ||
      pageflow.ConfigurationEditorView.repository[this.name];
  },

  embeddedViews: function() {
    return this.options.embeddedViews;
  },

  createConfigurationEditorView: function(options) {
    var constructor = this.configurationEditorView();
    options.pageType = this.seed;

    return new constructor(_.extend({
      tabTranslationKeyPrefixes: [
        this.seed.translation_key_prefix + '.page_configuration_tabs',
        'pageflow.common_page_configuration_tabs'
      ],
      attributeTranslationKeyPrefixes: [
        this.seed.translation_key_prefix + '.page_attributes',
        'pageflow.common_page_attributes'
      ]
    }, options));
  },

  createPageLinkConfigurationEditorView: function(options) {
    var constructor = this.options.pageLinkConfigurationEditorView ||
      pageflow.PageLinkConfigurationEditorView;

    return new constructor(_.extend({
      tabTranslationKeyPrefixes: [
        this.seed.translation_key_prefix + '.page_link_configuration_tabs',
        'pageflow.common_page_link_configuration_tabs'
      ],
      attributeTranslationKeyPrefixes: [
        this.seed.translation_key_prefix + '.page_link_attributes',
        'pageflow.common_page_link_attributes'
      ]
    }, options));
  },

  supportsPhoneEmulation: function() {
    return !!this.options.supportsPhoneEmulation;
  }
});
