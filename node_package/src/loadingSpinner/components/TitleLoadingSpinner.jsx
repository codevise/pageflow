import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {editingWidget, widgetAttribute} from 'widgets/selectors';
import {file} from 'files/selectors';
import {pageBackgroundImageUrl, firstPageAttribures} from 'pages/selectors';

const animationDuration = 9000;

class TitleLoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: PAGEFLOW_EDITOR,
      animating: true
    };
  }

  componentDidMount() {
    if (PAGEFLOW_EDITOR) {
      this.loopAnimation();
    }
    else {
      pageflow.delayedStart.waitFor(resolve => {
        this.resolveDelayedStart = resolve;
      });
    }
  }

  hideIfNotEditor(el) {
    if (!PAGEFLOW_EDITOR && el.target === el.currentTarget) {
      this.setState({hidden: true});
      this.resolveDelayedStart();
    }
  }

  loopAnimation() {
    const loop = () => {
      this.setState({animating: false});

      setTimeout(() => {
        this.setState({animating: true});
        this.loopTimeout = setTimeout(loop, animationDuration);
      }, 1000);
    };

    this.loopTimeout = setTimeout(loop, animationDuration);
  }

  componentWillUnmount() {
    clearTimeout(this.hiddenTimeout);
    clearInterval(this.loopTimeout);
  }

  render() {
    const {editing, title, subtitle, entryTitle} = this.props;
    const {hidden, animating} = this.state;

    if (editing || !hidden) {
      return (
        <div className={classNames('title_loading_spinner', {'title_loading_spinner-fade': animating})}
             onAnimationEnd={(event) => this.hideIfNotEditor(event)}
             onTouchMove={preventScrollBouncing}
             style={inlineStyle()}>
          <div className="title_loading_spinner-logo" />
          <div className="title_loading_spinner-image"
               style={backgroundImageInlineStyles(this.props)} />
          <div className="title_loading_spinner-titles">
            <div className="title_loading_spinner-title">
              {title || entryTitle}
            </div>
            <div className="title_loading_spinner-subtitle">
              {subtitle}
            </div>
          </div>
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

function inlineStyle() {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: '#000'
  };
}

function backgroundImageInlineStyles({firstPageBackgroundImageUrl, backgroundImage}) {
  const url = backgroundImage ? backgroundImage.urls.medium : firstPageBackgroundImageUrl;

  if (url) {
    return {
      backgroundImage: `url("${url}")`
    };
  }
}

function preventScrollBouncing(e) {
  e.preventDefault();
}

export function register() {
  registerWidgetType('title_loading_spinner', {
    component: connect(combineSelectors({
      editing: editingWidget({role: 'loading_spinner'}),
      firstPageBackgroundImageUrl: pageBackgroundImageUrl({
        variant: 'medium',
        page: firstPageAttribures()
      }),
      backgroundImage: file('imageFiles', {
        id: widgetAttribute('customBackgroundImageId', {
          role: 'loading_spinner'
        })
      }),
      entryTitle: entryAttribute('title'),
      title: widgetAttribute('title', {role: 'loading_spinner'}),
      subtitle: widgetAttribute('subtitle', {role: 'loading_spinner'})
    }))(TitleLoadingSpinner)
  });
}
