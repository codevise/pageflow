import React from 'react';
import classNames from 'classnames';

import useDimension from './../../useDimension';
import {useSectionLifecycle} from './../../useSectionLifecycle';

import {BackgroundAsset} from './BackgroundAsset';

import styles from '../../Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();
  const {shouldLoad} = useSectionLifecycle();

  return (
    <div className={classNames(styles.Backdrop,
                               {[styles.noCompositionLayer]: !shouldLoad && !props.eagerLoad},
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`])}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={classNames(styles.defaultBackground,
                                   props.transitionStyles.backdropInner2)}>
          {props.children(
            <BackgroundAsset {...props}
                             containerDimension={containerDimension}
                             setContainerRef={setContainerRef} />
          )}
        </div>
      </div>
    </div>
  );
}

Backdrop.defaultProps = {
  children: children => children,
  transitionStyles: {}
};
