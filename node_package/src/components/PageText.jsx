import {Component} from 'react';

import textEmbeds from 'textEmbeds';

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
  updateDOMRef(element) {
    if (element) {
      textEmbeds.mountInElement(element);
    }
    else {
      textEmbeds.unmountInElement(this.element);
    }

    this.element = element;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.page.text !== this.props.page.text;
  }

  componentWillUpdate() {
    textEmbeds.unmountInElement(this.element);
  }

  componentDidUpdate() {
    textEmbeds.mountInElement(this.element);
  }

  render() {
    return (
      <div className="contentText" ref={this.updateDOMRef.bind(this)}>
        <p dangerouslySetInnerHTML={this.text()} />
        {this.props.children}
      </div>
    );
  }

  text() {
    return {__html: textEmbeds.renderInString(this.props.page.text || '')};
  }
}
