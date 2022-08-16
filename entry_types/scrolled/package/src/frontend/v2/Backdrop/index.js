import React from 'react';
import classNames from 'classnames';

import {BackgroundAsset} from './BackgroundAsset';

import styles from '../../Backdrop.module.css';

export function Backdrop(props) {
  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`])}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={classNames(styles.defaultBackground,
                                   props.transitionStyles.backdropInner2)}>
          {props.children(
            <BackgroundAsset {...props} />
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
