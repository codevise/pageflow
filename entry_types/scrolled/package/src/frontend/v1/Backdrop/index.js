import React from 'react';
import classNames from 'classnames';

import {withInlineEditingDecorator} from '../../inlineEditing';
import useDimension from './../../useDimension';
import {useSectionLifecycle} from './../../useSectionLifecycle';

import {BackgroundAsset} from './BackgroundAsset';

import styles from '../../Backdrop.module.css';
import sharedTransitionStyles from '../../transitions/shared.module.css';

export const Backdrop = withInlineEditingDecorator('BackdropDecorator', function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();
  const {shouldLoad} = useSectionLifecycle();

  return (
    <div className={classNames(styles.Backdrop,
                               {[styles.noCompositionLayer]: !shouldLoad && !props.eagerLoad},
                               {[styles.coverSection]: props.size === 'coverSection'},
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`])}>
      <div className={classNames(props.transitionStyles.backdropInner,
                                 {[sharedTransitionStyles.justifyBottom]:
                                   props.backdrop.contentElement})}>
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
});

Backdrop.defaultProps = {
  children: children => children,
  transitionStyles: {}
};
