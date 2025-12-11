import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import classNames from 'classnames';

import styles from './SectionIntersectionObserver.module.css';

const SectionIntersectionObserverContext = createContext([]);

export function SectionIntersectionObserver({sections, probeClassName, onChange, children}) {
  const sectionsByIdRef = useRef();
  const callbackRef = useRef();
  const [observer, setObserver] = useState(null);

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
    let visibleSection = null;

    const newObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const section = sectionsByIdRef.current[entry.target.dataset.id];
          if (entry.isIntersecting) {
            visibleSection = section;
            callbackRef.current(visibleSection);
          }
          else if (visibleSection === section) {
            visibleSection = null;
            callbackRef.current(visibleSection);
          }
        });
      },
      {
        rootMargin: '0px 0px -100% 0px'
      }
    );

    setObserver(newObserver);

    return () => newObserver.disconnect();
  }, [sections]);

  const previousContextValue = useContext(SectionIntersectionObserverContext);

  const contextValue = useMemo(() => [...previousContextValue, {observer, probeClassName}],
                               [previousContextValue, observer, probeClassName]);

  return (
    <SectionIntersectionObserverContext.Provider value={contextValue}>
      {children}
    </SectionIntersectionObserverContext.Provider>
  );
}

export function SectionIntersectionProbe({section}) {
  const observers = useContext(SectionIntersectionObserverContext);
  const probeRefs = useRef([]);

  useEffect(() => {
    const elements = probeRefs.current.slice();

    observers.forEach(({observer}, index) => {
      if (observer && elements[index]) {
        observer.observe(elements[index]);
      }
    });

    return () => {
      observers.forEach(({observer}, index) => {
        if (observer && elements[index]) {
          observer.unobserve(elements[index]);
        }
      });
    };
  }, [observers]);

  return observers.map(({probeClassName}, index) =>
    <div ref={el => probeRefs.current[index] = el}
         key={index}
         className={classNames(styles.probe, probeClassName)}
         data-id={section.id} />
  );
}
