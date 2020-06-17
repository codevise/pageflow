import React from 'react';
import classNames from 'classnames';
import {withShadowClassName, Text} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({configuration, sectionProps}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;

  return (
    <h1 className={classNames(styles.root,
                              {[styles.first]: firstSectionInEntry},
                              {[withShadowClassName]: !sectionProps.invert})}>
      <Text scaleCategory={firstSectionInEntry ? 'h1' : 'h2'} inline={true}>
        {configuration.children}
      </Text>
    </h1>
  );
}
