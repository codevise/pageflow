import Backbone from 'backbone';
import {editor} from '../api';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying
} from 'pageflow/editor';

import {ContentElementConfiguration} from './ContentElementConfiguration';

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

  applyDefaultConfiguration(sibling) {
    const defaultConfig = {...this.getType().defaultConfig};
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

  getPosition() {
    return this.configuration.get('position');
  },

  getResolvedPosition() {
    const position = this.getPosition();
    return this.getAvailablePositions().includes(position) ? position : 'inline';
  },

  getAvailablePositions() {
    const layout = this.section.configuration.get('layout');
    const supportedByLayout =
      layout === 'center' || layout === 'centerRagged' ?
      ['inline', 'left', 'right', 'standAlone', 'backdrop'] :
      ['inline', 'sticky', 'standAlone', 'backdrop'];
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
    else if (['sticky', 'left', 'right'].includes(this.getResolvedPosition())) {
      return Math.min(Math.max(width, -2), 2);
    }
    else {
      return width;
    }
  }
});
