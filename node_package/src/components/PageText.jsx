import {Component} from 'react';

/**
 * @desc Place inside
 * {@link pageflow.react.components.PageScroller|PageScroller} to
 * display the page's content text.
 *
 * @alias pageflow.react.components.PageText
 * @class
 * @since 0.1
 *
 * @prop page
 *   Required. The page object to read configuration properties from.
 */
export default class PageText extends Component {
  render() {
    return (
      <div className="contentText">
        <p dangerouslySetInnerHTML={this.text()} />
        {this.props.children}
      </div>
    );
  }

  text() {
    return {__html: this.props.page.text};
  }
}
