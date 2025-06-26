import {Entry, editor} from 'pageflow/editor';
import I18n from 'i18n-js';

import {ConsentVendors} from '../ConsentVendors';

import {
  StorylinesCollection,
  ChaptersCollection,
  SectionsCollection,
  ContentElementsCollection
} from '../../collections';

import {ContentElement} from '../ContentElement';
import {Cutoff} from '../Cutoff';

import {insertContentElement} from './insertContentElement';
import {moveContentElement} from './moveContentElement';
import {deleteContentElement} from './deleteContentElement';

import {sortColors} from './sortColors';

const typographySizeSuffixes = ['xl', 'lg', 'md', 'sm', 'xs'];

const defaultAspectRatios = [{
  name: 'wide',
  ratio: 9 / 16
}, {
  name: 'narrow',
  ratio: 3 / 4
}, {
  name: 'square',
  ratio: 1
}, {
  name: 'portrait',
  ratio: 4 / 3
}];

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.consentVendors = new ConsentVendors({hostMatchers: seed.consentVendorHostMatchers});

    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections,
                                           {contentElements: this.contentElements});
    this.chapters = new ChaptersCollection(seed.collections.chapters,
                                           {sections: this.sections,
                                            entry: this});
    this.chapters.parentModel = this;

    this.storylines = new StorylinesCollection(seed.collections.storylines,
                                               {chapters: this.chapters,
                                                entry: this});

    this.sections.sort();

    this.cutoff = new Cutoff({entry: this});

    editor.failures.watch(this.contentElements);
    editor.failures.watch(this.sections);
    editor.failures.watch(this.chapters);

    editor.savingRecords.watch(this.contentElements);
    editor.savingRecords.watch(this.sections);
    editor.savingRecords.watch(this.chapters);

    this.scrolledSeed = seed;
  },

  insertContentElement(attributes, {id, at, splitPoint}) {
    if (at === 'backdropOfSection') {
      const section = this.sections.get(id)

      const contentElement = this.insertContentElement(
        {
          ...attributes,
          configuration: {
            position: 'backdrop'
          }
        },
        (section.contentElements.length > 0) ?
        {id: section.contentElements.first(), at: 'before'} :
        {id, at: 'endOfSection'}
      );

      contentElement.once('change:id', () => {
        section.configuration.set('backdropContentElement', contentElement.get('permaId'));
      });

      return contentElement;
    }
    else if (at === 'endOfSection') {
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

      return contentElement;
    }
    else {
      return insertContentElement(this,
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
      )
      .filter(
        name => !typographySizeSuffixes.includes(name.split('-').pop())
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

  getTypographySizes({contentElement, prefix}) {
    const typographyRules = this.scrolledSeed.config.theme.options.typography || {};

    const rulePrefix = [
      contentElement.get('typeName'),
      prefix
    ].filter(Boolean).join('-')

    const values = typographySizeSuffixes
      .filter(sizeSuffix =>
        typographyRules[`${rulePrefix}-${sizeSuffix}`] || sizeSuffix === 'md'
      )

    const texts = values.map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.typography_sizes.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.typography_sizes.${name}`)}
      )
    );

    return [values, texts];
  },

  createLegacyTypographyVariantDelegator({
    model, paletteColorPropertyName
  }) {
    const delegator = Object.create(model)
    const mapping = this.scrolledSeed.legacyTypographyVariants || {};

    delegator.get = function(name) {
      const result = model.get(name);

      if (name === 'typographyVariant') {
        return mapping[result] ? mapping[result].variant : result;
      }
      else if (name === 'typographySize') {
        return mapping[model.get('typographyVariant')]?.size || result;
      }
      else if (name === paletteColorPropertyName) {
        return mapping[model.get('typographyVariant')]?.paletteColor || result;
      }

      return result;
    };

    delegator.set = function(name, value) {
      const mappedProperties = mapping[model.get('typographyVariant')];

      if ((name === paletteColorPropertyName || name === 'typographySize') &&
          mappedProperties) {
        const changes = {
          typographyVariant: mapping[model.get('typographyVariant')].variant
        };

        if (!model.has('typographySize')) {
          changes.typographySize = mappedProperties.size;
        }

        if (!model.has(paletteColorPropertyName)) {
          changes[paletteColorPropertyName] = mappedProperties.paletteColor;
        }

        changes[name] = value;

        model.set(changes);
      }
      else {
        model.set.apply(this, arguments);
      }
    };

    return delegator;
  },

  getContentElementVariants({contentElement}) {
    return this.getComponentVariants({
      name: contentElement.get('typeName'),
      translationKeysScope: 'content_element_variants'
    });
  },

  getComponentVariants({name, translationKeysScope = 'component_variants'}) {
    const scopeNames = Object.keys(
      this.scrolledSeed.config.theme.options.properties || {}
    );

    const scopeNamePrefix = `${name}-`;
    const matchingScopeNames = scopeNames.filter(
      name => name.indexOf(scopeNamePrefix) === 0
    );

    const values = matchingScopeNames.map(
      name => name.replace(scopeNamePrefix, '')
    );
    const texts = matchingScopeNames.map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.${translationKeysScope}.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.${translationKeysScope}.${name}`)}
      )
    );

    return [values, texts]
  },

  getPaletteColors({name} = {}) {
    const themeOptions = this.scrolledSeed.config.theme.options

    const values = (
      name ?
      (themeOptions.palettes?.[name] || []) :
      Object.keys(themeOptions.properties?.root || {}).filter(
        key => key.indexOf('paletteColor') === 0
      )
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

  getAspectRatios(options = {}) {
    const sortedValues = this._getDefinedAspectRatios()
      .sort((a, b) => a.ratio - b.ratio)
      .map(({name}) => name);

    if (options.includeOriginal) {
      sortedValues.push('original');
    }

    const texts = sortedValues.map(name =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.aspect_ratios.${name}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.aspect_ratios.${name}`)}
      )
    );

    return [sortedValues, texts];
  },

  getAspectRatio(name) {
    return this._getDefinedAspectRatios()
      .find(aspectRatio => aspectRatio.name === name)?.ratio;
  },

  _getDefinedAspectRatios() {
    const themeOptions = this.scrolledSeed.config.theme.options;
    const root = themeOptions.properties?.root || {};

    const customRatios = Object.entries(root)
                               .filter(([key]) => key.indexOf('aspectRatio') === 0)
                               .map(([key, value]) => ({
                                 name: dasherize(key.replace('aspectRatio', '')),
                                 ratio: parseFloat(value)
                               }));

    return defaultAspectRatios.concat(customRatios);
  },

  getScale(scaleName) {
    const themeOptions = this.scrolledSeed.config.theme.options;
    const root = themeOptions.properties?.root || {};


    const values = Object.keys(root)
                         .filter(name => name.indexOf(`${scaleName}-`) === 0)
                         .map(name => name.split('-').pop());
    const texts = values.map(value =>
      I18n.t(
        `pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` +
        `.scales.${scaleName}.${value}`,
        {defaultValue: I18n.t(`pageflow_scrolled.editor.scales.${scaleName}.${value}`)}
      )
    );

    return [values, texts];
  },

  getUsedSectionBackgroundColors() {
    const colors = new Set();

    this.sections.map(section => {
      if (section.configuration.get('backdropType') === 'color') {
        colors.add(section.configuration.get('backdropColor'));
      }

      if (section.configuration.get('appearance') === 'cards') {
        colors.add(section.configuration.get('cardSurfaceColor'));
      }
    });

    return sortColors([...colors].filter(Boolean));
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
    text.slice(1).replace('_', '-').replace(/[A-Z]/g, match => `-${match}`)
  ).toLowerCase();
}

function underscore(dasherizedWord) {
  return dasherizedWord.replace(/-/g, '_')
}
