import React from 'react';

import {FloatingAnchor} from './FloatingAnchor';
import {Popover} from './Popover';

import styles from './ContentElementDecorator.module.css';

export function ContentElementDecorator({permaId, children}) {
  return (
    <div className={styles.wrapper}>
      {children}
      <FloatingAnchor>
        {({placement}) => (
          <Popover subjectType="ContentElement"
                   subjectId={permaId}
                   placement={placement} />
        )}
      </FloatingAnchor>
    </div>
  );
}
