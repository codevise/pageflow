import React from 'react';
import {render, act} from '@testing-library/react';

import {ReviewStateProvider} from '../review/ReviewStateProvider';
import {SelectedSubjectProvider} from '../frontend/commenting/SelectedSubjectProvider';
import {AddCommentModeProvider, useAddCommentMode} from '../frontend/commenting/AddCommentModeProvider';
import {ContentElementAttributesProvider} from '../frontend/useContentElementAttributes';

function PassThrough({children}) {
  return children;
}

export function renderWithCommenting(ui, {
  contentElementId = 1,
  contentElementPermaId = 10,
  inlineComments = true,
  commentThreads = [],
  currentUser = null,
  wrapper: OuterWrapper = PassThrough
} = {}) {
  let addCommentModeRef;

  function AddCommentModeCapture({children}) {
    const mode = useAddCommentMode();
    addCommentModeRef = mode;
    return children;
  }

  const result = render(
    <OuterWrapper>
      <ReviewStateProvider initialState={{currentUser, commentThreads}}>
        <SelectedSubjectProvider>
          <AddCommentModeProvider>
            <AddCommentModeCapture>
              <ContentElementAttributesProvider id={contentElementId}
                                                permaId={contentElementPermaId}
                                                inlineComments={inlineComments}>
                {ui}
              </ContentElementAttributesProvider>
            </AddCommentModeCapture>
          </AddCommentModeProvider>
        </SelectedSubjectProvider>
      </ReviewStateProvider>
    </OuterWrapper>
  );

  return {
    ...result,

    toggleAddCommentMode() {
      act(() => addCommentModeRef.toggle());
    }
  };
}
