import React, {useContext} from 'react';
import classNames from 'classnames';

import styles from '../MotifArea.module.css';
import v2Styles from './MotifArea.module.css';

import {MotifAreaVisibilityContext} from '../MotifAreaVisibilityProvider';

export const MotifArea = function MotifArea(props) {
  const visible = useContext(MotifAreaVisibilityContext);

  return (
    <div ref={props.onUpdate}
         className={classNames(styles.root,
                               v2Styles.root,
                               {[styles.visible]: visible})} />
  );
};
