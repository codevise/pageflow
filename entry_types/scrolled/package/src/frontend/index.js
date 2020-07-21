import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';

import {AppHeader} from './navigation/AppHeader';
import Entry from './Entry';
import {setupI18n} from './i18n';

import './global.module.css';

import styles from './foregroundBoxes/GradientBox.module.css';

import {RootProviders} from './RootProviders';
import {loadInlineEditingComponents} from './inlineEditing';

import {browser} from 'pageflow/frontend';

const editMode = window.location.pathname.indexOf('/editor/entries') === 0;

export const withShadowClassName = styles.withShadow;

export {api as frontend} from './api';

export * from './Image';
export * from './Figure';
export * from './Text';

export * from './MediaPlayer';
export * from './VideoPlayer';
export * from './AudioPlayer';
export * from './Atmo';

export {MediaInteractionTracking} from './MediaInteractionTracking';
export {MediaPlayerControls} from './MediaPlayerControls';
export {VideoPlayerControls} from './VideoPlayerControls';
export {AudioPlayerControls} from './AudioPlayerControls';
export {PlayerControls} from './PlayerControls';

export * from './useOnScreen';
export * from './i18n';

export * from './SectionThumbnail';
export {default as Entry} from './Entry';
export {useDarkBackground} from './backgroundColor';
export {useFile} from '../entryState'
export {useContentElementConfigurationUpdate} from './useContentElementConfigurationUpdate';
export {useContentElementEditorCommandSubscription} from './useContentElementEditorCommandSubscription';
export {useContentElementEditorState} from './useContentElementEditorState';
export {useContentElementLifecycle} from './useContentElementLifecycle';

export {ViewportDependentPillarBoxes} from './ViewportDependentPillarBoxes';
export {EditableText} from './EditableText';
export {EditableInlineText} from './EditableInlineText';

export {getTransitionNames, getAvailableTransitionNames} from './transitions';

export {RootProviders};
export {default as registerTemplateWidgetType} from './registerTemplateWidgetType';

window.pageflowScrolledRender = function(seed) {
  setupI18n(seed.i18n);
  browser.detectFeatures().then(function(){
    if (editMode) {
      loadInlineEditingComponents().then(() => render(seed));
    }
    else {
      render(seed);
    }
  });
}

function render(seed) {
  ReactDOM.render(<Root seed={seed} />, document.getElementById('root'));
}

function Root({seed}) {
  return (
    <RootProviders seed={seed}>
      <AppHeader />
      <Entry />
    </RootProviders>
  );
}
