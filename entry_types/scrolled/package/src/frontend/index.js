import './webpackPublicPath';
import './polyfills';
import './globalNotices.module.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {Entry} from './Entry';
import {setupI18n} from './i18n';

import './global.module.css';

import styles from './foregroundBoxes/GradientBox.module.css';

import {RootProviders} from './RootProviders';
import {loadInlineEditingComponents} from './inlineEditing';
import {loadDashUnlessHlsSupported} from './dash';
import {registerConsentVendors} from './thirdPartyConsent';

import {browser, consent, features} from 'pageflow/frontend';
import {api} from './api';

const editMode = (typeof window !== 'undefined') && window.location.pathname.indexOf('/editor/entries') === 0;

export const withShadowClassName = styles.withShadow;

export {api as frontend} from './api';

export * from './Image';
export * from './Figure';
export * from './Text';

export * from './MediaPlayer';
export * from './VideoPlayer';
export * from './AudioPlayer';
export * from './Atmo';
export * from './useAtmo';

export {ContentElementBox} from './ContentElementBox';
export {ContentElementFigure} from './ContentElementFigure';
export {MediaInteractionTracking} from './MediaInteractionTracking';
export {MediaPlayerControls} from './MediaPlayerControls';
export {VideoPlayerControls} from './VideoPlayerControls';
export {AudioPlayerControls} from './AudioPlayerControls';
export {PlayerControls, ClassicPlayerControls, WaveformPlayerControls} from './PlayerControls';
export {PlayerEventContextDataProvider} from './useEventContextData';

export {Panorama} from './Panorama';
export {ExpandableImage} from './ExpandableImage';
export {ToggleFullscreenCornerButton} from './ToggleFullscreenCornerButton';
export {FullscreenViewer} from './FullscreenViewer';
export {PaginationIndicator} from './PaginationIndicator';

export * from './useOnScreen';
export * from './i18n';

export * from './SectionThumbnail';
export {Entry} from './Entry';
export {useAudioFocus} from './useAudioFocus';
export {useDarkBackground} from './backgroundColor';
export {useBackgroundFile} from './v1/useBackgroundFile';

export {
  useAdditionalSeedData,
  useChapters,
  useCredits,
  useCutOff,
  useDarkWidgets,
  useEntryMetadata,
  useEntryStateDispatch,
  useEntryTranslations,
  useFile,
  useFileRights,
  useFileWithInlineRights,
  useLegalInfo,
  useMainChapters,
  useTheme,
  useShareProviders,
  useShareUrl
} from '../entryState';

export {ContentElementAttributesProvider} from './useContentElementAttributes';
export {useContentElementConfigurationUpdate} from './useContentElementConfigurationUpdate';
export {
  useContentElementEditorCommandSubscription,
  ContentElementEditorCommandEmitterContext
} from './useContentElementEditorCommandSubscription';
export {
  useContentElementEditorState,
  ContentElementEditorStateContext
} from './useContentElementEditorState';
export {
  useContentElementLifecycle,
  ContentElementLifecycleContext
} from './useContentElementLifecycle';
export {useCurrentChapter} from './useCurrentChapter';
export {useIsStaticPreview} from './useScrollPositionLifecycle';
export {useMediaMuted, useOnUnmuteMedia} from './useMediaMuted';
export {usePortraitOrientation} from './usePortraitOrientation';
export {useScrollPosition} from './useScrollPosition';
export {usePhonePlatform} from './usePhonePlatform';
export {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

export {EditableTable} from './EditableTable';
export {EditableText} from './EditableText';
export {EditableInlineText} from './EditableInlineText';
export {EditableLink} from './EditableLink';
export {LinkTooltipProvider} from './LinkTooltipProvider';
export {PhonePlatformContext} from './PhonePlatformContext';
export {
  OptIn as ThirdPartyOptIn,
  OptOutInfo as ThirdPartyOptOutInfo,
  useConsentRequested
} from './thirdPartyConsent';
export {FitViewport} from './FitViewport';
export {Tooltip} from './Tooltip';
export {ThemeIcon} from './ThemeIcon';
export {InlineFileRights} from './InlineFileRights';
export {useFloatingPortalRoot, FloatingPortalRootProvider} from './FloatingPortalRootProvider';
export {SectionIntersectionObserver} from './SectionIntersectionObserver';
export {ScrollButton} from './ScrollButton';

export {textColorForBackgroundColor} from './textColorForBackgroundColor';
export {getTransitionNames, getAvailableTransitionNames} from './transitions';

export {RootProviders, registerConsentVendors};
export {default as registerTemplateWidgetType} from './registerTemplateWidgetType';
export {Widget} from './Widget';
export {SelectableWidget} from './SelectableWidget';
export {WidgetSelectionRect} from './WidgetSelectionRect';

export {utils} from './utils';
export {paletteColor} from './paletteColor';
export {
  widths as contentElementWidths,
  widthName as contentElementWidthName
} from './layouts';

export {LinkButton} from './LinkButton';

global.pageflowScrolledRender = async function(seed) {
  setupI18n(seed.i18n);

  features.enable('frontend', seed.config.enabledFeatureNames)
  await browser.detectFeatures();
  await loadDashUnlessHlsSupported(seed);

  if (editMode) {
    await loadInlineEditingComponents();
  }
  else {
    registerConsentVendors({
      contentElementTypes: api.contentElementTypes,
      consent,
      seed
    });
  }

  render(seed);
}

global.pageflowScrolledRegisterUpdateSeedHandler = function() {
  if (window.parent !== window) {
    window.addEventListener('message', receive);
  }

  function receive(message) {
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'UPDATE_SEED') {
        render(message.data.payload);
      }
    }
  }
}

function render(seed) {
  if (editMode) {
    ReactDOM.render(<Root seed={seed} />, document.getElementById('root'));
  }
  else {
    ReactDOM.hydrate(<Root seed={seed} />, document.getElementById('root'));
  }
}

export function Root({seed}) {
  return (
    <RootProviders seed={seed}>
      <Entry />
    </RootProviders>
  );
}
