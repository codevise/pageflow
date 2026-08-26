import React, {forwardRef} from 'react';
import classNames from 'classnames';

import CommentIcon from './images/comment.svg';
import styles from './Badge.module.css';

export const Badge = forwardRef(function Badge({
  counter, hasThreads = counter > 0, mode, resolved, unread, label, onClick
}, ref) {
  const variant = resolveVariant(mode, hasThreads, unread);

  if (!variant) {
    return null;
  }

  return (
    <button ref={ref}
            role="status"
            aria-label={label}
            className={classNames(styles.badge, styles[variant],
                                  {[styles.resolved]: resolved,
                                   [styles.unread]: unread})}
            onClick={onClick}>
      {variant !== 'dot' && <CommentIcon className={styles.icon} />}
      {(variant === 'active' || variant === 'expanded') && counter > 1 ? counter : null}
    </button>
  );
});

function resolveVariant(mode, hasThreads, unread) {
  switch (mode) {
  case 'active':
    return 'active';
  case 'icon':
    return hasThreads ? 'expanded' : 'iconOnly';
  case 'dot':
    // Collapsing to a dot would leave the unread dot sitting on a dot.
    // Unseen comments are worth the space of the full badge anyway.
    return hasThreads ? (unread ? 'expanded' : 'dot') : null;
  default:
    return hasThreads ? 'expanded' : null;
  }
}
