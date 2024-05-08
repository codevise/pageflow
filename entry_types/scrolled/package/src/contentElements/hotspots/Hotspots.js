import React, {useState} from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
  useContentElementEditorCommandSubscription,
  useContentElementLifecycle,
  useFileWithInlineRights,
  InlineFileRights
} from 'pageflow-scrolled/frontend';

import {Area} from './Area';

import styles from './Hotspots.module.css';

export function Hotspots({contentElementId, contentElementWidth, configuration}) {
  const imageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'image'
  });

  const {shouldLoad} = useContentElementLifecycle();

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
                      highlighted={highlightedIndex === index}
                      area={area}/>
              )}
            </div>
            <InlineFileRights context="insideElement" items={[{file: imageFile, label: 'image'}]} />
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      <InlineFileRights context="afterElement" items={[{file: imageFile, label: 'image'}]} />
    </FitViewport>
  );
}