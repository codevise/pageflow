import {features} from 'pageflow/frontend';

import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useEditorSelection} from '../EditorState';

export function useStartNewThread(editor) {
  const {contentElementPermaId, inlineComments} = useContentElementAttributes();
  const commentingEnabled = features.isEnabled('commenting') && inlineComments;
  const {select: selectNewThread} = useEditorSelection({
    type: 'newThread',
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId
  });

  if (!commentingEnabled) return null;

  return () => selectNewThread({
    type: 'newThread',
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId,
    range: editor.selection
  });
}
