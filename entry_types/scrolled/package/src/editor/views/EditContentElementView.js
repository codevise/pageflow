import {EditConfigurationView} from 'pageflow/editor';
import {features} from 'pageflow/frontend';

import {
  DestroyContentElementMenuItem,
  DuplicateContentElementMenuItem,
  ExtractContentElementsFragmentMenuItem,
  MoveContentElementMenuItem,
  SelectMultipleContentElementsMenuItem
} from '../models/contentElementMenuItems';

export const EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix() {
    return `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}`
  },

  containingCollection() {
    return this.options.entry.contentElements;
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
      new DuplicateContentElementMenuItem({}, {
        contentElement: this.model,
        entry: this.options.entry,
        editor: this.options.editor
      }),
      new MoveContentElementMenuItem({}, {
        contentElement: this.model,
        entry: this.options.entry,
        editor: this.options.editor
      }),
      new SelectMultipleContentElementsMenuItem({separated: true}, {
        contentElement: this.model,
        entry: this.options.entry
      }),
      ...(features.isEnabled('fragments') ?
          [new ExtractContentElementsFragmentMenuItem({}, {
            entry: this.options.entry,
            items: [{id: this.model.id}]
          })] :
          []),
      new DestroyContentElementMenuItem({separated: true}, {
        contentElement: this.model,
        entry: this.options.entry,
        editor: this.options.editor
      })
    ];
  }
});
