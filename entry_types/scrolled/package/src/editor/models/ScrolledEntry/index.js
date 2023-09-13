import {Entry, editor} from 'pageflow/editor';
import I18n from 'i18n-js';

import {ChaptersCollection, SectionsCollection, ContentElementsCollection} from '../../collections';
import {ContentElement} from '../ContentElement';

import {insertContentElement} from './insertContentElement';
import {moveContentElement} from './moveContentElement';
import {deleteContentElement} from './deleteContentElement';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections,
                                           {contentElements: this.contentElements});
    this.chapters = new ChaptersCollection(seed.collections.chapters,
                                           {sections: this.sections,
                                            entry: this});
    this.chapters.parentModel = this;

    this.sections.sort();

    editor.failures.watch(this.contentElements);
    editor.failures.watch(this.sections);
    editor.failures.watch(this.chapters);

    editor.savingRecords.watch(this.contentElements);
    editor.savingRecords.watch(this.sections);
    editor.savingRecords.watch(this.chapters);

    this.scrolledSeed = seed;
  },

  addChapter(attributes) {
    this.chapters.create({
      position: this.chapters.length,
      ...attributes
    }, {
      entry: this,
      sections: this.sections
    });
  },

  insertContentElement(attributes, {id, at, splitPoint}) {
    if (at === 'endOfSection') {
      const contentElement = new ContentElement({
        position: this.contentElements.length,
        ...attributes
      });
      contentElement.applyDefaultConfiguration();

      this.sections.get(id).contentElements.add(contentElement);
      contentElement.save();

      contentElement.once('sync', () => {
        this.trigger('selectContentElement', contentElement);
      });
    }
    else {
      insertContentElement(this,
                           this.contentElements.get(id),
                           attributes,
                           {at, splitPoint});
    }
  },

  moveContentElement(
    {id: movedId, range: movedRange},
    {id, at, splitPoint}
  ) {
    moveContentElement(this, this.contentElements.get(movedId), {
      range: movedRange,
      sibling: this.contentElements.get(id),
      at,
      splitPoint
    });
  },

  deleteContentElement(id) {
    deleteContentElement(this, this.contentElements.get(id));
  },

  getTypographyVariants({contentElement, prefix}) {
    const typographyRuleNames = Object.keys(
      this.scrolledSeed.config.theme.options.typography || {}
    );
    const legacyTypographyVariants = this.scrolledSeed.legacyTypographyVariants || {}

    const rulePrefix = [
      ...[contentElement.get('typeName'), prefix].filter(Boolean),
      ''
    ].join('-')

    const ruleNames = typographyRuleNames
      .filter(
        name => name.indexOf(rulePrefix) === 0
      )
      .filter(
        name => !legacyTypographyVariants[name.split('-').pop()]
      );
    const values = ruleNames.map(
      name => name.split('-').pop()
    );
    const texts = ruleNames.map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.typography_variants.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.typography_variants.${name}`)}
      )
    );

    return [values, texts];
  },

  createLegacyTypographyVariantDelegator({
    model, paletteColorPropertyName
  }) {
    const delegator = Object.create(model)
    const mapping = this.scrolledSeed.legacyTypographyVariants;

    delegator.get = function(name) {
      const result = model.get(name);

      if (name === 'typographyVariant') {
        return mapping[result] ? mapping[result].variant : result;
      }
      else if (name === paletteColorPropertyName) {
        return mapping[model.get('typographyVariant')]?.paletteColor || result;
      }

      return result;
    };

    delegator.set = function(name, value) {
      if (name === paletteColorPropertyName &&
          mapping[model.get('typographyVariant')]) {
        model.set({
          [paletteColorPropertyName]: value,
          typographyVariant: mapping[model.get('typographyVariant')].variant
        });
      }
      else {
        model.set.apply(this, arguments);
      }
    };

    return delegator;
  },

  getContentElementVariants({contentElement}) {
    const scopeNames = Object.keys(
      this.scrolledSeed.config.theme.options.properties || {}
    );

    const scopeNamePrefix = `${contentElement.get('typeName')}-`;

    const matchingScopeNames = scopeNames.filter(
      name => name.indexOf(scopeNamePrefix) === 0
    );
    const values = matchingScopeNames.map(
      name => name.replace(scopeNamePrefix, '')
    );
    const texts = matchingScopeNames.map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.content_element_variants.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.content_element_variants.${name}`)}
      )
    );

    return [values, texts]
  },

  getPaletteColors() {
    const values = Object.keys(
      this.scrolledSeed.config.theme.options.properties?.root || {}
    ).filter(
      key => key.indexOf('paletteColor') === 0
    ).map(
      key => dasherize(key.replace('paletteColor', ''))
    );

    const texts = values.map(underscore).map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.palette_colors.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.palette_colors.${name}`)}
      )
    );

    return [values, texts];
  },

  supportsSectionWidths() {
    const theme = this.scrolledSeed.config.theme;

    return Object.keys(theme.options.properties?.root || {}).some(key =>
      key.startsWith('narrowSection')
    );
  }
});

function dasherize(text) {
  return (
    text[0] +
    text.slice(1).replace(/[A-Z]/g, match => `-${match}`)
  ).toLowerCase();
}

function underscore(dasherizedWord) {
  return dasherizedWord.replace(/-/g, '_')
}
