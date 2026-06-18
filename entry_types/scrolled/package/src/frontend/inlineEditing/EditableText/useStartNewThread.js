import {features} from 'pageflow/frontend';

import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useContentElementCommentSelection} from '../useCommentSelection';

export function useStartNewThread(editor) {
  const {inlineComments} = useContentElementAttributes();
  const commentingEnabled = features.isEnabled('commenting') && inlineComments;
  const {selectNewThread} = useContentElementCommentSelection();

  if (!commentingEnabled) return null;

  return () => selectNewThread(editor.selection);
}
