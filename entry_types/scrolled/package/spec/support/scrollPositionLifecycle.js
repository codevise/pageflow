import {SectionLifecycleContext} from 'frontend/useSectionLifecycle';
import {isActiveProbe} from 'frontend/useScrollPositionLifecycle.module.css';

import {renderInEntryWithScrollPositionLifecycle} from 'testHelpers/scrollPositionLifecycle';

export function findIsActiveProbe(el) {
  return findProbe(el, isActiveProbe);
}

// For now the element itself is used as probe. We keep this helper to
// make changes easy if we should decide to use a separate element again
// to work around restrictions regarding positive root margins in iframes.
export function findIsPreparedProbe(el) {
  return el;
}

function findProbe(el, className) {
  while (el) {
    let probe = el.querySelector(`.${className}`);

    if (probe) {
      return probe;
    }

    el = el.parentNode
  }
}

export function renderInEntryWithSectionLifecycle(ui, options) {
  return renderInEntryWithScrollPositionLifecycle(
    ui,
    {lifecycleContext: SectionLifecycleContext, ...options}
  );
}
