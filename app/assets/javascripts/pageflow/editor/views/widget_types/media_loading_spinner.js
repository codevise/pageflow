pageflow.editor.widgetTypes.register('media_loading_spinner', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('loading_spinner', function() {
        this.view(pageflow.InfoBoxView, {
          text: I18n.t('pageflow.editor.media_loading_spinner.widget_type_info_box_text')
        });
        this.input('custom_background_image_id', pageflow.FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'widgetConfiguration'
        });
        this.input('invert', pageflow.CheckBoxInputView);
        this.input('remove_logo', pageflow.CheckBoxInputView);
        this.input('blur_strength', pageflow.SliderInputView);
      });
    }
  })
});
