import Backbone from 'backbone';
import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {ContentElement} from '../models/ContentElement';

export const ContentElementsCollection = Backbone.Collection.extend({
  model: ContentElement,

  mixins: [
    entryTypeEditorControllerUrls.forCollection({resources: 'content_elements'})
  ],

  comparator: 'position'
});
