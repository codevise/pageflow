import React from 'react';
import classNames from 'classnames';
import {withShadowClassName} from 'pageflow-scrolled/frontend';

import {Text} from 'pageflow-scrolled/frontend';

import styles from './Heading.module.css';

export function Heading({sectionProps, configuration}) {
  return (
    <h1 className={classNames(styles.root,
                              {[styles.first]: configuration.first},
                              {[withShadowClassName]: !sectionProps.invert})}>
      <Text scaleCategory={configuration.first ? 'h1' : 'h2'} inline={true}>
        {configuration.children}
      </Text>
    </h1>
  );
}
