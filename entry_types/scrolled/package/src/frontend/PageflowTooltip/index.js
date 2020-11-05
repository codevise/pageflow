import React from "react"
import PropTypes from "prop-types"

import Arrow from "./components/Arrow"
import Tooltip from "./components/Tooltip"
import Bubble from "./components/Bubble"

import styles from './PageflowTooltip.module.css'

class Wrapper extends React.Component {
  constructor() {
    super()

    this.state = {
      open: false,
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleTouch = this.handleTouch.bind(this)
  }

  handleMouseEnter() {
    this.setState({open: true})
  }

  handleMouseLeave() {
    this.setState({open: false})
  }

  handleTouch() {
    const isOpen = this.state.open
    this.setState({open: !isOpen})
  }

  render() {
    const {open} = this.state
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
      ...props
    } = this.props
    const hasTrigger = children !== undefined && children !== null
    const tooltipElement = (
      <Tooltip
        open={!hasTrigger || fixed ? true : open}
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
    return hasTrigger ? (
      <div
        className={styles.container}
        onMouseEnter={!fixed && hover ? this.handleMouseEnter : undefined}
        onMouseLeave={!fixed && hover ? this.handleMouseLeave : undefined}
        onTouchEnd={!fixed ? this.handleTouch : undefined}
        onClick={this.handleTouch}
        style={customCss}
        {...props}
      >
        {children}
        {tooltipElement}
      </div>
    ) : (
      <div
        className={styles.container}
        style={props.customCss}
        {...props}
      >
        {tooltipElement}
      </div>
    )
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
}

Wrapper.displayName = "Tooltip.Wrapper"
Tooltip.displayName = "Tooltip"
Bubble.displayName = "Tooltip.Bubble"
Arrow.displayName = "Tooltip.Arrow"

export {Wrapper as PageflowTooltip};
