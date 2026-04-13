import {provideExtensions} from '../extensions';
import {EntryDecorator} from './EntryDecorator';
import {ContentElementDecorator} from './ContentElementDecorator';

export function loadCommentingComponents() {
  provideExtensions({
    decorators: {
      Entry: EntryDecorator,
      ContentElement: ContentElementDecorator
    }
  });
}
