import React, {useState} from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
  useContentElementEditorCommandSubscription,
  useContentElementLifecycle,
  useFileWithInlineRights,
  usePortraitOrientation,
  InlineFileRights
} from 'pageflow-scrolled/frontend';

import {Area} from './Area';
import {Tooltip} from './Tooltip';

import styles from './Hotspots.module.css';

export function Hotspots({contentElementId, contentElementWidth, configuration}) {
  const defaultImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'portraitImage'
  });
  const portraitOrientation = usePortraitOrientation();

  const {shouldLoad} = useContentElementLifecycle();

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const portraitMode = portraitOrientation && portraitImageFile
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_AREA') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_AREA_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
  });

  const areas = configuration.areas || [];

  return (
    <FitViewport file={imageFile}
                 aspectRatio={imageFile ? undefined : 0.75}
                 fill={configuration.position === 'backdrop'}
                 opaque={!imageFile}>
      <ContentElementBox>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <div className={styles.wrapper}>
              <Image imageFile={imageFile}
                     load={shouldLoad}
                     fill={false}
                     structuredData={true}
                     variant="large"
                     preferSvg={true} />
              {areas.map((area, index) =>
                <Area key={index}
                      area={area}
                      portraitMode={portraitMode}
                      highlighted={highlightedIndex === index} />
              )}
            </div>
            <InlineFileRights context="insideElement" items={[{file: imageFile, label: 'image'}]} />
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      {areas.map((area, index) =>
        <Tooltip key={index}
                 area={area}
                 portraitMode={portraitMode}
                 configuration={configuration} />
      )}
      <InlineFileRights context="afterElement" items={[{file: imageFile, label: 'image'}]} />
    </FitViewport>
  );
}
