import {useFile} from '../entryState';

export function useBackdrop({backdrop, backdropEffects, backdropEffectsMobile}) {
  const videoFile = useBackdropFile({
    permaId: backdrop.video,
    collectionName: 'videoFiles',
    motifArea: backdrop.videoMotifArea,
    effects: backdropEffects
  });
  const imageFile = useBackdropFile({
    permaId: backdrop.image,
    collectionName: 'imageFiles',
    motifArea: backdrop.imageMotifArea,
    effects: backdropEffects
  });
  const mobileImageFile = useBackdropFile({
    permaId: backdrop.imageMobile,
    collectionName: 'imageFiles',
    motifArea: backdrop.imageMobileMotifArea,
    effects: backdropEffectsMobile
  });

  if (videoFile) {
    return {
      type: 'video',
      file: videoFile
    };
  }
  if (backdrop.color ||
      (backdrop.image && backdrop.image.toString().startsWith('#'))) {
    return {
      type: 'color',
      color: backdrop.color || backdrop.image
    };
  }
  else {
    return {
      type: 'image',
      file: imageFile || mobileImageFile,
      mobileFile: imageFile && mobileImageFile
    };
  }
}

export function useBackdropFile({permaId, collectionName, motifArea, effects}) {
  const file = useFile({permaId, collectionName});

  return file && {
    ...file,
    motifArea,
    effects
  };
}
