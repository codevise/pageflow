import {useCallback, useEffect, useRef} from 'react';
import {Editor, Node} from 'slate';

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
    syncRangeRefs(threads);
  }, [threads, syncRangeRefs]);

  const trackedThreads = threads.map(t => {
    const ref = rangeRefsMap.current.get(t.id);
    return ref?.current ? {...t, subjectRange: ref.current} : t;
  });

  const getTrackedSubjectRanges = useCallback(() => {
    const ranges = {};

    threads.forEach(t => {
      const ref = rangeRefsMap.current.get(t.id);

      if (ref?.current) {
        ranges[t.id] = ref.current;
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
