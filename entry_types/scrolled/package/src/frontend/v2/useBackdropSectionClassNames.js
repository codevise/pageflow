import {useIsomorphicLayoutEffect} from '../useIsomorphicLayoutEffect';
import {useFullscreenDimensions} from '../Fullscreen';

import styles from './Section.module.css';

export function useBackdropSectionClassNames(
  backdrop,
  {layout, exposeMotifArea, empty} = {}
) {
  const fullscreenDimensions = useFullscreenDimensions();

  return [
    styles.section,
    !fullscreenDimensions.height && styles.orientation,
    styles[`layout-${layout || 'left'}`],
    exposeMotifArea && !empty && styles.exposeMotifArea,
    useAspectRatioClassName(backdrop.file,
                            fullscreenDimensions),
    useAspectRatioClassName(backdrop.mobileFile,
                            fullscreenDimensions,
                            {mobile: true})
  ].filter(Boolean);
}

function useAspectRatioClassName(
  file, fullscreenDimensions, {mobile} = {}
) {
  const aspectRatio = file && file.isReady && getAspectRatio(file);
  const className = getAspectRatioClassName(aspectRatio,
                                            fullscreenDimensions,
                                            mobile);

  useAspectRatioStyleTag(
    aspectRatio,
    className,
    {orientation: mobile ? '(orientation: portrait) and ' : ''}
  );

  return className;
}

function getAspectRatioClassName(aspectRatio, fullscreenDimensions, mobile) {
  if (fullscreenDimensions.height) {
    return (!mobile || isPortrait(fullscreenDimensions)) &&
           hasAspectRatio(fullscreenDimensions, {min: aspectRatio}) &&
           'minAspectRatio';
  }
  else {
    const suffix = mobile ? 'Mobile' : '';
    return aspectRatio && `aspectRatio${suffix}${aspectRatio}`;
  }
}

function hasAspectRatio(rect, {min}) {
  return min && (getAspectRatio(rect) > min);
}

function isPortrait(rect) {
  return rect.width < rect.height;
}

function getAspectRatio(rect) {
  return Math.round(rect.width / rect.height * 1000);
}

function useAspectRatioStyleTag(aspectRatio, className, {orientation}) {
  useIsomorphicLayoutEffect(() => {
    // global variable is set in script tag inserted by
    // GeneratedMediaQueriesHelper when style tags have been rendered
    // on the server
    if (!global.pageflowScrolledSSRAspectRatioMediaQueries &&
        aspectRatio &&
        className) {
      ensureAspectRatioStyleTag(aspectRatio, className, orientation)
    }
  }, [aspectRatio, className]);
}

function ensureAspectRatioStyleTag(aspectRatio, className, orientation) {
  if (!document.head.querySelector(`[data-for="${className}"]`)) {
    const el = document.createElement('style');
    el.setAttribute('data-for', className);
    el.innerHTML = getAspectRatioCSS(aspectRatio, className, orientation);

    document.head.appendChild(el);
  }
}

function getAspectRatioCSS(aspectRatio, className, orientation) {
  if (className === 'minAspectRatio') {
    return getAspectRatioRule('minAspectRatio');
  }
  else {
    return `
      @media ${orientation}(min-aspect-ratio: ${aspectRatio}/1000) {
        ${getAspectRatioRule(className)}
      }
    `;
  }
}

function getAspectRatioRule(className) {
  // WARNING: This CSS snippet needs to be kept in sync with the
  // corresponding snippet in GeneratedMediaQueriesHelper
  return `
    section.${className} {
      --backdrop-positioner-transform: var(--backdrop-positioner-min-ar-transform);
      --backdrop-positioner-width: var(--backdrop-positioner-min-ar-width);
      --backdrop-positioner-height: var(--backdrop-positioner-min-ar-height);

      --motif-placeholder-width: var(--motif-placeholder-min-ar-width);

      --motif-display-top: var(--motif-display-min-ar-top);
      --motif-display-bottom: var(--motif-display-min-ar-bottom);
      --motif-display-height: var(--motif-display-min-ar-height);
    }
  `;
}
