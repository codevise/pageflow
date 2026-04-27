import {useCallback, useEffect, useRef} from 'react';
import {Editor, Node} from 'slate';

// Keeps a Slate `rangeRef` per comment thread alive so that ongoing
// text edits stay reflected in the thread's effective subject range
// without round-tripping through the server. When the upstream value
// is replaced (e.g. after a structural shift applied by the editor),
// `useCachedValue` invokes `resetRangeRefs` from `onReset` so the
// next render falls back to the upstream `subjectRange` and the
// post-render effect repopulates the map against the new content.
export function useCommentRangeRefs(editor, threads) {
  const rangeRefsMap = useRef(new Map());

  const syncRangeRefs = useCallback((threads) => {
    const map = rangeRefsMap.current;
    const currentIds = new Set(threads.map(t => t.id));

    for (const [id, rangeRef] of map) {
      if (!currentIds.has(id)) {
        rangeRef.unref();
        map.delete(id);
      }
    }

    for (const thread of threads) {
      if (!map.has(thread.id) && isValidRange(editor, thread.subjectRange)) {
        map.set(thread.id, Editor.rangeRef(editor, thread.subjectRange, {affinity: 'inward'}));
      }
    }
  }, [editor]);

  useEffect(() => {
    const map = rangeRefsMap.current;
    syncRangeRefs(threads);

    return () => {
      for (const rangeRef of map.values()) {
        rangeRef.unref();
      }
      map.clear();
    };
  }, [threads, syncRangeRefs]);

  const resetRangeRefs = useCallback(() => {
    for (const rangeRef of rangeRefsMap.current.values()) {
      rangeRef.unref();
    }
    rangeRefsMap.current.clear();
  }, []);

  const trackedThreads = threads.map(t => {
    const rangeRef = rangeRefsMap.current.get(t.id);
    return rangeRef?.current ? {...t, subjectRange: rangeRef.current} : t;
  });

  const getTrackedSubjectRanges = useCallback(() => {
    const ranges = {};

    threads.forEach(t => {
      const rangeRef = rangeRefsMap.current.get(t.id);

      if (rangeRef?.current) {
        ranges[t.id] = rangeRef.current;
      }
    });

    return ranges;
  }, [threads]);

  return {trackedThreads, resetRangeRefs, getTrackedSubjectRanges};
}

function isValidRange(editor, range) {
  return range &&
         Node.has(editor, range.anchor.path) &&
         Node.has(editor, range.focus.path);
}
