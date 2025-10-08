import {useEffect, useRef, useCallback} from 'react';

export function useChapterSlugUpdater() {
  const windowLoadedRef = useRef(false);

  useWindowLoadTracking(windowLoadedRef)

  const updateChapterSlug = useCallback((section) => {
    if (!windowLoadedRef.current) {
      return;
    }

    if (section.sectionIndex > 0) {
      window.history.replaceState(null, null, '#'+ section.chapter.chapterSlug);
    }
    else {
      window.history.replaceState(null, null, window.location.href.split('#')[0]);
    }
  }, []);

  const updateExcursionChapterSlug = useCallback((section) => {
    if (!windowLoadedRef.current) {
      return;
    }

    window.history.replaceState(null, null, '#'+ section.chapter.chapterSlug);
  }, []);

  return {updateChapterSlug, updateExcursionChapterSlug};
}

function useWindowLoadTracking(windowLoadedRef) {
  useEffect(() => {
    if (document.readyState === 'complete') {
      windowLoadedRef.current = true;
      return;
    }

    const handleLoad = () => {
      windowLoadedRef.current = true;
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [windowLoadedRef]);
}
