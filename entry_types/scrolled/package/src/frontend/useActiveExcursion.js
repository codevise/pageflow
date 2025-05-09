import {useCallback, useEffect, useState, useMemo} from 'react';

export function useActiveExcursion(entryStructure) {
  const [activeExcursionId, setActiveExcursionId] = useState();

  useEffect(() => {
    function handleHashChange(event) {
      const slug = window.location.hash.slice(1);
      const excursion = entryStructure.excursions.find(
        chapter => chapter.chapterSlug === slug
      );

      if (excursion && !window.history.state?.excursionReturnHash) {
        window.history.replaceState({excursionReturnHash: '#' + event.oldURL.split('#')[1]}, null);
      }

      setActiveExcursionId(excursion?.id);
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
