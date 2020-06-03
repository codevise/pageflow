import {EditConfigurationView} from 'pageflow/editor';

export const EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix() {
    return `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}`
  },

  configure(configurationEditor) {
    this.options.editor.contentElementTypes
        .setupConfigurationEditor(this.model.get('typeName'),
                                  configurationEditor,
                                  {entry: this.options.entry});
  },

  destroyModel() {
    const contentElementType =
      this.options.editor.contentElementTypes.findByTypeName(this.model.get('typeName'));

    if (contentElementType.handleDestroy) {
      const result = contentElementType.handleDestroy(this.model);

      if (result === false) {
        return false;
      }
    }

    this.options.entry.deleteContentElement(this.model);
  }
});
