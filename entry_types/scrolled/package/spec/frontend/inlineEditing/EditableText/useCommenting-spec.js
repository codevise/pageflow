import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {createEditor, Transforms} from 'slate';
import {withReact} from 'slate-react';

import {features} from 'pageflow/frontend';
import {ReviewStateProvider} from 'pageflow-scrolled/review';
import {ContentElementAttributesProvider} from 'frontend/useContentElementAttributes';
import {EditorStateProvider} from 'frontend/inlineEditing/EditorState';

import {useCommenting} from 'frontend/inlineEditing/EditableText/useCommenting';

describe('useCommenting', () => {
  beforeEach(() => {
    jest.spyOn(features, 'isEnabled').mockImplementation(
      name => name === 'commenting'
    );
  });

  afterEach(() => {
    features.isEnabled.mockRestore();
  });

  function setup({commentThreads}) {
    const editor = withReact(createEditor());
    editor.children = [
      {type: 'paragraph', children: [{text: 'Hello world'}]}
    ];

    const wrapper = ({children}) => (
      <ReviewStateProvider initialState={{currentUser: null, commentThreads}}>
        <EditorStateProvider>
          <ContentElementAttributesProvider id={1} permaId={10} inlineComments>
            {children}
          </ContentElementAttributesProvider>
        </EditorStateProvider>
      </ReviewStateProvider>
    );

    const {result} = renderHook(() => useCommenting(editor), {wrapper});

    return {editor, result};
  }

  it('tracks both resolved and unresolved thread ranges across edits', () => {
    // Thread 7 is resolved: it must be tracked just like the unresolved
    // thread 1 so its range stays correct once the thread is reopened.
    const {editor, result} = setup({
      commentThreads: [
        {
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange: {anchor: {path: [0, 0], offset: 2},
                         focus: {path: [0, 0], offset: 5}},
          comments: []
        },
        {
          id: 7,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange: {anchor: {path: [0, 0], offset: 6},
                         focus: {path: [0, 0], offset: 11}},
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: []
        }
      ]
    });

    act(() => {
      Transforms.insertText(editor, 'X', {at: {path: [0, 0], offset: 0}});
    });

    expect(result.current.getTrackedSubjectRanges()).toEqual({
      1: {anchor: {path: [0, 0], offset: 3},
          focus: {path: [0, 0], offset: 6}},
      7: {anchor: {path: [0, 0], offset: 7},
          focus: {path: [0, 0], offset: 12}}
    });
  });
});
