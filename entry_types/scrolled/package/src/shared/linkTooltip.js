import React, {useContext, useEffect, useState, createContext, useMemo, useRef} from 'react';
import {
  useFloating,
  FloatingPortal,
  arrow,
  shift,
  offset,
  inline,
  autoUpdate
} from '@floating-ui/react';

import {useFloatingPortalRoot} from '../frontend/FloatingPortalRootProvider';
import {useStorylineActivity} from '../frontend/storylineActivity';

const UpdateContext = createContext();

export function LinkTooltipProvider(props) {
  const update = useContext(UpdateContext);

  if (update) {
    return props.children;
  }
  else {
    return (
      <LinkTooltipProviderInner {...props} />
    );
  }
}

function LinkTooltipProviderInner({
  tooltip: Tooltip,
  disabled, position, floatingStrategy, onClick, children, align = 'left', gap = 10
}) {
  const storylineMode = useStorylineActivity();
  const [state, setState] = useState();

  const arrowRef = useRef();

  const {refs, floatingStyles, context: floatingContext} = useFloating({
    strategy: floatingStrategy,
    placement: `${position === 'below' ? 'bottom' : 'top'}${align === 'left' ? '-start' : ''}`,
    middleware: [
      offset(gap),
      shift(),
      arrow({element: arrowRef, padding: 10}),
      inline()
    ],
    whileElementsMounted: autoUpdate
  });

  const update = useMemo(() => {
    let timeout;

    return {
      activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;

        refs.setReference(linkRef.current);

        setState({
          href,
          openInNewTab
        });
      },

      keep() {
        clearTimeout(timeout);
        timeout = null;
      },

      deactivate({delay = 200} = {}) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null)
          }, delay);
        }
      }
    }
  }, [refs]);

  useEffect(() => {
    if (storylineMode !== 'active') {
      update.deactivate({delay: 0})
    }
  }, [storylineMode, update])

  return (
    <UpdateContext.Provider value={update}>
      <FloatingPortal root={useFloatingPortalRoot()}>
        <Tooltip state={state}
                 setFloating={refs.setFloating}
                 floatingStyles={floatingStyles}
                 floatingContext={floatingContext}
                 arrowRef={arrowRef}
                 onClick={onClick}
                 disabled={disabled} />
      </FloatingPortal>
      {children}
    </UpdateContext.Provider>
  );
}

export function useLinkTooltip() {
  return useContext(UpdateContext);
}

export function LinkPreview({disabled, href, openInNewTab, children, className}) {
  const {activate, deactivate} = useContext(UpdateContext);
  const ref = useRef();

  useEffect(() => {
    if (disabled) {
      deactivate({delay: 0})
    }
  }, [disabled, deactivate])

  return (
    <span ref={ref}
          className={className}
          onMouseEnter={() => !disabled && activate(href, openInNewTab, ref)}
          onMouseLeave={() => !disabled && deactivate()}>
      {children}
    </span>
  );
}
