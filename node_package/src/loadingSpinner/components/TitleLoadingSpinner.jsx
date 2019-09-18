import {combineSelectors} from 'utils';

import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import registerWidgetType from 'registerWidgetType';
import {entryAttribute} from 'entry/selectors';
import {widgetAttribute} from 'widgets/selectors';
import {MediaLoadingSpinner} from './MediaLoadingSpinner.jsx'

export class TitleLoadingSpinner extends React.Component {
  render() {
    const {title, subtitle, entryTitle, invert} = this.props;
    
    return (
        <MediaLoadingSpinner>
          <h3 className={classNames('media_loading_spinner-titles', {'media_loading_spinner-invert': invert})}>
            <div className="media_loading_spinner-title">
              {title || entryTitle}
            </div>
            <div className="media_loading_spinner-subtitle">
              {subtitle}
            </div>
          </h3>
        </MediaLoadingSpinner>
      );
  }
}

export function register() {
  registerWidgetType('title_loading_spinner', {
    component: connect(combineSelectors({
      entryTitle: entryAttribute('title'),
      title: widgetAttribute('title', {role: 'loading_spinner'}),
      subtitle: widgetAttribute('subtitle', {role: 'loading_spinner'}),
      removeLogo: widgetAttribute('removeLogo', {role: 'loading_spinner'}),
      invert: widgetAttribute('invert', {role: 'loading_spinner'}),
    }))(TitleLoadingSpinner)
  });
}
