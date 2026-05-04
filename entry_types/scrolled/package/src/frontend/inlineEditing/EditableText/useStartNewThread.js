import {features} from 'pageflow/frontend';

import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useEditorSelection} from '../EditorState';

export function useStartNewThread(editor) {
  const {contentElementPermaId, inlineComments} = useContentElementAttributes();
  const commentingEnabled = features.isEnabled('commenting') && inlineComments;
  const {select: selectNewThread} = useEditorSelection({
    type: 'newThread',
    id: contentElementPermaId
  });

  if (!commentingEnabled) return null;

  return () => selectNewThread({
    type: 'newThread',
    id: contentElementPermaId,
    subjectType: 'ContentElement',
    range: editor.selection
  });
}
