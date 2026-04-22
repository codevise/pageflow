import {provideExtensions} from '../extensions';
import {EntryDecorator} from './EntryDecorator';
import {ContentElementDecorator} from './ContentElementDecorator';
import {EditableText} from './EditableText';

export function loadCommentingComponents() {
  provideExtensions({
    decorators: {
      Entry: EntryDecorator,
      ContentElement: ContentElementDecorator
    },
    alternatives: {
      EditableText
    }
  });
}
