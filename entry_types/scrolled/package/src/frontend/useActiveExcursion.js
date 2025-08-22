import {useCallback, useEffect, useState, useMemo} from 'react';

export function useActiveExcursion(entryStructure) {
  const [activeExcursionId, setActiveExcursionId] = useState();

  useEffect(() => {
    function handleHashChange(event) {
      const hash = window.location.hash.slice(1);
      const excursion = findExcursionByHash(hash);

      if (excursion && !window.history.state?.excursionReturnHash) {
        window.history.replaceState({excursionReturnHash: '#' + event.oldURL.split('#')[1]}, null);
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
      window.history.replaceState(
        {excursionReturnHash: window.history.state?.excursionReturnHash ||
                              window.location.hash},
        null,
        '#' + excursion.chapterSlug
      );
    }

    setActiveExcursionId(excursion?.id);
  }, [entryStructure]);

  const returnFromExcursion = useCallback(() => {
    setActiveExcursionId(undefined);

    if (window.history.state?.excursionReturnHash) {
      window.history.replaceState(null, null, window.history.state?.excursionReturnHash)
    }
  }, []);

  const activeExcursion = useMemo(() => {
    return entryStructure.excursions.find(excursion => excursion.id === activeExcursionId);
  }, [entryStructure, activeExcursionId])

  return {activeExcursion, activateExcursionOfSection, returnFromExcursion};
}
