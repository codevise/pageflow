import React, {useEffect, useRef, useState} from 'react';
import {
  useFloating, useClick, useDismiss, useRole, useListNavigation, useTypeahead,
  useInteractions, FloatingPortal, FloatingFocusManager,
  offset, flip, shift, autoUpdate
} from '@floating-ui/react';

import {useFloatingPortalRoot} from 'pageflow-scrolled/frontend';

import EllipsisIcon from './images/ellipsis.svg';
import styles from './CommentMenu.module.css';

export function CommentMenu({label, items}) {
  const portalRoot = useFloatingPortalRoot();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const elementsRef = useRef([]);
  const labelsRef = useRef([]);
  labelsRef.current = items.map(item => item.label);

  const {refs, floatingStyles, context} = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-end',
    middleware: [offset(4), flip({padding: 8}), shift({padding: 8})],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {escapeKey: false});
  const role = useRole(context, {role: 'menu'});

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
    enabled: open
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    click, dismiss, role, listNavigation, typeahead
  ]);

  // React 16 dispatches all events from the document, so enclosing popovers
  // listening there for Escape would close along with the menu.
  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
      }
    }

    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  }, [open]);

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <span className={styles.menu} onClick={stopPropagation}>
      <button ref={refs.setReference}
              type="button"
              className={styles.button}
              aria-label={label}
              {...getReferenceProps()}>
        <EllipsisIcon />
      </button>

      {open &&
        <FloatingPortal root={portalRoot}>
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating}
                 data-comment-menu
                 data-floating-raised
                 className={styles.list}
                 style={floatingStyles}
                 onClick={stopPropagation}
                 {...getFloatingProps()}>
              {items.map(({icon: Icon, label, onSelect}, index) => (
                <button key={label}
                        ref={node => elementsRef.current[index] = node}
                        type="button"
                        role="menuitem"
                        className={styles.item}
                        tabIndex={activeIndex === index ? 0 : -1}
                        {...getItemProps({
                          onClick() {
                            setOpen(false);

                            if (onSelect) onSelect();
                          }
                        })}>
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>}
    </span>
  );
}
