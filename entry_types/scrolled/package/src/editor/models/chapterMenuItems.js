import Backbone from 'backbone';
import I18n from 'i18n-js';
import {DestroyMenuItem} from 'pageflow/editor';

export const ToggleExcursionMenuItem = Backbone.Model.extend({
  initialize(attributes, {chapter}) {
    this.chapter = chapter;

    this.listenTo(chapter, 'change:storylineId', this.update);
    this.update();
  },

  selected() {
    this.chapter.toggleExcursion();
  },

  update() {
    this.set('label', I18n.t(
      this.chapter.isExcursion() ?
      'pageflow_scrolled.editor.chapter_menu_items.move_to_main' :
      'pageflow_scrolled.editor.chapter_menu_items.move_to_excursions'
    ));
  }
});

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
