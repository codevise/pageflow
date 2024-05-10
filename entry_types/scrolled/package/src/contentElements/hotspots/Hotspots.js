import React, {useEffect, useState} from 'react';

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
import {Tooltip, insideTooltip} from './Tooltip';

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

  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const portraitMode = portraitOrientation && portraitImageFile
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;

  const hasActiveArea = activeIndex >= 0;

  useEffect(() => {
    if (hasActiveArea) {
      document.body.addEventListener('click', handleClick);
      return () => document.body.removeEventListener('click', handleClick);
    }

    function handleClick(event) {
      if (!insideTooltip(event.target)) {
        setActiveIndex(-1);
      }
    }
  }, [hasActiveArea]);

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
                      contentElementId={contentElementId}
                      portraitMode={portraitMode}
                      highlighted={hoveredIndex === index || highlightedIndex === index || activeIndex === index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(-1)}
                      onClick={() => setActiveIndex(index)} />
              )}
            </div>
            <InlineFileRights context="insideElement" items={[{file: imageFile, label: 'image'}]} />
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      {areas.map((area, index) =>
        <Tooltip key={index}
                 area={area}
                 contentElementId={contentElementId}
                 portraitMode={portraitMode}
                 configuration={configuration}
                 visible={activeIndex === index ||
                          (activeIndex < 0 && hoveredIndex === index)}
                 onMouseEnter={() => setHoveredIndex(index)}
                 onMouseLeave={() => setHoveredIndex(-1)}
                 onClick={() => setActiveIndex(index)} />
      )}
      <InlineFileRights context="afterElement" items={[{file: imageFile, label: 'image'}]} />
    </FitViewport>
  );
}
