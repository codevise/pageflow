import React from 'react';
import PropTypes from "prop-types"
import classNames from 'classnames';

import styles from './Tooltop.module.css';

const BaseToolTop = ({type, children, ...props}) => {
  let  style = {
    marginLeft: props.horizontalOffset+'px',
    marginTop: props.verticalOffset+'px',
    animationTimingFunction: props.fadeEasing
  }

  // Negative tabIndex ensures element can take focus but does not
  // come up in tab order. This ensures the tooltip stays expanded
  // when text in the legal info menu is selected.
  return (
    <div style={style}
         tabIndex="-1"
         className={classNames(styles.base, styles[type], props.className)}>{children}</div>
  );
}

BaseToolTop.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  verticalOffset: PropTypes.number,
  horizontalOffset: PropTypes.number,
  open: PropTypes.bool,
  zIndex: PropTypes.number,
  fadeEasing: PropTypes.string,
  fadeDuration: PropTypes.number,
}

const tooltops = {
  left: ({children, ...props}) => BaseToolTop({type: 'left', children, ...props}),
  top: ({children, ...props}) => BaseToolTop({type: 'top', children, ...props}),
  right: ({children, ...props}) => BaseToolTop({type: 'right', children, ...props}),
  bottom: ({children, ...props}) => BaseToolTop({type: 'bottom', children, ...props}),
}

const Tooltop = ({
  className,
  children,
  verticalOffset,
  horizontalOffset,
  open,
  placement,
  zIndex,
  fadeDuration,
  fadeEasing,
}) => {
  const Component = tooltops[placement] || tooltops.top
  return (
    <Component
      className={className}
      verticalOffset={verticalOffset}
      horizontalOffset={horizontalOffset}
      zIndex={zIndex}
      fadeDuration={fadeDuration}
      fadeEasing={fadeEasing}
    >
      {children}
    </Component>
  )
}

Tooltop.propTypes = {
  children: PropTypes.any.isRequired,
  verticalOffset: PropTypes.number,
  horizontalOffset: PropTypes.number,
  open: PropTypes.bool,
  placement: PropTypes.string,
  zIndex: PropTypes.number,
  fadeEasing: PropTypes.string,
  fadeDuration: PropTypes.number,
}

export default Tooltop
