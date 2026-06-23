import '../../contentElements/review';

import {EntryDecorator} from './EntryDecorator';
import {SectionDecorator} from './SectionDecorator';
import {ContentElementDecorator} from './ContentElementDecorator';
import {EditableText} from './EditableText';

export const extensions = {
  decorators: {
    Entry: EntryDecorator,
    Section: SectionDecorator,
    ContentElement: ContentElementDecorator
  },
  alternatives: {
    EditableText
  }
};
