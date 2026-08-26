import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {
  useFloating, FloatingPortal, offset, shift, size, autoUpdate
} from '@floating-ui/react';

import {ActivityList, useUnseenActivityCount} from 'pageflow-scrolled/review';
import {useI18n} from '../i18n';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
import {useCommentNavigation, useSelectedSubject} from './SelectedSubjectProvider';

import ActivityIcon from './images/activity.svg';
import toolbarStyles from './FloatingToolbar.module.css';
import styles from './ActivityButton.module.css';

// The default navigation sits across the top of the viewport - a 50px bar
// with an 8px progress bar under it - and the panel grows up into it.
const viewportPadding = {top: 74, right: 16, bottom: 16, left: 16};

export function ActivityButton() {
  const {t} = useI18n({locale: 'ui'});
  const [open, setOpen] = useState(false);

  const unseenCount = useUnseenActivityCount();
  const label = t('pageflow_scrolled.review.activity.toggle');
  const {clearSelection} = useSelectedSubject();
  const portalRoot = useFloatingPortalRoot();

  const {refs, floatingStyles} = useFloating({
    open,
    strategy: 'fixed',
    placement: 'top-end',
    middleware: [
      offset(8),
      shift({padding: viewportPadding}),
      size({
        padding: viewportPadding,
        apply({availableHeight, elements}) {
          elements.floating.style.maxHeight = `${availableHeight}px`;
        }
      })
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <>
      <button ref={refs.setReference}
              className={classNames(toolbarStyles.button, styles.button)}
              onClick={() => {
                if (!open) {
                  clearSelection();
                }

                setOpen(!open);
              }}
              aria-expanded={open}
              aria-label={label}
              title={label}>
        <ActivityIcon />
        {unseenCount > 0 && <span className={styles.unseenDot} />}
      </button>

      {/* Out of the toolbar, whose view transition would snapshot the
          panel along with it and whose clicks are exempt from dismissing
          open popovers. */}
      {open &&
        <FloatingPortal id="floating-ui-above-navigation-widgets" root={portalRoot}>
          <ActivityPanel ref={refs.setFloating}
                         style={floatingStyles}
                         onClose={() => setOpen(false)} />
        </FloatingPortal>}
    </>
  );
}

const ActivityPanel = React.forwardRef(function ActivityPanel({style, onClose}, ref) {
  const {t} = useI18n({locale: 'ui'});
  const {goToThread} = useCommentNavigation();

  const panelRef = useRef();

  const setRefs = useCallback(node => {
    panelRef.current = node;
    ref(node);
  }, [ref]);

  useEffect(() => {
    function handleClick(event) {
      if (panelRef.current?.contains(event.target)) return;
      if (event.target.closest('[data-comment-toolbar]')) return;

      onClose();
    }

    // Claimed in the capture phase so that an open popover does not close
    // itself on the same key.
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onClose]);

  return (
    <div ref={setRefs}
         className={styles.panel}
         style={style}
         role="dialog"
         aria-label={t('pageflow_scrolled.review.activity.toggle')}
         data-comment-activity>
      <div className={styles.scroller}>
        <ActivityList onEntryClick={entry => goToThread(entry.threadId,
                                                        {revealOnly: true})} />
      </div>
    </div>
  );
});
