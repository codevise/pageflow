import Backbone from 'backbone';

import {
  editor,
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying
} from 'pageflow/editor';

export const ContentElement = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: ['position']
    }),
    delayedDestroying,
    entryTypeEditorControllerUrls.forModel({resources: 'content_elements'}),
    failureTracking
  ]
});
