import React from 'react';
import classNames from 'classnames';

/**
 * @desc Can be used inside
 * {@link pageflow.react.components.PageBackground|PageBackground} to
 * display a gradient which improves the contrast of text displayed
 * inside the {@link
 * pageflow.react.components.PageForeground|PageForeground}
 *
 * @alias pageflow.react.components.PageShadow
 * @class
 * @since 0.1
 *
 * @prop page
 *   Required. The page object to read configuration properties from.
 */
export default class PageShadow extends React.Component {
  render() {
    return (
      <div className="shadow_wrapper">
        <div className={classNames('shadow', this.props.className)} style={this.style()} />
      </div>
    );
  }

  style() {
    if ('gradientOpacity' in this.props.page) {
      return {
        opacity: this.props.page.gradientOpacity / 100
      };
    }
  }
};
