import Backbone from 'backbone';

import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {LinkableEntry} from '../models/LinkableEntry';

export const LinkableEntriesCollection = Backbone.Collection.extend({
  model: LinkableEntry,

  mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'linkable_entries'})]
});
