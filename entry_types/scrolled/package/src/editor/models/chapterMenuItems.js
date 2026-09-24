import Backbone from 'backbone';
import I18n from 'i18n-js';
import {app, DestroyMenuItem} from 'pageflow/editor';

export const CopyPermalinkMenuItem = Backbone.Model.extend({
  initialize(attributes, {entry, chapter}) {
    this.entry = entry;
    this.chapter = chapter;
    this.set('label', I18n.t('pageflow_scrolled.editor.chapter_menu_items.copy_permalink'));
  },

  selected() {
    navigator.clipboard.writeText(
      this.entry.getChapterPermalink(this.chapter)
    );
  }
});

export const ExtractFragmentMenuItem = Backbone.Model.extend({
  initialize(attributes, {chapter}) {
    this.chapter = chapter;
    this.update('extract_fragment', {disabled: false});
  },

  selected() {
    this.update('extracting_fragment', {disabled: true});

    return this.chapter.extractToFragmentLibrary().then(
      () => this.update('extracted_fragment', {disabled: true}),
      ({status}) => {
        this.update('extract_fragment', {disabled: false});
        app.trigger('error', {
          message: t(status === 403 ?
                     'extract_fragment_forbidden' :
                     'extract_fragment_failed')
        });
      }
    );
  },

  update(labelKey, {disabled}) {
    this.set({label: t(labelKey), disabled});
  }
});

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

function t(key) {
  return I18n.t(`pageflow_scrolled.editor.chapter_menu_items.${key}`);
}
