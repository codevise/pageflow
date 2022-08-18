export function useBackdropSectionCustomProperties(backdrop) {
  return {
    ...backdropFileCustomProperties(backdrop.file),
    ...backdropFileCustomProperties(backdrop.mobileFile, 'mobile'),
  }
}

function backdropFileCustomProperties(backdropFile, prefix) {
  if (!backdropFile) {
    return {}
  }

  prefix = prefix ? `${prefix}-` : '';

  return backdropFile ? {
    [`--${prefix}backdrop-w`]: backdropFile.width,
    [`--${prefix}backdrop-h`]: backdropFile.height,
    ...motifAreaCustomProperties(backdropFile.motifArea, prefix)
  } : {};
}

function motifAreaCustomProperties(motifArea, prefix) {
  return motifArea ? {
    [`--${prefix}motif-t`]: motifArea.top,
    [`--${prefix}motif-l`]: motifArea.left,
    [`--${prefix}motif-w`]: motifArea.width,
    [`--${prefix}motif-h`]: motifArea.height
  } : {};
}
