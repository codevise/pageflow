import {useMemo} from 'react';

import {
  useFileWithInlineRights,
  usePhonePlatform,
  usePortraitOrientation
} from 'pageflow-scrolled/frontend';

export function useHotspotsConfiguration(configuration) {
  const defaultImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'portraitImage'
  });
  const portraitOrientation = usePortraitOrientation();

  const portraitMode = !!(portraitOrientation && portraitImageFile);
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;

  return {
    panZoomEnabled: usePanZoomEnabled(configuration),
    areas: useAreas(configuration, portraitMode),
    imageFile,
    portraitMode
  };
}

function useAreas(configuration, portraitMode) {
  return useMemo(() => {
    return (configuration.areas || []).map(area => {
      if (portraitMode) {
        return applyAreaDefaults({
          ...area,
          outline: area.portraitOutline,
          zoom: area.portraitZoom,
          activeImage: area.portraitActiveImage,
          fallbackActiveImage: area.activeImage,
          indicatorPosition: area.portraitIndicatorPosition,
          color: area.portraitColor || area.color,
          tooltipReference: area.portraitTooltipReference,
          tooltipPosition: area.portraitTooltipPosition,
          tooltipMaxWidth: area.portraitTooltipMaxWidth
        });
      }
      else {
        return applyAreaDefaults(area);
      }
    });
  }, [configuration.areas, portraitMode]);
}

function applyAreaDefaults(area) {
  return {
    ...area,
    outline: area.outline?.length ? area.outline : [[50, 50]],
    zoom: area.zoom || 0,
    indicatorPosition: area.indicatorPosition || [50, 50],
  };
}

function usePanZoomEnabled(configuration) {
  const isPhonePlatform = usePhonePlatform();

  return configuration.enablePanZoom === 'always' ||
         (configuration.enablePanZoom === 'phonePlatform' && isPhonePlatform);
}
