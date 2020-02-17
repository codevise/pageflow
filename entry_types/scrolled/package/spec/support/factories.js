import {factories as base} from 'pageflow/testHelpers';
import {extend} from 'editor/api';

import {ContentElement} from 'editor/models/ContentElement';

export const factories = {
  ...base,

  contentElement(attributes) {
    return new ContentElement(attributes);
  },

  editorApi() {
    return extend(base.editorApi());
  }
}
