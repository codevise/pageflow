import {EditConfigurationView} from 'pageflow/editor';
import {CheckBoxInputView, TextInputView, TextAreaInputView} from 'pageflow/ui';

import {
  CopyPermalinkMenuItem,
  DestroyChapterMenuItem,
  ToggleExcursionMenuItem
} from '../models/chapterMenuItems';

export const EditChapterView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_chapter',

  getActionsMenuItems() {
    return [
      new ToggleExcursionMenuItem({}, {chapter: this.model}),
      new CopyPermalinkMenuItem({}, {entry: this.options.entry, chapter: this.model}),
      new DestroyChapterMenuItem({separated: true}, {chapter: this.model})
    ];
  },

  configure: function(configurationEditor) {
    const chapter = this.model;

    configurationEditor.tab(chapter.isExcursion() ? 'excursion' : 'chapter', function() {
      this.input('title', TextInputView);

      if (this.model.parent.storyline.isMain()) {
        this.input('hideInNavigation', CheckBoxInputView);
        this.input('summary', TextAreaInputView, {
          disableLinks: true
        });
      }
      else {
        this.group('ChapterExcursionSettings', {ignoreUndefined: true});
      }
    });
  }
});
