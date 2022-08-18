import {useIsomorphicLayoutEffect} from '../useIsomorphicLayoutEffect';

import styles from './Section.module.css';

export function useBackdropSectionClassNames(
  backdrop,
  {layout, exposeMotifArea, empty} = {}
) {
  return [
    styles.section,
    styles[`layout-${layout || 'left'}`],
    exposeMotifArea && !empty && styles.exposeMotifArea,
    useBackdropSectionClassName(backdrop.file),
    useBackdropSectionClassName(backdrop.mobileFile,
                                'Mobile',
                                '(orientation: portrait) and '),
  ].filter(Boolean);
}

function useBackdropSectionClassName(file, suffix = '', orientation = '') {
  const aspectRatio = file && file.isReady &&
                      Math.round(file.width / file.height * 1000);
  const className = aspectRatio && `aspectRatio${suffix}${aspectRatio}`;

  useAspectRatioMediaQueryStyleTag(aspectRatio, className, orientation);

  return className;
}

function useAspectRatioMediaQueryStyleTag(aspectRatio, className, orientation) {
  useIsomorphicLayoutEffect(() => {
    // global variable is set in script tag inserted by
    // GeneratedMediaQueriesHelper when style tags have been rendered
    // on the server
    if (!global.pageflowScrolledSSRAspectRatioMediaQueries &&
        aspectRatio) {
      ensureAspectRatioMediaQueryStyleTag(aspectRatio, className, orientation)
    }
  }, [aspectRatio, className]);
}

function ensureAspectRatioMediaQueryStyleTag(aspectRatio, className, orientation) {
  console.log('checking style tag', aspectRatio);
  if (!document.head.querySelector(`[data-for="${className}"]`)) {
    console.log('appending style tag', aspectRatio);

    const el = document.createElement('style');
    el.setAttribute('data-for', className);

    // WARNING: This CSS snippet needs to be kept in sync with the
    // corresponding snippet in GeneratedMediaQueriesHelper
    el.innerHTML = `
      @media ${orientation}(min-aspect-ratio: ${aspectRatio}/1000) {
        section.${className} {
           --backdrop-positioner-transform: var(--backdrop-positioner-min-ar-transform);
           --backdrop-positioner-width: var(--backdrop-positioner-min-ar-width);
           --backdrop-positioner-height: var(--backdrop-positioner-min-ar-height);

           --motif-placeholder-width: var(--motif-placeholder-min-ar-width);

           --motif-display-top: var(--motif-display-min-ar-top);
           --motif-display-bottom: var(--motif-display-min-ar-bottom);
           --motif-display-height: var(--motif-display-min-ar-height);
        }
      }
    `;

    document.head.appendChild(el);
  }
}
