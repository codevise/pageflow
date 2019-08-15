import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {editingWidget, widgetAttribute} from 'widgets/selectors';
import {file} from 'files/selectors';
import {pageBackgroundImageUrl, firstPageAttribures, firstPageAttribute} from 'pages/selectors';

export class MediaLoadingSpinnerComponent extends React.Component {
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
    const {editing, invert} = this.props;
    const {hidden, animating} = this.state;
    var logoElement = <div className={classNames("media_loading_spinner-logo", {'media_loading_spinner-logo-invert': invert})} />
    if (this.props.removeLogo) {
      logoElement = ''
    }
    if (editing || !hidden) {
      return (
        <div className={classNames('media_loading_spinner', {'media_loading_spinner-fade': animating}, {'media_loading_spinner-invert': invert})}
             onAnimationEnd={(event) => this.hideOrLoop(event)}
             onTouchMove={preventScrollBouncing}
             style={inlineStyle(this.props)}>
          {logoElement}
          <div className="media_loading_spinner-image"
               style={backgroundImageInlineStyles(this.props)} />
          {this.props.children}
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

function backgroundImageInlineStyles({firstPageBackgroundImageUrl, backgroundImage, blurStrength}) {
  const url = backgroundImage ? backgroundImage.urls.medium : firstPageBackgroundImageUrl;
  if (url) {
    return {
      backgroundImage: `url("${url}")`,
      filter: 'blur('+blurStrength+'px)'
    };
  }
}

function inlineStyle(props) {
  const {backgroundImage, firstPageInvert, invert} = props;
  var spinnerInvert = invert;
  if (!backgroundImage && !invert) {
    spinnerInvert = firstPageInvert
  }
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: spinnerInvert ? '#fff':'#000'
  };
}


export const MediaLoadingSpinner = connect(combineSelectors({
  editing: editingWidget({role: 'loading_spinner'}),
  firstPageInvert: firstPageAttribute('invert'),
  firstPageBackgroundImageUrl: pageBackgroundImageUrl({
    variant: 'medium',
    page: firstPageAttribures()
  }),
  backgroundImage: file('imageFiles', {
    id: widgetAttribute('customBackgroundImageId', {
      role: 'loading_spinner'
    })
  }),
  invert: widgetAttribute('invert', {role: 'loading_spinner'}),
  removeLogo: widgetAttribute('removeLogo', {role: 'loading_spinner'}),
  blurStrength: widgetAttribute('blurStrength', {role: 'loading_spinner'})
}))(MediaLoadingSpinnerComponent)


export function register() {
  registerWidgetType('media_loading_spinner', {
    component: MediaLoadingSpinner
  });
}
