import React from "react"
import PropTypes from "prop-types"
import classNames from 'classnames';

import Arrow from "./components/Arrow"
import Tooltip from "./components/Tooltip"
import Bubble from "./components/Bubble"

import styles from './PageflowTooltip.module.css'

class TooltipContent extends React.Component {
  
  componentDidMount() {
    if (this.contentElement) {
      this.contentElement.focus();
    }
  }
  render() {
    const content = this.props.content;
    return (
      <div ref={(elem) => { this.contentElement = elem; }}>
        {content}
      </div>
    )
  }

}

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

  handleTouch(event) {
    const isOpen = this.state.open;
    this.setState({open: !isOpen});
    if (!isOpen && this.props.closeOther) {
      let tooltips = document.getElementsByClassName(styles.tooltipOpen);
      for (const tp of tooltips) {
        tp.click();
      }
    }
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
      classWhenOpen,
      closeOther,
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
          <TooltipContent content={content} />
        </Bubble>
      </Tooltip>
    )
    let newChildren = children;
    if (open && classWhenOpen) {
      let existingClasses = children.props.className ? children.props.className+' ' : '';
      newChildren = React.cloneElement(children, { className: existingClasses + classWhenOpen})
    }
    return hasTrigger ? (
      <div
        className={classNames(styles.container, {[styles.tooltipOpen]: open})}
        onMouseEnter={!fixed && hover ? this.handleMouseEnter : undefined}
        onMouseLeave={!fixed && hover ? this.handleMouseLeave : undefined}
        onClick={!fixed ? this.handleTouch : undefined}
        style={customCss}
        {...props}
      >
        {newChildren}
        {tooltipElement}
      </div>
    ) : (
      <div
        className={styles.container}
        style={props.customCss}
        data-open={open}
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
