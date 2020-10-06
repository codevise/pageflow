export function useBackgroundFile({file, motifArea, containerDimension}) {
  if (!file) {
    return null ;
  }

  motifArea = motifArea !== undefined ? motifArea : file.configuration.motifArea;

  const originalRatio = file.width / file.height;
  const containerRatio = containerDimension.width / containerDimension.height;
  const scale = containerRatio > originalRatio ?
                containerDimension.width / file.width :
                containerDimension.height / file.height;

  const displayWidth = file.width * scale;
  const displayHeight = file.height * scale;

  return {
    ...file,
    motifArea,
    motifAreaOffsetRect: motifArea && {
      top: Math.round(displayHeight * motifArea.top / 100),
      left: Math.round(displayWidth * motifArea.left / 100),
      width: Math.round(displayWidth * motifArea.width / 100),
      height: Math.round(displayHeight * motifArea.height / 100)
    }
  };
}
