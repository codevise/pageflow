import React from 'react';
import {useFile} from '../entryState';

export function useImageUrl({permaId, quality='large'}) {
  const image = useFile({collectionName: 'imageFiles', permaId: permaId});

  if (image) {
    return image.urls[quality];
  }

  return null;
}
