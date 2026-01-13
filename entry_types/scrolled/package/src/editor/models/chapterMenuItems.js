import {DestroyMenuItem} from 'pageflow/editor';

export const DestroyChapterMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_chapter_menu_item',

  initialize(attributes, options) {
    DestroyMenuItem.prototype.initialize.call(
      this,
      attributes,
      {destroyedModel: options.chapter}
    );
  }
});
