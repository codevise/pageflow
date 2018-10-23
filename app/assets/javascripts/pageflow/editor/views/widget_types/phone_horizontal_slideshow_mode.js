pageflow.editor.widgetTypes.register('phone_horizontal_slideshow_mode', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('phone_horizontal_slideshow_mode', function() {
        this.view(pageflow.InfoBoxView, {
          text: I18n.t('pageflow.editor.phone_horizontal_slideshow_mode.widget_type_info_box_text')
        });
        this.view(pageflow.HelpImageView, {
          imageName: 'phone_horizontal_slideshow_mode'
        });
      });
    }
  })
});
