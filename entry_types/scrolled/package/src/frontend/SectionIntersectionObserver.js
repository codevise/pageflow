import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';

import classNames from 'classnames';

import styles from './SectionIntersectionObserver.module.css';

const SectionIntersectionObserverContext = createContext([]);

export function SectionIntersectionObserver({sections, probeClassName, onChange, children}) {
  const sectionsByIdRef = useRef();
  const callbackRef = useRef();

  const observerRef = useRef();
  const probesRef = useRef({});

  useEffect(() => {
    sectionsByIdRef.current = sections.reduce((result, section) => {
      result[section.id] = section;
      return result;
    }, {});
  }, [sections]);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const sectionsById = sectionsByIdRef.current;
    const callback = callbackRef.current;

    let visibleSection = null;

    const observer = observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const section = sectionsById[entry.target.dataset.id];
          if (entry.isIntersecting) {
            visibleSection = section;
            callback(visibleSection);
          }
          else if (visibleSection === section) {
            visibleSection = null;
            callback(visibleSection);
          }
        });
      },
      {
        rootMargin: '0px 0px -100% 0px'
      }
    );

    Object.values(probesRef.current).forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const setProbeRef = useCallback(id => el => {
    if (observerRef.current) {
      if (el) {
        observerRef.current.observe(el);
      }
      else {
        observerRef.current.unobserve(probesRef.current[id]);
      }
    }

    if (el) {
      probesRef.current[id] = el;
    }
    else {
      delete probesRef.current[id];
    }
  }, []);

  const previousContextValue = useContext(SectionIntersectionObserverContext);

  const contextValue = useMemo(() => [...previousContextValue, {setProbeRef, probeClassName}],
                               [previousContextValue, setProbeRef, probeClassName]);

  return (
    <SectionIntersectionObserverContext.Provider value={contextValue}>
      {children}
    </SectionIntersectionObserverContext.Provider>
  );
}

export
function SectionIntersectionProbe({section}) {
  const value = useContext(SectionIntersectionObserverContext);

  return value.map(({setProbeRef, probeClassName}, index) =>
    <div ref={setProbeRef(section.id)}
         key={index}
         className={classNames(styles.probe, probeClassName)}
         data-id={section.id} />
  );
}
