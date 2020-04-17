import React from 'react';

import {connect} from 'react-redux';
import {combineSelectors} from 'utils';
import {prop} from 'utils/selectors';
import {pageAttributes} from 'pages/selectors';

class PageLink extends React.Component {
  render() {
    return (
      <a href={this._href()}
         className={this.props.className}
         onClick={this._handleClick.bind(this)}>
        {this.props.children}
      </a>
    );
  }

  _href() {
    if (this._targetPage()) {
      return '#' + this._targetPage().permaId;
    }
    else {
      return '#missing';
    }
  }

  _handleClick(event) {
    if (this._targetPage()) {
      pageflow.slides.goToByPermaId(this._targetPage().permaId, {
        transition: this.props.pageLink.pageTransition
      });
    }
    event.preventDefault();
  }

  _targetPage() {
    return this.props.targetPage;
  }
}

export default connect(combineSelectors({
  targetPage: pageAttributes({id: prop('pageLink.targetPageId')})
}))(PageLink);
