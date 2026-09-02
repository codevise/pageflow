import Backbone from 'backbone';
import I18n from 'i18n-js';

import {editor} from '../api';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying
} from 'pageflow/editor';

import {features} from 'pageflow/frontend';
import {ContentElementConfiguration} from './ContentElementConfiguration';
import {configurationPlace} from './configurationPlace';

const widths = {
  xxs: -3,
  xs: -2,
  s: -1,
  md: 0,
  l: 1,
  xl: 2,
  full: 3
};

export const ContentElement = Backbone.Model.extend({
  paramRoot: 'content_element',

  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: ['position', 'typeName'],
      configurationModel: ContentElementConfiguration
    }),
    delayedDestroying,
    entryTypeEditorControllerUrls.forModel({resources: 'content_elements'}),
    failureTracking
  ],

  initialize() {
    this.transientState = new Backbone.Model(this.get('transientState'));

    this.listenTo(this, 'change:transientState', () =>
      this.transientState.set(this.get('transientState'), {skipCommand: true})
    );

    this.listenTo(this.transientState, 'change', (model, {skipCommand}) => {
      if (!skipCommand) {
        this.postCommand({
          type: 'TRANSIENT_STATE_UPDATE',
          payload: model.changed
        });
      }
    });
  },

  getType(contentElement) {
    return editor.contentElementTypes.findByTypeName(this.get('typeName'));
  },

  postCommand(command) {
    this.trigger('postCommand', this.id, command);
  },

  getAdjacentContentElements() {
    const section = this.section;
    const index = section.contentElements.indexOf(this);

    return [
      section.contentElements.at(index - 1),
      section.contentElements.at(index + 1)
    ];
  },

  applyDefaultConfiguration({entry, sibling}) {
    const defaultConfig = {
      ...this.getType().defaultConfig,
      ...this.getDefaultsFromEntryMetadata(entry)
    };
    const defaultPosition = sibling?.getPosition();
    const supportedPositions = this.getType().supportedPositions || [];

    if (this.configuration.has('position')) {
      delete defaultConfig.position;
    }
    else if (defaultPosition &&
             defaultPosition !== 'inline' &&
             supportedPositions.includes(defaultPosition)) {
      defaultConfig.position = defaultPosition;
    }

    this.configuration.set(defaultConfig);
  },

  getDefaultsFromEntryMetadata(entry) {
    const defaults = {};

    Object.entries(this.getEntryMetadataDefaultsMapping()).forEach(([metadataKey, propertyName]) => {
      const value = entry.metadata.configuration.get(metadataKey);

      if (value !== undefined) {
        defaults[propertyName] = value;
      }
    });

    return defaults;
  },

  getEntryMetadataDefaultsMapping() {
    const mapping = {
      ...editor.contentElementTypes.getDefaultsInputsMapping(this.get('typeName'))
    };

    if (this.supportsFullWidthInPhoneLayout()) {
      mapping.defaultContentElementFullWidthInPhoneLayout = 'fullWidthInPhoneLayout';
    }

    if (this.supportsCaption()) {
      mapping.defaultCaptionVariant = 'captionVariant';
    }

    return mapping;
  },

  getPosition() {
    return this.configuration.get('position');
  },

  getResolvedPosition() {
    const position = this.getPosition();
    return this.getAvailablePositions().includes(position) ? position : 'inline';
  },

  getAvailablePositions() {
    const layout = this.section.configuration.get('layout');
    const backdrop = features.isEnabled('backdrop_content_elements') ? 'backdrop' : null;
    const supportedByLayout =
      layout === 'center' || layout === 'centerRagged' ?
      ['inline', 'left', 'right', 'standAlone', backdrop] :
      ['inline', 'side', 'sticky', 'standAlone', backdrop];
    const supportedByType = this.getType().supportedPositions;

    if (supportedByType) {
      return supportedByLayout.filter(position => supportedByType.includes(position));
    }
    else {
      return supportedByLayout;
    }
  },

  getWidth() {
    return this.clampWidthByPosition(this.configuration.get('width') || 0);
  },

  getAvailableMinWidth() {
    return this.clampWidthByPosition(
      widths[this.getType().supportedWidthRange?.[0] || 'md']
    );
  },

  getAvailableMaxWidth() {
    return this.clampWidthByPosition(
      widths[this.getType().supportedWidthRange?.[1] || 'md']
    );
  },

  clampWidthByPosition(width) {
    if (this.getPosition() === 'backdrop') {
      return 0;
    }
    else if (['sticky', 'side', 'left', 'right'].includes(this.getResolvedPosition())) {
      return Math.min(Math.max(width, -2), 2);
    }
    else {
      return width;
    }
  },

  supportsFullWidthInPhoneLayout() {
    return !this.getType().customMargin &&
           this.getType().supportedWidthRange?.[1] === 'full';
  },

  supportsCaption() {
    return !!this.getType().supportedCaptions;
  },

  getEditorPath() {
    return this.getType().editorPath?.call(null, this) ||
           `/scrolled/content_elements/${this.id}`;
  },

  getConfigurationPlace(path) {
    const typeName = this.get('typeName');
    const described = editor.contentElementTypes.findConfigurationPlace(this, path);
    const select = described?.select || (() => this.select());

    return configurationPlace({
      chapter: this.section.chapter,
      subject: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`),
      detail: described?.label || attributeLabel(typeName, path),
      pictogram: editor.contentElementTypes.findPictogram(typeName),
      select: () => {
        select();
        this.scrollIntoView({align: 'center'});
      }
    });
  },

  select(options) {
    this.section.chapter.entry.trigger('selectContentElement',
                                       this,
                                       {navigate: true, ...options});
  },

  scrollIntoView(options) {
    this.section.chapter.entry.trigger('scrollToContentElement', this, options);
  }
});

function attributeLabel(typeName, path) {
  if (path.length > 1) {
    return undefined;
  }

  return I18n.lookup(`${path[0]}.label`, {
    scope: `pageflow_scrolled.editor.content_elements.${typeName}.attributes`
  });
}
