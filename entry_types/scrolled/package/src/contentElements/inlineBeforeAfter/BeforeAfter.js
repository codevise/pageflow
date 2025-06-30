import React, {useEffect, useState} from 'react';
import ReactCompareImage from 'react-compare-image';
import Measure from 'react-measure';

import styles from './BeforeAfter.module.css';
import cx from 'classnames';
import {
  useFileWithInlineRights,
  useContentElementEditorState,
  ContentElementBox,
  ContentElementFigure,
  FitViewport,
  InlineFileRights
} from 'pageflow-scrolled/frontend';

const placeholderForBeforeImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiMzZDVhODAiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';
const placeholderForAfterImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiM5OGMxZDkiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';

const placeholderFile = {
  width: 640,
  height: 403
};

export function BeforeAfter(configuration) {
  const {
    isActive,
    load,
    before_label,
    after_label,
    initial_slider_position,
    slider_color
  } = configuration;

  const [wiggle, setWiggle] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    // Only wiggle once per element, when it is active for the first
    // time
    setWiggle(wiggle => wiggle || isActive);
  }, [isActive]);

  const beforeImage = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'before_id'
  });
  const afterImage = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'after_id'
  });

  const {isSelected} = useContentElementEditorState();
  const beforeImageUrl = beforeImage && beforeImage.urls.large;
  const beforeImageAlt = beforeImage && beforeImage.configuration.alt;
  const afterImageUrl = afterImage && afterImage.urls.large;
  const afterImageAlt = afterImage && afterImage.configuration.alt;
  const initialSliderPos = initial_slider_position / 100;

  const inlineFileRightsItems = [
    {file: beforeImage, label: 'before'},
    {file: afterImage, label: 'after'},
  ];

  return (
    <FitViewport file={beforeImage || afterImage || placeholderFile}
                 fill={configuration.position === 'backdrop'}>
      <ContentElementBox>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <Measure bounds>
              {({measureRef, contentRect}) => {
                const initialRectWidth = contentRect.bounds.width * initialSliderPos + 'px';

                return (
                  <div ref={measureRef}
                       style={{'--initial-rect-width': initialRectWidth}}
                       className={cx({[styles.selected]: isSelected,
                                      [styles.wiggle]: wiggle && !moved},
                                     styles.container)}>
                    <InitialSliderPositionIndicator parentSelected={isSelected}
                                                    position={initial_slider_position}/>
                    {renderCompareImage()}
                  </div>
                );
              }}
            </Measure>
            <InlineFileRights configuration={configuration}
                              context="insideElement"
                              items={inlineFileRightsItems} />
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      <InlineFileRights configuration={configuration}
                        context="afterElement"
                        items={inlineFileRightsItems} />
    </FitViewport>
  );

  function renderCompareImage() {
    if (!load) {
      return null;
    }

    return (
      <ReactCompareImage leftImage={beforeImage? beforeImageUrl : placeholderForBeforeImage}
                         rightImage={afterImage? afterImageUrl : placeholderForAfterImage}
                         leftImageLabel={before_label} rightImageLabel={after_label}
                         leftImageAlt={beforeImageAlt} rightImageAlt={afterImageAlt}
                         sliderPositionPercentage={initialSliderPos}
                         onSliderPositionChange={() => setMoved(true)}
                         sliderLineColor={slider_color || undefined} />
    );
  }
};

function InitialSliderPositionIndicator({parentSelected, position}) {
  const indicatorWidth = '2px';
  const indicatorStyles = {
          left: `calc(${position}% - ${indicatorWidth}/2)`,
          width: `${indicatorWidth}`,
          height: '100%',
          borderLeft: '1px solid black',
          borderRight: '1px solid black',
  };

  // In case this element is selected, and its initial slider position
  // is not in the middle, we show InitialSliderPositionIndicator
  return parentSelected && (position !== 50) ?
      <div className={styles.sliderStart} style={indicatorStyles}/> :
        '';
}
