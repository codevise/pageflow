import {provideExtensions} from '../extensions';
import {EntryDecorator} from './EntryDecorator';

export function loadCommentingComponents() {
  provideExtensions({
    decorators: {
      Entry: EntryDecorator
    }
  });
}
