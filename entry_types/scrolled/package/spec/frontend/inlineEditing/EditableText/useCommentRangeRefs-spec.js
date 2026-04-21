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
});
