import {EditConfigurationView} from 'pageflow/editor';

import {DestroyContentElementMenuItem} from '../models/contentElementMenuItems';

export const EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix() {
    return `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}`
  },

  configure(configurationEditor) {
    this.options.editor.contentElementTypes
        .setupConfigurationEditor(this.model.get('typeName'),
                                  configurationEditor,
                                  {entry: this.options.entry,
                                   contentElement: this.model});
  },

  getActionsMenuItems() {
    return [
      new DestroyContentElementMenuItem({}, {
        contentElement: this.model,
        entry: this.options.entry,
        editor: this.options.editor
      })
    ];
  }
});
