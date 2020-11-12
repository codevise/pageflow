import React from "react"
import PropTypes from "prop-types"
import classNames from 'classnames';

import Arrow from "./components/Arrow"
import Tooltip from "./components/Tooltip"
import Bubble from "./components/Bubble"

import styles from './PageflowTooltip.module.css'

class Wrapper extends React.Component {
  render() {
    const {
      arrow,
      arrowPos,
      background,
      border,
      children,
      color,
      content,
      customCss,
      fadeDuration,
      fadeEasing,
      fixed,
      hover,
      fontFamily,
      fontSize,
      verticalOffset,
      horizontalOffset,
      padding,
      placement,
      radius,
      zIndex,
      classWhenOpen,
      closeOther,
      ...props
    } = this.props
    const tooltipElement = (
      <Tooltip
        className={styles.tooltip}
        placement={placement}
        verticalOffset={verticalOffset}
        horizontalOffset={horizontalOffset}
        zIndex={zIndex}
        fadeEasing={fadeEasing}
        fadeDuration={fadeDuration}
      >
        <Bubble
          background={background}
          border={border}
          color={color}
          radius={radius}
          fontFamily={fontFamily}
          fontSize={fontSize}
          padding={padding}
          placement={placement}
        >
          <Arrow
            width={arrow}
            arrowPos={arrowPos}
            background={background}
            border={border}
            color={color}
            placement={placement}
          />
          {content}
        </Bubble>
      </Tooltip>
    )

    return (
      <div className={classNames(styles.container, {[styles.openOnHover]: hover, [styles.fixed]: fixed})}
           style={customCss}
           onClick={fixFocusHandlingSafari}
           {...props}>
        {children}
        {tooltipElement}
      </div>
    );
  }
}

// Safari does not focus buttons after they are clicked [1]. Focus
// manually to ensure `focus-within` selector that opens the tooltip
// applies.
//
// [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
function fixFocusHandlingSafari(event) {
  if (!event.target.closest) {
    // IE does not support closest, but also does not need this fix.
    return
  }

  const button = event.target.closest('button');

  if (button) {
    button.focus();
  }
}

Wrapper.propTypes = {
  arrow: PropTypes.number,
  arrowPost: PropTypes.string,
  background: PropTypes.string,
  border: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
  content: PropTypes.any.isRequired,
  customCss: PropTypes.any,
  fadeDuration: PropTypes.number,
  fadeEasing: PropTypes.string,
  fixed: PropTypes.bool,
  hover: PropTypes.bool,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  verticalOffset: PropTypes.number,
  horizontalOffset: PropTypes.number,
  padding: PropTypes.number,
  placement: PropTypes.oneOf(["left", "top", "right", "bottom"]),
  radius: PropTypes.number,
  zIndex: PropTypes.number,
  classWhenOpen: PropTypes.string,
  closeOther: PropTypes.bool
}

Wrapper.defaultProps = {
  arrow: 8,
  arrowPos: '50%',
  background: "white",
  border: "#000",
  children: null,
  color: "#000",
  fadeDuration: 0,
  fadeEasing: "linear",
  fixed: false,
  hover: true,
  fontFamily: "inherit",
  fontSize: "inherit",
  verticalOffset: 0,
  horizontalOffset: 0,
  padding: 16,
  placement: "top",
  radius: 5,
  zIndex: 1,
  customCss: {},
  classWhenOpen: null,
  closeOther: false,
}

Wrapper.displayName = "Tooltip.Wrapper"
Tooltip.displayName = "Tooltip"
Bubble.displayName = "Tooltip.Bubble"
Arrow.displayName = "Tooltip.Arrow"

export {Wrapper as PageflowTooltip};
