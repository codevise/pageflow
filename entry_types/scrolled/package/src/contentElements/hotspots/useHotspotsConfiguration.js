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

  const areas = useMemo(() => configuration.areas || [], [configuration.areas]);

  return {
    panZoomEnabled: usePanZoomEnabled(configuration),
    areas,
    imageFile,
    portraitMode
  };
}

function usePanZoomEnabled(configuration) {
  const isPhonePlatform = usePhonePlatform();

  return configuration.enablePanZoom === 'always' ||
         (configuration.enablePanZoom === 'phonePlatform' && isPhonePlatform);
}
