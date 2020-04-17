import React from 'react';

/**
 * Helper create components that render SVG icons.
 *
 * See {@link pageflow.react.iconMapping} for usage examples.
 *
 * @alias pageflow.react.components.SvgIcon
 * @class
 *
 * @prop viewBoxWidth
 *   Required. Width of view box used to interpret coordinates of child elements.
 *
 * @prop viewBoxHeight
 *   Required. Height of view box used to interpret coordinates of child elements.
 *
 * @prop viewBoxLeft
 *   Defaults to 0.
 *
 * @prop viewBoxTop
 *   Defaults to 0.
 *
 * @prop className
 *   CSS class name
 *
 * @prop width
 *   Width attribute for the `svg` element.
 *
 * @prop height
 *   Height attribute for the `svg` element.
 */
function Container(props) {
  return (
    <svg className={props.className}
         version="1.1" xmlns="http://www.w3.org/2000/svg"
         width={props.width} height={props.height}
         viewBox={`${props.viewBoxLeft} ${props.viewBoxTop} ${props.viewBoxWidth} ${props.viewBoxHeight}`}>
      {props.children}
    </svg>
  );
}

Container.propTypes = {
  viewBoxWidth: React.PropTypes.number.isRequired,
  viewBoxHeight: React.PropTypes.number.isRequired,
  viewBoxLeft: React.PropTypes.number,
  viewBoxTop: React.PropTypes.number,

  className: React.PropTypes.string,

  width: React.PropTypes.number,
  height: React.PropTypes.number
};

Container.defaultProps = {
  width: 20,
  height: 20,
  viewBoxLeft: 0,
  viewBoxTop: 0
};

export default Container;
