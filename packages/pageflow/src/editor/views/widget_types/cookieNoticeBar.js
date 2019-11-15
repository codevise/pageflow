pageflow.editor.widgetTypes.registerRole('cookie_notice', {
  isOptional: true
});

pageflow.editor.widgetTypes.register('cookie_notice_bar', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('cookie_notice_bar', function() {
        this.view(pageflow.InfoBoxView, {
          text: I18n.t('pageflow.editor.cookie_notice_bar.widget_type_info_box_text')
        });
      });
    }
  })
});
