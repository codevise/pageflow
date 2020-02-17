import {EditConfigurationView} from 'pageflow/editor';

export const EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix() {
    return `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}`
  },

  configure(configurationEditor) {
    this.options.editor.contentElementTypes
        .setupConfigurationEditor(this.model.get('typeName'),
                                  configurationEditor);
  }
});
