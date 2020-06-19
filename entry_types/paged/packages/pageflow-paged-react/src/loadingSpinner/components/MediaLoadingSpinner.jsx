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
      animating: false
    };
  }

  componentDidMount() {
    if (PAGEFLOW_EDITOR) {
      this.setState({hidden: true, animating: true});
    }
    else {
      this.setState({animating: true});
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
    const {editing} = this.props;
    const {hidden, animating} = this.state;
    var invert = getInvert(this.props);
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

function backgroundImageInlineStyles({firstPageBackgroundImageUrl, backgroundImage, blurStrength, backgroundImageX, backgroundImageY}) {

  var backgroundPosition = {
    x: backgroundImageX != undefined ? backgroundImageX : 50,
    y: backgroundImageY != undefined ? backgroundImageY : 50
  }
  const url = backgroundImage ? backgroundImage.urls.medium : firstPageBackgroundImageUrl;
  if (url) {
    var style = {
      backgroundImage: `url("${url}")`,
      filter: 'blur('+blurStrength+'px)',
    };
    if (backgroundImage) {
      style.backgroundPosition = `${backgroundPosition.x}% ${backgroundPosition.y}%`
    }
    return style;
  }
}

export function getInvert(props){
  if (!props.backgroundImage && props.invert == undefined) {
    return props.firstPageInvert
  }
  return props.invert;
}

function inlineStyle(props) {
  const invert = getInvert(props);
  const animationDelay = props.animationDuration !== undefined ?
                         props.animationDuration + 's' :
                         undefined;

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: invert ? '#fff':'#000',
    animationDelay
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
  backgroundImageX: widgetAttribute('customBackgroundImageX', {role: 'loading_spinner'}),
  backgroundImageY: widgetAttribute('customBackgroundImageY', {role: 'loading_spinner'}),
  invert: widgetAttribute('invert', {role: 'loading_spinner'}),
  removeLogo: widgetAttribute('removeLogo', {role: 'loading_spinner'}),
  blurStrength: widgetAttribute('blurStrength', {role: 'loading_spinner'}),
  animationDuration: widgetAttribute('animationDuration', {role: 'loading_spinner'}),
}))(MediaLoadingSpinnerComponent);


export function register() {
  registerWidgetType('media_loading_spinner', {
    component: MediaLoadingSpinner
  });
}
