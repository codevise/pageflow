import Backbone from 'backbone';

import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {TrashItem} from '../models/TrashItem';

export const TrashItemsCollection = Backbone.Collection.extend({
  model: TrashItem,

  mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'trash_items'})],

  initialize(models, {entry} = {}) {
    this.entry = entry;
  }
});
