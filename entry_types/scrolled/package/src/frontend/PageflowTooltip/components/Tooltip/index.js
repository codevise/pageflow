import React from 'react';
import PropTypes from "prop-types"
import classNames from 'classnames';

import styles from './Tooltip.module.css';

const BaseToolTop = ({type, children, ...props}) => {
  let  style = {
    marginLeft: props.horizontalOffset+'px',
    marginTop: props.verticalOffset+'px',
    animationTimingFunction: props.fadeEasing
  }
  
  return (
     <div style={style} className={classNames(styles.base, styles[type])}>{children}</div>
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

const tooltips = {
  left: ({children, ...props}) => BaseToolTop({type: 'left', children, ...props}),
  top: ({children, ...props}) => BaseToolTop({type: 'top', children, ...props}),
  right: ({children, ...props}) => BaseToolTop({type: 'right', children, ...props}),
  bottom: ({children, ...props}) => BaseToolTop({type: 'bottom', children, ...props}),
}

const Tooltip = ({
  children,
  verticalOffset,
  horizontalOffset,
  open,
  placement,
  zIndex,
  fadeDuration,
  fadeEasing,
}) => {
  const Component = tooltips[placement] || tooltips.top
  return (
    open && (
      <Component
        verticalOffset={verticalOffset}
        horizontalOffset={horizontalOffset}
        zIndex={zIndex}
        fadeDuration={fadeDuration}
        fadeEasing={fadeEasing}
      >
        {children}
      </Component>
    )
  )
}

Tooltip.propTypes = {
  children: PropTypes.any.isRequired,
  verticalOffset: PropTypes.number,
  horizontalOffset: PropTypes.number,
  open: PropTypes.bool,
  placement: PropTypes.string,
  zIndex: PropTypes.number,
  fadeEasing: PropTypes.string,
  fadeDuration: PropTypes.number,
}

export default Tooltip
