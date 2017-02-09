export default function(videoFile, fit, position, wrapperDimensions) {
  if (!wrapperDimensions || !wrapperDimensions.height ||
      !fit || fit == 'contain') {
    return;
  }

  let videoWidth, videoHeight, factor;

  const videoRatio = videoFile.width / videoFile.height;
  const wrapperRatio = wrapperDimensions.width / wrapperDimensions.height;

  const scaleToFit = wrapperRatio > videoRatio ? 'width' : 'height';

  if (scaleToFit == 'width') {
    videoHeight = wrapperDimensions.height;
    videoWidth = videoHeight * videoRatio;

    factor = wrapperDimensions.width / videoWidth;
  }
  else {
    videoWidth = wrapperDimensions.width;
    videoHeight = videoWidth / videoRatio;

    factor = wrapperDimensions.height / videoHeight;
  }

  if (fit == 'smart_contain' && factor > 1.2) {
    return;
  }

  const width = videoWidth * factor;
  const height = videoHeight * factor;

  const positionX = position[0] !== undefined && fit == 'cover' ? position[0] : 50;
  const positionY = position[1] !== undefined && fit == 'cover' ? position[1] : 50;

  return {
    left: (wrapperDimensions.width - width) * positionX / 100,
    top: (wrapperDimensions.height - height) * positionY / 100,
    width,
    height,
  };
}
