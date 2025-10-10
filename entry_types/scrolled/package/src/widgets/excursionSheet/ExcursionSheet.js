import React, {useState, useRef, useEffect} from 'react';

import {SectionIntersectionObserver, useOnScreen} from 'pageflow-scrolled/frontend';

import {CloseButton} from './CloseButton';
import {ReturnButton} from './ReturnButton';

import styles from './ExcursionSheet.module.css';

export function ExcursionSheet({excursion, onClose, setIsCoveringBackground, children}) {
  const contentRef = useRef();
  const [intersectingSectionInverted, setIntersectingSectionInverted] = useState(false);

  useCoversScreen(contentRef, setIsCoveringBackground);

  return (
    <>
      <div className={styles.backdrop}
           onClick={onClose} />
      <div key={excursion.id}
           className={styles.container}>
        <CloseButton invert={intersectingSectionInverted}
                     onClick={onClose} />
        <div ref={contentRef} className={styles.content}>
          <SectionIntersectionObserver
            sections={excursion.sections}
            probeClassName={styles.probe}
            onChange={section => setIntersectingSectionInverted(section?.invert)}>
            {children}
          </SectionIntersectionObserver>
        </div>
        <ReturnButton label={excursion.returnButtonLabel}
                      onClose={onClose} />
      </div>
    </>
  );
}

function useCoversScreen(ref, onChange) {
  const intersectsTopRef = useRef(false);
  const intersectsBottomRef = useRef(false);

  const updateCoverage = () => {
    const isCovering = intersectsTopRef.current && intersectsBottomRef.current;
    onChange(isCovering);
  };

  const handleTopEdgeIntersection = (intersecting) => {
    intersectsTopRef.current = intersecting;
    updateCoverage();
  };

  const handleBottomEdgeIntersection = (intersecting) => {
    intersectsBottomRef.current = intersecting;
    updateCoverage();
  };

  useOnScreen(ref, {
    rootMargin: '0px 0px -100% 0px',
    onChange: handleTopEdgeIntersection
  });

  useOnScreen(ref, {
    rootMargin: '-100% 0px 0px 0px',
    onChange: handleBottomEdgeIntersection
  });

  useEffect(() => {
    return () => onChange(false);
  }, [onChange]);
}
