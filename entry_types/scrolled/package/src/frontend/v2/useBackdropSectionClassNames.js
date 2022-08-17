import {useIsomorphicLayoutEffect} from '../useIsomorphicLayoutEffect';

import styles from './Section.module.css';

export function useBackdropSectionClassNames(backdrop) {
  return [
    styles.section,
    useBackdropSectionClassName(backdrop.file),
    useBackdropSectionClassName(backdrop.mobileFile, 'Mobile'),
  ].filter(Boolean);
}

function useBackdropSectionClassName(file, suffix = '') {
  const aspectRatio = file && Math.round(file.width / file.height * 1000);
  const className = aspectRatio && `aspectRatio${suffix}${aspectRatio}`;

  useAspectRatioMediaQueryStyleTag(aspectRatio, className);

  return className;
}

function useAspectRatioMediaQueryStyleTag(aspectRatio, className) {
  useIsomorphicLayoutEffect(() => {
    // global variable is set in script tag inserted by
    // GeneratedMediaQueriesHelper when style tags have been rendered
    // on the server
    if (!global.pageflowScrolledSSRAspectRatioMediaQueries &&
        aspectRatio) {
      ensureAspectRatioMediaQueryStyleTag(aspectRatio, className)
    }
  }, [aspectRatio, className]);
}

function ensureAspectRatioMediaQueryStyleTag(aspectRatio, className) {
  console.log('checking style tag', aspectRatio);
  if (!document.head.querySelector(`[data-for="${className}"]`)) {
    console.log('appending style tag', aspectRatio);

    const el = document.createElement('style');
    el.setAttribute('data-for', className);

    // WARNING: This CSS snippet needs to be kept in sync with the
    // corresponding snippet in GeneratedMediaQueriesHelper
    el.innerHTML = `
      @media (min-aspect-ratio: ${aspectRatio}/1000) {
        section.${className} {
           --backdrop-positioner-transform: var(--backdrop-positioner-min-ar-transform);
           --backdrop-positioner-width: var(--backdrop-positioner-min-ar-width);
           --backdrop-positioner-height: var(--backdrop-positioner-min-ar-height);

           --motif-placeholder-width: var(--motif-placeholder-min-ar-width);
           --motif-placeholder-height: var(--motif-placeholder-min-ar-height);
        }
      }
    `;

    document.head.appendChild(el);
  }
}
