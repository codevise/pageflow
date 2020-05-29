import React, {useContext, useState, createContext, useMemo, useRef} from 'react';
import classNames from 'classnames';
import {Range} from 'slate';
import {useSlate} from 'slate-react';

import styles from './index.module.css';

import ExternalLinkIcon from '../images/externalLink.svg';

const DisabledContext = createContext();
const StateContext = createContext();
const UpdateContext = createContext();

export function LinkTooltipProvider({disabled, children}) {
  const [state, setState] = useState();
  const outerRef = useRef();

  const update = useMemo(() => {
    let timeout;

    return {
      activate(href, linkRef) {
        clearTimeout(timeout);
        timeout = null;

        const outerRect = outerRef.current.getBoundingClientRect();
        const linkRect = linkRef.current.getBoundingClientRect();

        setState({
          href,
          top: linkRect.bottom - outerRect.top + 10,
          left: linkRect.left - outerRect.left
        });
      },

      keep() {
        clearTimeout(timeout);
        timeout = null;
      },

      deactivate() {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null)
          }, 200);
        }
      }
    }
  }, []);

  return (
    <DisabledContext.Provider value={disabled}>
      <StateContext.Provider value={state}>
        <UpdateContext.Provider value={update}>
          <div ref={outerRef}>
            <LinkTooltip />
            {children}
          </div>
        </UpdateContext.Provider>
      </StateContext.Provider>
    </DisabledContext.Provider>
  );
}

export function LinkPreview({href, children}) {
  const {activate, deactivate} = useContext(UpdateContext);
  const ref = useRef();
  return (
    <span ref={ref}
          onMouseEnter={() => activate(href, ref)}
          onMouseLeave={deactivate}
          onMouseDown={deactivate}>
      {children}
    </span>
  );
}

export function LinkTooltip() {
  const disabled = useContext(DisabledContext);
  const state = useContext(StateContext);
  const {keep, deactivate} = useContext(UpdateContext);
  const editor = useSlate()

  if (disabled || !state || (editor.selection && !Range.isCollapsed(editor.selection))) {
    return null;
  }

  return (
    <div className={classNames(styles.linkTooltip, styles.hoveringToolbar)}
         onMouseEnter={keep}
         onMouseLeave={deactivate}
         style={{top: state.top, left: state.left, opacity: 1}}>
      <a href={state.href}
         target="_blank"
         rel="noopener noreferrer">
        {state.href}
        <ExternalLinkIcon width={10} height={10} />
      </a>
    </div>
  );
}
