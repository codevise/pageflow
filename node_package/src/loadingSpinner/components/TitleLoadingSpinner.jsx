import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {editingWidget, widgetAttribute} from 'widgets/selectors';
import {file} from 'files/selectors';
import {pageBackgroundImageUrl, firstPageAttribures} from 'pages/selectors';

class TitleLoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      animating: true
    };
  }

  componentDidMount() {
    if (PAGEFLOW_EDITOR) {
      this.setState({hidden: true});
    }
    else {
      pageflow.delayedStart.waitFor(resolve => {
        this.resolveDelayedStart = resolve;
      });
    }
  }

  hideOrLoop(el) {
    if (el.target === el.currentTarget) {
      if (PAGEFLOW_EDITOR) {
        this.setState({animating: false});

        setTimeout(() => {
          this.setState({animating: true});
        }, 1000);
      }
      else {
        this.setState({hidden: true});
        this.resolveDelayedStart();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hiddenTimeout);
  }

  render() {
    const {editing, title, subtitle, entryTitle, invert} = this.props;
    const {hidden, animating} = this.state;
    
    
    if (editing || !hidden) {
      return (
        <div className={classNames('title_loading_spinner', {'title_loading_spinner-fade': animating}, {'loading_spinner_invert': invert})}
             onAnimationEnd={(event) => this.hideOrLoop(event)}
             onTouchMove={preventScrollBouncing}
             style={inlineStyle(invert)}>
          <div className="title_loading_spinner-logo" />
          <div className="title_loading_spinner-image"
               style={backgroundImageInlineStyles(this.props)} />
          <h3 className={classNames('title_loading_spinner-titles', {'loading_spinner_invert': invert})}>
            <div className="title_loading_spinner-title">
              {title || entryTitle}
            </div>
            <div className="title_loading_spinner-subtitle">
              {subtitle}
            </div>
          </h3>
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

function inlineStyle(invert = false) {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: invert ? '#fff':'#000'
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
      subtitle: widgetAttribute('subtitle', {role: 'loading_spinner'}),
      invert: widgetAttribute('invert', {role: 'loading_spinner'})
    }))(TitleLoadingSpinner)
  });
}
