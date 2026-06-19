import React, {forwardRef} from 'react';
import classNames from 'classnames';

import CommentIcon from './images/comment.svg';
import styles from './Badge.module.css';

export const Badge = forwardRef(function Badge({counter, mode, resolved, onClick}, ref) {
  const variant = resolveVariant(mode, counter > 0);

  if (!variant) {
    return null;
  }

  return (
    <button ref={ref}
            role="status"
            className={classNames(styles.badge, styles[variant],
                                  {[styles.resolved]: resolved})}
            onClick={onClick}>
      {variant !== 'dot' && <CommentIcon className={styles.icon} />}
      {(variant === 'active' || variant === 'expanded') && counter > 1 ? counter : null}
    </button>
  );
});

function resolveVariant(mode, hasThreads) {
  switch (mode) {
  case 'active':
    return 'active';
  case 'icon':
    return hasThreads ? 'expanded' : 'iconOnly';
  case 'dot':
    return hasThreads ? 'dot' : null;
  default:
    return hasThreads ? 'expanded' : null;
  }
}
