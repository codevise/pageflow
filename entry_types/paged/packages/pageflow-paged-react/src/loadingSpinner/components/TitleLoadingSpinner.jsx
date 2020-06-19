import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {firstPageAttribute} from 'pages/selectors';
import {file} from 'files/selectors';
import {widgetAttribute} from 'widgets/selectors';
import {MediaLoadingSpinner, getInvert} from './MediaLoadingSpinner.jsx'

export class TitleLoadingSpinner extends React.Component {
  render() {
    const {title, subtitle, entryTitle} = this.props;
    const invert = getInvert(this.props);
    const animationDuration = this.props.animationDuration !== undefined ?
                              this.props.animationDuration + 's' :
                              undefined;

    return (
        <MediaLoadingSpinner>
          <div className={classNames('media_loading_spinner-titles', {'media_loading_spinner-invert': invert})}
               style={{animationDuration}}>
            <div className="media_loading_spinner-title">
              {title || entryTitle}
            </div>
            <div className="media_loading_spinner-subtitle">
              {subtitle}
            </div>
          </div>
        </MediaLoadingSpinner>
      );
  }
}

export function register() {
  registerWidgetType('title_loading_spinner', {
    component: connect(combineSelectors({
      firstPageInvert: firstPageAttribute('invert'),
      backgroundImage: file('imageFiles', {
        id: widgetAttribute('customBackgroundImageId', {
          role: 'loading_spinner'
        })
      }),
      entryTitle: entryAttribute('title'),
      title: widgetAttribute('title', {role: 'loading_spinner'}),
      subtitle: widgetAttribute('subtitle', {role: 'loading_spinner'}),
      removeLogo: widgetAttribute('removeLogo', {role: 'loading_spinner'}),
      invert: widgetAttribute('invert', {role: 'loading_spinner'}),
      animationDuration: widgetAttribute('animationDuration', {role: 'loading_spinner'}),
    }))(TitleLoadingSpinner)
  });
}
