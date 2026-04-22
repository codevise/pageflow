import {useMemo} from 'react';
import {Text as SlateText, Range, Point, Node} from 'slate';

const emptyDecorations = [];

export function useCommentHighlights(threads, subjectRange) {
  return useMemo(
    () => buildHighlights(threads, subjectRange),
    [threads, subjectRange]
  );
}

export function decorateCommentHighlights(editor, highlights) {
  return function decorate([node, path]) {
    if (!SlateText.isText(node)) return emptyDecorations;

    const nodeRange = {
      anchor: {path, offset: 0},
      focus: {path, offset: node.text.length}
    };

    const decorations = [];

    for (const highlight of highlights) {
      if (!isValidRange(editor, highlight.range)) continue;

      const intersection = Range.intersection(highlight.range, nodeRange);

      if (intersection) {
        const isFirst = Point.equals(
          Range.start(intersection),
          Range.start(highlight.range)
        );

        decorations.push({
          ...intersection,
          commentHighlight: true,
          subjectRange: highlight.range,
          rangeKey: highlight.key,
          ...(isFirst && {firstInRange: true})
        });
      }
    }

    return decorations;
  };
}

function buildHighlights(threads, subjectRange) {
  const highlights = threads.map(t => ({
    key: String(t.id),
    range: t.subjectRange,
    thread: t
  }));

  if (subjectRange && !threads.some(t => t.subjectRange === subjectRange)) {
    highlights.push({key: 'selection', range: subjectRange});
  }

  return highlights;
}

function isValidRange(editor, range) {
  return range &&
         Node.has(editor, range.anchor.path) &&
         Node.has(editor, range.focus.path);
}
