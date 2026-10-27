import Backbone from 'backbone';

import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {Fragment, fragmentsOfLibrary} from '../models/Fragment';

export const FragmentLibrariesCollection = Backbone.Collection.extend({
  mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'fragment_libraries'})],

  sharedFragments({kind} = {}) {
    const library = this.first();
    const fragments = library ? fragmentsOfLibrary(library) : [];

    return new Backbone.Collection(
      kind ? fragments.filter(fragment => fragment.kind === kind) : fragments,
      {model: Fragment}
    );
  }
});
