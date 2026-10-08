import Backbone from 'backbone';

import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {Fragment, fragmentsOfLibrary} from '../models/Fragment';

export const FragmentLibrariesCollection = Backbone.Collection.extend({
  mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'fragment_libraries'})],

  sharedFragments() {
    const library = this.first();

    return new Backbone.Collection(library ? fragmentsOfLibrary(library) : [],
                                   {model: Fragment});
  }
});
