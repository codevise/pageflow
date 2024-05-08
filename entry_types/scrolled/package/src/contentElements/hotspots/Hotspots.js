import React from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
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
