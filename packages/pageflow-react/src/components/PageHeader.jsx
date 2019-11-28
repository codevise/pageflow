import React from 'react';

/**
 * @desc Place inside
 * {@link pageflow.react.components.PageScroller|PageScroller} to
 * display the page's headings.
 *
 * @alias pageflow.react.components.PageHeader
 * @class
 * @since 0.1
 *
 * @prop page
 *   Required. The page object to read configuration properties from.
 */
export default class extends React.Component {
  render() {
    return (
      <h3 className="page_header">
        <span className="page_header-tagline">{this.props.page.tagline}</span>
        <span className="page_header-title">{this.props.page.title}</span>
        <span className="page_header-subtitle">{this.props.page.subtitle}</span>
      </h3>
    );
  }
}
