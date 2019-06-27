import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {editingWidget, widgetAttribute} from 'widgets/selectors';
import {file} from 'files/selectors';
import {pageBackgroundImageUrl, firstPageAttribures} from 'pages/selectors';
import {TitleLoadingSpinner, preventScrollBouncing, inlineStyle, backgroundImageInlineStyles} from './TitleLoadingSpinner';

class MediaLoadingSpinner extends TitleLoadingSpinner {
  render() {
    const {hidden, animating} = this.state;
    var logoElement = <div className="title_loading_spinner-logo" />
    if (this.props.removeLogo) {
      logoElement = ''
    }
    if (this.props.editing || !hidden) {
      return (
        <div className={classNames('title_loading_spinner', {'title_loading_spinner-fade': animating})}
             onAnimationEnd={(event) => this.hideOrLoop(event)}
             onTouchMove={preventScrollBouncing}
             style={inlineStyle()}>
          {logoElement}
          <div className="title_loading_spinner-image"
               style={backgroundImageInlineStyles(this.props)} />
        </div>
      );
    }
    else {
      return <noscript />;
    }
  }
}

export function register() {
  registerWidgetType('media_loading_spinner', {
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
      removeLogo: widgetAttribute('removeLogo', {role: 'loading_spinner'})
    }))(MediaLoadingSpinner)
  });
}
