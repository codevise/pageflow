pageflow.ConfigurationEditorTabView.groups.define('page_transitions', function(options) {
  var inputOptions = {
    translationKeyPrefix: 'pageflow.page_transitions',
    blankTranslationKey: 'pageflow.page_transitions.default',
    values: pageflow.pageTransitions.names()
  };

  if (pageflow.navigationDirection.isHorizontalOnPhone()) {
    inputOptions.additionalInlineHelpText =
      I18n.t('pageflow.editor.phone_horizontal_slideshow_mode.page_transitions_inline_help');
  }

  this.input(options.propertyName || 'page_transition',
             pageflow.SelectInputView,
             _.extend(inputOptions, options));
});
