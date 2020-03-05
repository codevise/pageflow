import React from 'react';
import {useFile} from '../entryState';

export function useImageAlt({permaId}) {
  const image = useFile({collectionName: 'imageFiles', permaId: permaId});

  if (image) {
    return image.configuration.alt;
  }

  return null;
}
