/**
 * Extend image or video file with position/motif area related
 * properties that are needed to use the file as a section backdrop.
 *
 * The added properties are:
 *
 * `motifArea`: Either the passed motif area object or the motif area
 * from the legacy file configuration if no motif area has been
 * passed.
 *
 * `effects`: List of backdrop effects to apply.
 *
 * @param {Object} options
 * @param {Object} options.file - Image or video file obtained via
 * `useFile`.
 * @param {Object} options.motifArea - Section specific setting
 * specifying motif area rect in percent.
 * @param {Object[]} options.effects - List of backdrop effects.
 *
 * @private
 */
export function useBackgroundFile({file, motifArea, effects}) {
  if (!file) {
    return null ;
  }

  return {
    ...file,
    cropPosition: {x: 0, y: 0},
    motifArea,
    effects
  };
}
