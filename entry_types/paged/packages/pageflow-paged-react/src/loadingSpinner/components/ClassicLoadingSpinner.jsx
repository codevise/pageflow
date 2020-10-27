import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {editingWidget} from 'widgets/selectors';

const inlineStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#3b5159'
};

class ClassicLoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fading: false,
      hidden: false
    };
  }

  componentDidMount() {
    if (PAGEFLOW_EDITOR) {
      this.setState({hidden: true, fading: true});
    }
    else {
      this.setState({fading: true});
      pageflow.delayedStart.waitFor(resolve => {
        this.resolveDelayedStart = resolve;
      });
    }
  }
  hideOrLoop(el) {
    if (el.target === el.currentTarget) {
      if (PAGEFLOW_EDITOR) {
        this.setState({fading: false});

        setTimeout(() => {
          this.setState({fading: true});
        }, 1500);
      }
      else {
        this.setState({hidden: true});
        this.resolveDelayedStart();
      }
    }
  }


  render() {
    const {editing} = this.props;
    const {hidden, fading} = this.state;

    if (editing || !hidden) {
      return (
        <div className={classNames('loading_spinner', {'fade': fading})}
             onAnimationEnd={(event) => this.hideOrLoop(event)}
             onTouchMove={preventScrollBouncing}
             style={inlineStyle}>
          <div className="loading_inner">
            <div className="left_circle"></div>
            <div className="right_circle"></div>
            <div className="loading_spinner_inner"><div></div></div>
          </div>
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

function preventScrollBouncing(e) {
  e.preventDefault();
}

export function register() {
  registerWidgetType('classic_loading_spinner', {
    component: connect(combineSelectors({
      editing: editingWidget({role: 'loading_spinner'}),
    }))(ClassicLoadingSpinner)
  });
}
