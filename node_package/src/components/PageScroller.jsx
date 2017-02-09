import React from 'react';

import Scroller from './Scroller';

import {connectInPage} from 'pages';
import {pageIsActivated, initialScrollerPosition} from 'pages/selectors';

import {combine} from 'utils';

/**
 * @desc Can be used inside
 * {@link pageflow.react.components.PageForeground|PageForeground} to
 * build the default page structure.
 *
 * @alias pageflow.react.components.PageScroller
 * @since edge
 */
class PageScroller extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.enabled && nextProps.enabled) {
      this.refs.scroller.enable();
    }
    else if (this.props.enabled && !nextProps.enabled) {
      this.refs.scroller.disable();
    }

    if (this.props.initialScrollerPosition !== nextProps.initialScrollerPosition &&
        nextProps.initialScrollerPosition) {

      this.refs.scroller.resetPosition({position: nextProps.initialScrollerPosition});
    }
  }

  getChildContext() {
    this._pageScroller = this._pageScroller || {
      disable: () => {
        this.refs.scroller.disable();
      },
      enable: () => {
        this.refs.scroller.enable();
      }
    };

    return {
      pageScroller: this._pageScroller,
    };
  }

  render() {
    return (
      <Scroller ref="scroller" className={this.props.className}>
        <div className="contentWrapper">
          {this.props.children}
        </div>
      </Scroller>
    );
  }
}

PageScroller.propTypes = {
  className: React.PropTypes.string
};

PageScroller.childContextTypes = {
  pageScroller: React.PropTypes.object
};

export default connectInPage(combine({
  enabled: pageIsActivated(),
  initialScrollerPosition: initialScrollerPosition()
}))(PageScroller);
