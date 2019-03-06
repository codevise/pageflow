import React from 'react';
import classNames from 'classnames';

import Scroller from './Scroller';

import {connectInPage} from 'pages';
import {pageIsActivated, initialScrollerPosition} from 'pages/selectors';

import {combineSelectors} from 'utils';

/**
 * @desc Can be used inside
 * {@link pageflow.react.components.PageForeground|PageForeground} to
 * build the default page structure.
 *
 * @alias pageflow.react.components.PageScroller
 * @since 12.1
 */
export class PageScroller extends React.Component {
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
      <Scroller ref="scroller" className={className(this.props)} style={style(this.props)}>
        <div className="content_wrapper">
          {this.props.children}
        </div>
      </Scroller>
    );
  }
}

function className(props) {
  return classNames(props.className, {
    'scroller-clipped_bottom': !!props.marginBottom
  });
}

function style(props) {
  if (props.marginBottom) {
    return {
      bottom: props.marginBottom
    };
  }
}

PageScroller.propTypes = {
  className: React.PropTypes.string
};

PageScroller.childContextTypes = {
  pageScroller: React.PropTypes.object
};

export default connectInPage(combineSelectors({
  enabled: pageIsActivated(),
  initialScrollerPosition: initialScrollerPosition()
}))(PageScroller);
