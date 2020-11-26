/**
 * Extend image or video file with position/motif area related
 * properties that are needed to use the file as a section backdrop.
 *
 * The added properties are:
 *
 * `cropPosition`: Position in percent that can be used as
 * `background-position` or `object-position` to center the given
 * motif area in the container.
 *
 * `motifAreaOffsetRect`: Pixel position and size of the motif area in
 * the container assuming the crop position has been applied.
 *
 * `motifArea`: Either the passed motif area object or the motif area
 * from the legacy file configuration if no motif area has been
 * passed.
 *
 * @param {Object} options
 * @param {Object} options.file - Image or video file obtained via
 * `useFile`.
 * @param {Object} options.motifArea - Section specific setting
 * specifying motif area rect in percent.
 * @param {Object} options.containerDimension - Width and height in
 *   pixels of the container (normally the backdrop) the file shall be
 *   displayed as background of.
 *
 * @private
 */
export function useBackgroundFile({file, motifArea, containerDimension}) {
  if (!file) {
    return null ;
  }

  // Calculate scale factor required to make the file cover the container:

  const originalRatio = file.width / file.height;
  const containerRatio = containerDimension.width / containerDimension.height;
  const scale = containerRatio > originalRatio ?
                containerDimension.width / file.width :
                containerDimension.height / file.height;

  // Calculate the pixel size the image will have inside the container:

  const displayFileWidth = file.width * scale;
  const displayFileHeight = file.height * scale;

  // Calculate the pixel position of the center of the motif area in
  // the scaled image:

  const motifCenterX = motifArea ? motifArea.left + motifArea.width / 2 : 50;
  const motifCenterY = motifArea ? motifArea.top + motifArea.height / 2 : 50;

  const displayMotifCenterX = motifCenterX * displayFileWidth / 100;
  const displayMotifCenterY = motifCenterY * displayFileHeight / 100;

  // If the x-axis position (inside the image) of the center of the
  // motif area is smaller than `A = containerDimension.width / 2`, we
  // need to set the crop position to 0% to ensure that the full width
  // motif area is visible:
  //
  //     center of motif area
  //      |
  //   oXXXXXooo...........
  //   |-A-|
  //
  // Legend:
  //   o: Part of the image that is visible in the container
  //   .: Part of the image that is clipped
  //   X: Part of the motif area that is visible in the container
  //   x: Part of the motif area that is clipped
  //
  // If the x-axis position (inside the image) of the center of the
  // motif area is greater than
  // `B = image.width - containerDimension.width / 2`, we need to set the
  // crop position to 100%:
  //
  //   ............oooXXXXXo
  //   |-------B-------|
  //
  // For positions between A and B we want to linearly shift the crop
  // position to ensure the center of the motif area is centered in
  // the container:
  //
  //   ...ooXXXXXoo.........
  //
  // This also applies if the motif area is wider than the container:
  //
  //   .xxXXXXXXXXXxx.......
  //

  const Ax = containerDimension.width / 2;
  const Ay = containerDimension.height / 2

  const Bx = displayFileWidth - containerDimension.width / 2;
  const By = displayFileHeight - containerDimension.height / 2;

  const cropPosition = {
    x: Bx - Ax > 0 ?
       Math.min(100, Math.max(0, ((displayMotifCenterX - Ax) / (Bx - Ax) * 100))) :
       50,
    y: By - Ay > 0 ?
       Math.min(100, Math.max(0, ((displayMotifCenterY - Ay) / (By - Ay) * 100))) :
       50
  };

  // Calculate the amount of pixels the image will be shifted
  // when the crop position is applied:

  const cropLeft = (displayFileWidth - containerDimension.width) * cropPosition.x / 100;
  const cropTop = (displayFileHeight - containerDimension.height) * cropPosition.y / 100;

  // Calculate the pixel position and dimension of the motif area
  // relative to the container assuming the crop position has been
  // applied:

  const motifAreaOffsetRect = motifArea && {
    top: Math.round(displayFileHeight * motifArea.top / 100 - cropTop),
    left: Math.round(displayFileWidth * motifArea.left / 100 - cropLeft),
    width: Math.round(displayFileWidth * motifArea.width / 100),
    height: Math.round(displayFileHeight * motifArea.height / 100)
  };

  return {
    ...file,
    cropPosition,
    motifArea,
    motifAreaOffsetRect
  };
}
