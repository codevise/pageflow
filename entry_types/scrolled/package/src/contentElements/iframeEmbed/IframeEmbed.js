import React from 'react';
import classNames from 'classnames';

import {
  ContentElementBox,
  ContentElementFigure,
  FitViewport,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  useContentElementEditorState,
  useContentElementLifecycle,
  usePortraitOrientation,
  utils
} from 'pageflow-scrolled/frontend';

import {useIframeHeight} from './useIframeHeight';

import styles from './IframeEmbed.module.css';

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};

export function IframeEmbed({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();
  const portraitOrientation = usePortraitOrientation();
  const height = useIframeHeight({src: configuration.source,
                                  active: configuration.autoResize})

  const aspectRatio = portraitOrientation && configuration.portraitAspectRatio ?
                      configuration.portraitAspectRatio :
                      configuration.aspectRatio;

  function renderSpanningWrapper(children) {
    if (configuration.autoResize) {
      return (
        <div style={{height}}>
          {children}
        </div>
      );
    }
    else {
      return (
        <FitViewport.Content>
          {children}
        </FitViewport.Content>
      )
    }
  }

  return (
    <div className={styles.wrapper}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport aspectRatio={aspectRatios[aspectRatio || 'wide']}
                   opaque={utils.isBlank(configuration.source)}>
        <ContentElementBox>
          <ContentElementFigure configuration={configuration}>
            {renderSpanningWrapper(
              <ThirdPartyOptIn>
                {shouldLoad &&
                 <iframe className={classNames(styles.iframe,
                                               styles[`scale-${configuration.scale}`])}
                         title={configuration.title}
                         src={configuration.source} />}
              </ThirdPartyOptIn>
            )}
            <OptOutInfo configuration={configuration} />
          </ContentElementFigure>
        </ContentElementBox>
      </FitViewport>
    </div>
  );
}

function OptOutInfo({configuration}) {
  if (!configuration.requireConsent) {
    return null;
  }

  return (
    <ThirdPartyOptOutInfo />
  );
}
