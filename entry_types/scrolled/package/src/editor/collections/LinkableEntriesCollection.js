import Backbone from 'backbone';

import {entryTypeEditorControllerUrls} from 'pageflow/editor';

export const LinkableEntriesCollection = Backbone.Collection.extend({
  mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'linkable_entries'})]
});
