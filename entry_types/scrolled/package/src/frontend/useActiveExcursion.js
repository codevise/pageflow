import {useCallback, useEffect, useState, useMemo, useRef} from 'react';

export function useActiveExcursion(entryStructure) {
  const [activeExcursionId, setActiveExcursionId] = useState();
  const returnUrlRef = useRef(null);

  useEffect(() => {
    function handleHashChange(event) {
      const hash = window.location.hash.slice(1);
      const excursion = findExcursionByHash(hash);

      if (excursion && !returnUrlRef.current) {
        returnUrlRef.current = event.oldURL;
      }

      setActiveExcursionId(excursion?.id);
    }

    function findExcursionByHash(hash) {
      if (hash.startsWith('section-')) {
        const permaId = parseInt(hash.replace('section-', ''), 10);
        return entryStructure.excursions.find(
          chapter => chapter.sections.find(
            section => section.permaId === permaId
          )
        );
      }

      return entryStructure.excursions.find(
        chapter => chapter.chapterSlug === hash
      );
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [entryStructure]);

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
