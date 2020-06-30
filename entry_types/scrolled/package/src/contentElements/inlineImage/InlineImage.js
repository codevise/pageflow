import React from 'react';
import classNames from 'classnames';

import {
  Image,
  Figure,
  ViewportDependentPillarBoxes,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

import styles from './InlineImage.module.css';

export function InlineImage({configuration}) {
  const {isPrepared} = useContentElementLifecycle();

  return (
    <div className={classNames(styles.root, {[styles.box]: configuration.position !== 'full'})}>
      <Figure caption={configuration.caption}>
        <ViewportDependentPillarBoxes aspectRatio={0.75}
                                      position={configuration.position}>
          <div className={styles.spacer}>
            <div className={styles.inner}>
              <Image {...configuration}
                     isPrepared={isPrepared}
                     variant={configuration.position === 'full' ?  'large' : 'medium'} />
            </div>
          </div>
        </ViewportDependentPillarBoxes>
      </Figure>
    </div>
  )
}
