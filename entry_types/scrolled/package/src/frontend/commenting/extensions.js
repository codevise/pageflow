import {EntryDecorator} from './EntryDecorator';
import {ContentElementDecorator} from './ContentElementDecorator';
import {EditableText} from './EditableText';

export const extensions = {
  decorators: {
    Entry: EntryDecorator,
    ContentElement: ContentElementDecorator
  },
  alternatives: {
    EditableText
  }
};
