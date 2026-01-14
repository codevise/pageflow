import Backbone from 'backbone';
import I18n from 'i18n-js';
import {DestroyMenuItem} from 'pageflow/editor';

import {SelectMoveDestinationDialogView} from '../views/SelectMoveDestinationDialogView';

export const HideShowSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {section}) {
    this.section = section;

    this.listenTo(section.configuration, 'change:hidden', this.update);
    this.update();
  },

  selected() {
    if (this.section.configuration.get('hidden')) {
      this.section.configuration.unset('hidden');
    }
    else {
      this.section.configuration.set('hidden', true);
    }
  },

  update() {
    this.set('label', I18n.t(
      this.section.configuration.get('hidden') ?
      'pageflow_scrolled.editor.section_menu_items.show' :
      'pageflow_scrolled.editor.section_menu_items.hide'
    ));
  }
});

export const DuplicateSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {section}) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.duplicate'));
  },

  selected() {
    this.section.chapter.duplicateSection(this.section);
  }
});

export const InsertSectionAboveMenuItem = Backbone.Model.extend({
  initialize(attributes, {section}) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.insert_section_above'));
  },

  selected() {
    this.section.chapter.insertSection({before: this.section});
  }
});

export const InsertSectionBelowMenuItem = Backbone.Model.extend({
  initialize(attributes, {section}) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.insert_section_below'));
  },

  selected() {
    this.section.chapter.insertSection({after: this.section});
  }
});

export const CutoffSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {cutoff, section}) {
    this.cutoff = cutoff;
    this.section = section;

    this.listenTo(cutoff, 'change', this.update);
    this.update();
  },

  selected() {
    if (this.cutoff.isAtSection(this.section)) {
      this.cutoff.reset();
    }
    else {
      this.cutoff.setSection(this.section);
    }
  },

  update() {
    this.set('label', I18n.t(
      this.cutoff.isAtSection(this.section) ?
      'pageflow_scrolled.editor.section_menu_items.reset_cutoff' :
      'pageflow_scrolled.editor.section_menu_items.set_cutoff'
    ));
  }
});

export const CopyPermalinkMenuItem = Backbone.Model.extend({
  initialize(attributes, {entry, section}) {
    this.entry = entry;
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.copy_permalink'));
  },

  selected() {
    navigator.clipboard.writeText(
      this.entry.getSectionPermalink(this.section)
    );
  }
});

export const MoveSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {entry, section}) {
    this.entry = entry;
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.move'));
  },

  selected() {
    const section = this.section;

    SelectMoveDestinationDialogView.show({
      entry: this.entry,
      mode: 'insertPosition',
      onSelect: ({section: targetSection, position}) => {
        if (position === 'before') {
          targetSection.chapter.moveSection(section, {before: targetSection});
        }
        else {
          targetSection.chapter.moveSection(section, {after: targetSection});
        }
      }
    });
  }
});

export const DestroySectionMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_section_menu_item',

  initialize(attributes, options) {
    DestroyMenuItem.prototype.initialize.call(
      this,
      attributes,
      {destroyedModel: options.section}
    );
  }
});

export function createSectionMenuItems({entry, section}) {
  return [
    new DuplicateSectionMenuItem({}, {section}),
    new MoveSectionMenuItem({}, {entry, section}),
    new InsertSectionAboveMenuItem({}, {section}),
    new InsertSectionBelowMenuItem({}, {section}),
    ...(entry.cutoff.isEnabled() ?
        [new CutoffSectionMenuItem({}, {cutoff: entry.cutoff, section})] :
        []),
    new CopyPermalinkMenuItem({separated: true}, {entry, section}),
    new HideShowSectionMenuItem({separated: true}, {section}),
    new DestroySectionMenuItem({}, {section})
  ];
}
