import Backbone from 'backbone';
import {editor} from 'pageflow-scrolled/editor';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying
} from 'pageflow/editor';

export const ContentElement = Backbone.Model.extend({
  paramRoot: 'content_element',

  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: ['position', 'typeName']
    }),
    delayedDestroying,
    entryTypeEditorControllerUrls.forModel({resources: 'content_elements'}),
    failureTracking
  ],

  getType(contentElement) {
    return editor.contentElementTypes.findByTypeName(this.get('typeName'));
  },

  applyDefaultConfiguration(sibling) {
    this.configuration.set({
      ...this.getType().defaultConfig,
      position: getDefaultPosition(sibling)
    });
  }
});

export function getDefaultPosition(sibling) {
  const position = sibling.configuration.get('position');

  if (position === 'full') {
    return 'inline';
  }

  return position;
}
