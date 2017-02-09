import {Component} from 'react';

/**
 * @desc Use inside {@link
 * pageflow.react.components.PageWrapper|PageWrapper} to build the
 * default page structure.
 *
 * @alias pageflow.react.components.PageBackground
 * @class
 * @since 0.1
 */
export default class extends Component {
  render() {
    return (
      <div className="backgroundArea">
        {this.props.children}
      </div>
    );
  }
}
