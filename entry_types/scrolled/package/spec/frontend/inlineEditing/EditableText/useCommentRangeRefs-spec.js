import {renderHook, act} from '@testing-library/react-hooks';
import {createEditor, Transforms} from 'slate';
import {withReact} from 'slate-react';

import {useCommentRangeRefs} from 'frontend/inlineEditing/EditableText/useCommentRangeRefs';

describe('useCommentRangeRefs', () => {
  function setup(threads) {
    const editor = withReact(createEditor());
    editor.children = [
      {type: 'paragraph', children: [{text: 'Hello world'}]}
    ];

    const {result, rerender} = renderHook(
      ({threads}) => useCommentRangeRefs(editor, threads),
      {initialProps: {threads}}
    );

    return {editor, result, rerender};
  }

  describe('getTrackedSubjectRanges', () => {
    it('returns current range for each tracked thread right after mount', () => {
      const range = {
        anchor: {path: [0, 0], offset: 2},
        focus: {path: [0, 0], offset: 5}
      };
      const threads = [{id: 1, subjectRange: range}];

      const {result} = setup(threads);

      expect(result.current.getTrackedSubjectRanges()).toEqual({1: range});
    });

    it('returns shifted range for threads whose range moved after a Slate insert', () => {
      const threads = [{
        id: 1,
        subjectRange: {
          anchor: {path: [0, 0], offset: 2},
          focus: {path: [0, 0], offset: 5}
        }
      }];

      const {editor, result} = setup(threads);

      act(() => {
        Transforms.insertText(editor, 'x', {
          at: {path: [0, 0], offset: 0}
        });
      });

      expect(result.current.getTrackedSubjectRanges()).toEqual({
        1: {
          anchor: {path: [0, 0], offset: 3},
          focus: {path: [0, 0], offset: 6}
        }
      });
    });

    it('includes all tracked threads regardless of whether their range moved', () => {
      const unchangedRange = {anchor: {path: [0, 0], offset: 0},
                               focus: {path: [0, 0], offset: 2}};
      const threads = [
        {id: 1, subjectRange: unchangedRange},
        {id: 2,
         subjectRange: {anchor: {path: [0, 0], offset: 5},
                        focus: {path: [0, 0], offset: 8}}}
      ];

      const {editor, result} = setup(threads);

      act(() => {
        Transforms.insertText(editor, 'x', {
          at: {path: [0, 0], offset: 3}
        });
      });

      const tracked = result.current.getTrackedSubjectRanges();
      expect(tracked[1]).toEqual(unchangedRange);
      expect(tracked[2]).toEqual({
        anchor: {path: [0, 0], offset: 6},
        focus: {path: [0, 0], offset: 9}
      });
    });
  });

  describe('trackedThreads', () => {
    it('reflects upstream subjectRange after resetRangeRefs is called', () => {
      const editor = withReact(createEditor());
      editor.children = [
        {type: 'paragraph', children: [{text: 'first paragraph'}]},
        {type: 'paragraph', children: [{text: 'second paragraph'}]}
      ];

      const initialThreads = [{
        id: 1,
        subjectRange: {anchor: {path: [1, 0], offset: 0},
                       focus: {path: [1, 0], offset: 6}}
      }];

      const {result, rerender} = renderHook(
        ({threads}) => useCommentRangeRefs(editor, threads),
        {initialProps: {threads: initialThreads}}
      );

      // The element is split: surviving content keeps only the second
      // paragraph (now at index 0). The thread's subjectRange is
      // updated externally via session.applyThreadUpdates to reflect
      // the shifted block path. `resetRangeRefs` is what
      // `useCachedValue.onReset` would call when the new value
      // arrives.
      act(() => {
        editor.children = [
          {type: 'paragraph', children: [{text: 'second paragraph'}]}
        ];
        result.current.resetRangeRefs();
      });

      const updatedThreads = [{
        id: 1,
        subjectRange: {anchor: {path: [0, 0], offset: 0},
                       focus: {path: [0, 0], offset: 6}}
      }];

      rerender({threads: updatedThreads});

      expect(result.current.trackedThreads[0].subjectRange).toEqual({
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [0, 0], offset: 6}
      });
    });
  });
});
