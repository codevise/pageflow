pageflow.editor.widgetTypes.register('classic_loading_spinner', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('loading_spinner', function() {
        this.view(pageflow.InfoBoxView, {
          text: I18n.t('pageflow.editor.classic_loading_spinner.widget_type_info_box_text')
        });
      });
    }
  })
});
