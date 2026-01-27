import {useCallback, useEffect, useState, useMemo, useRef} from 'react';

export function useActiveExcursion(entryStructure, {scrollToTarget} = {}) {
  const [activeExcursionId, setActiveExcursionId] = useState();
  const [scrollTarget, setScrollTarget] = useState();
  const returnUrlRef = useRef(null);

  useEffect(() => {
    function handleHashChange(event) {
      const hash = window.__ACTIVE_EXCURSION__ || // Used in Storybook
                   window.location.hash.slice(1);
      const {excursion, sectionId} = findScrollTargetByHash(hash);

      if (excursion && event?.oldURL && !returnUrlRef.current) {
        returnUrlRef.current = event.oldURL;
      }

      setActiveExcursionId(prevExcursionId => {
        const excursionChanged = excursion?.id !== prevExcursionId;

        if (excursionChanged && sectionId) {
          setScrollTarget(sectionId);
        }

        return excursion?.id;
      });
    }

    function findScrollTargetByHash(hash) {
      if (hash.startsWith('section-')) {
        const permaId = parseInt(hash.replace('section-', ''), 10);

        for (const chapter of entryStructure.excursions) {
          const section = chapter.sections.find(s => s.permaId === permaId);
          if (section) {
            const isFirstSection = section.id === chapter.sections[0]?.id;
            return {excursion: chapter, sectionId: isFirstSection ? null : section.id};
          }
        }

        for (const chapter of entryStructure.main) {
          const section = chapter.sections.find(s => s.permaId === permaId);
          if (section) {
            return {excursion: null, sectionId: section.id};
          }
        }

        return {excursion: null, sectionId: null};
      }

      const excursion = entryStructure.excursions.find(
        chapter => chapter.chapterSlug === hash
      );
      if (excursion) {
        return {excursion, sectionId: null};
      }

      const mainChapter = entryStructure.main.find(
        chapter => chapter.chapterSlug === hash
      );
      if (mainChapter) {
        return {excursion: null, sectionId: mainChapter.sections[0]?.id};
      }

      return {excursion: null, sectionId: null};
    }

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [entryStructure]);

  useEffect(() => {
    if (!scrollTarget) {
      return;
    }

    setTimeout(() => {
      scrollToTarget({id: scrollTarget});
    }, 500);

    setScrollTarget(null);
  }, [scrollTarget, scrollToTarget]);

  const activateExcursionOfSection = useCallback(({id}) => {
    const excursion = entryStructure.excursions.find(
      chapter => chapter.sections.find(
        section => section.id === id
      )
    );

    if (excursion) {
      returnUrlRef.current = returnUrlRef.current || window.location.href;
      window.history.replaceState(null, null, '#' + excursion.chapterSlug);
    }

    setActiveExcursionId(excursion?.id);
  }, [entryStructure]);

  const returnFromExcursion = useCallback(() => {
    setActiveExcursionId(undefined);

    if (returnUrlRef.current) {
      window.history.replaceState(null, null, returnUrlRef.current);
      returnUrlRef.current = null;
    }
  }, []);

  const activeExcursion = useMemo(() => {
    return entryStructure.excursions.find(excursion => excursion.id === activeExcursionId);
  }, [entryStructure, activeExcursionId])

  return {activeExcursion, activateExcursionOfSection, returnFromExcursion};
}
