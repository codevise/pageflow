import {factories as base} from 'pageflow/testHelpers';
import {normalizeSeed} from 'pageflow-scrolled/testHelpers';
import {extend} from 'editor/api';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {ContentElement} from 'editor/models/ContentElement';

export const factories = {
  ...base,

  contentElement(attributes) {
    return new ContentElement(attributes);
  },

  scrolledEntry(attributes, {seed, ...otherEntryOptions} = {}) {
    return base.entry(
      ScrolledEntry,
      attributes,
      {
        entryTypeSeed: normalizeSeed(seed || {}),
        ...otherEntryOptions
      }
    );
  },

  editorApi() {
    return extend(base.editorApi());
  }
}
