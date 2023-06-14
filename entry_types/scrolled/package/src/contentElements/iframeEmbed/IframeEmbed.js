import React from 'react';
import classNames from 'classnames';

import {
  ContentElementBox,
  ContentElementFigure,
  FitViewport,
  useContentElementEditorState,
  useContentElementLifecycle,
  usePortraitOrientation,
  utils
} from 'pageflow-scrolled/frontend';

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

  const aspectRatio = portraitOrientation && configuration.portraitAspectRatio ?
                      configuration.portraitAspectRatio :
                      configuration.aspectRatio;

  return (
    <div className={styles.wrapper}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport aspectRatio={aspectRatios[aspectRatio || 'wide']}
                   opaque={utils.isBlank(configuration.source)}>
        <ContentElementBox>
          <ContentElementFigure configuration={configuration}>
            <FitViewport.Content>
              {shouldLoad &&
               <iframe className={classNames(styles.iframe,
                                             styles[`scale-${configuration.scale}`])}
                       title={configuration.title}
                       src={configuration.source} />}
            </FitViewport.Content>
          </ContentElementFigure>
        </ContentElementBox>
      </FitViewport>
    </div>
  );
}
