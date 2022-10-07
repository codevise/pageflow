export function useBackdropFileCustomProperties(backdrop) {
  return {
    ...backdropFileCustomProperties(backdrop.file),
    ...backdropFileCustomProperties(backdrop.mobileFile, 'mobile-'),
  }
}

export function useBackdropMotifAreaCustomProperties(backdrop) {
  return {
    ...motifAreaCustomProperties(backdrop.file),
    ...motifAreaCustomProperties(backdrop.mobileFile, 'mobile-'),
  }
}

function backdropFileCustomProperties(backdropFile, prefix = '') {
  if (!backdropFile || !backdropFile.isReady) {
    return {};
  }

  return backdropFile ? {
    [`--${prefix}backdrop-w`]: backdropFile.width,
    [`--${prefix}backdrop-h`]: backdropFile.height,
  } : {};
}

function motifAreaCustomProperties(backdropFile, prefix = '') {
  if (!backdropFile) {
    return {};
  }

  const zoom = backdropFile.effects?.find(effect => effect.name === 'zoom');

  return backdropFile.motifArea ? {
    [`--${prefix}backdrop-zoom`]: zoom?.value,
    [`--${prefix}motif-t`]: backdropFile.motifArea.top,
    [`--${prefix}motif-l`]: backdropFile.motifArea.left,
    [`--${prefix}motif-w`]: backdropFile.motifArea.width,
    [`--${prefix}motif-h`]: backdropFile.motifArea.height
  } : {};
}
