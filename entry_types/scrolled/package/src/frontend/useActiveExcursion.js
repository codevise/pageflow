import React, {createContext, useCallback, useContext, useEffect, useState, useMemo, useRef} from 'react';

import {useEntryStructure} from 'pageflow-scrolled/entryState';
import {useScrollToTarget} from './useScrollTarget';

const ActiveExcursionContext = createContext({
  activeExcursion: undefined,
  activateExcursionOfSection: () => {},
  followHashLink: () => {},
  returnFromExcursion: () => {}
});

export function ActiveExcursionProvider({children}) {
  const entryStructure = useEntryStructure();
  const scrollToTarget = useScrollToTarget();

  const [activeExcursionId, setActiveExcursionId] = useState();
  const [scrollTarget, setScrollTarget] = useState();
  const returnUrlRef = useRef(null);

  const navigateToHash = useCallback((hash, oldURL) => {
    const {excursion, sectionId} = findScrollTargetByHash(entryStructure, hash);

    if (excursion && oldURL && !returnUrlRef.current) {
      returnUrlRef.current = oldURL;
    }

    setActiveExcursionId(prevExcursionId => {
      const excursionChanged = excursion?.id !== prevExcursionId;

      if (excursionChanged && sectionId) {
        setScrollTarget(sectionId);
      }

      return excursion?.id;
    });
  }, [entryStructure]);

  useEffect(() => {
    function handleHashChange(event) {
      const hash = window.__ACTIVE_EXCURSION__ || // Used in Storybook
                   window.location.hash.slice(1);

      navigateToHash(hash, event?.oldURL);
    }

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateToHash]);

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

  // Without preventing native fragment navigation, Safari scrolls after
  // the excursion has reset the scroll position, leaving it scrolled to
  // its end.
  const followHashLink = useCallback((event, hash) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const {excursion} = findScrollTargetByHash(entryStructure, hash);

    if (!excursion && !activeExcursionId) {
      return;
    }

    event.preventDefault();

    const oldURL = window.location.href;
    window.history.pushState(null, null, '#' + hash);
    navigateToHash(hash, oldURL);
  }, [entryStructure, activeExcursionId, navigateToHash]);

  const returnFromExcursion = useCallback(() => {
    setActiveExcursionId(undefined);

    if (returnUrlRef.current) {
      window.history.replaceState(null, null, returnUrlRef.current);
      returnUrlRef.current = null;
    }
  }, []);

  const activeExcursion = useMemo(() => {
    return entryStructure.excursions.find(excursion => excursion.id === activeExcursionId);
  }, [entryStructure, activeExcursionId]);

  const value = useMemo(
    () => ({activeExcursion, activateExcursionOfSection, followHashLink, returnFromExcursion}),
    [activeExcursion, activateExcursionOfSection, followHashLink, returnFromExcursion]
  );

  return (
    <ActiveExcursionContext.Provider value={value}>
      {children}
    </ActiveExcursionContext.Provider>
  );
}

export function useActiveExcursion() {
  return useContext(ActiveExcursionContext);
}

function findScrollTargetByHash(entryStructure, hash) {
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
