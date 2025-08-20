import React, {useState} from 'react';

import {SectionIntersectionObserver} from 'pageflow-scrolled/frontend';

import {CloseButton} from './CloseButton';
import {ReturnButton} from './ReturnButton';

import styles from './ExcursionSheet.module.css';

export function ExcursionSheet({excursion, onClose, children}) {

  const [intersectingSectionInverted, setIntersectingSectionInverted] = useState(false);

  return (
    <>
      <div className={styles.backdrop}
           onClick={onClose} />
      <div key={excursion.id}
           className={styles.container}>
        <CloseButton invert={intersectingSectionInverted}
                     onClick={onClose} />
        <div className={styles.content}>
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
