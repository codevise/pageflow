import {createItemSelector, createFirstItemSelector} from 'collections';

import {memoizedSelector} from 'utils';

import pageBackgroundImageUrl from './pageBackgroundImageUrl';

export {
  pageBackgroundImageUrl
};

export const selector = createItemSelector('pages');
export const firstPage = createFirstItemSelector('pages');

export function firstPageAttribures() {
  return memoizedSelector(
    firstPage,
    page => page && page.attributes
  );
}

export function firstPageAttribute(property) {
  return memoizedSelector(
    firstPage,
    page => page && page.attributes[property]
  );
}

export function pageAttribute(property, options) {
  return memoizedSelector(
    selector(options),
    page => page && page.attributes[property]
  );
}

export function pageAttributes(options) {
  return memoizedSelector(
    selector(options),
    page => page && page.attributes
  );
}

export function pageState(property, options) {
  return memoizedSelector(
    selector(options),
    page => page && page.state.custom[property]
  );
}

export function pageIsActive(options) {
  return commonPageState('isActive', options);
}

export function pageIsActivated(options) {
  return commonPageState('isActivated', options);
}

export function pageIsPreloaded(options) {
  return commonPageState('isPreloaded', options);
}

export function pageIsPrepared(options) {
  return commonPageState('isPrepared', options);
}

export function initialScrollerPosition(options) {
  return commonPageState('initialScrollerPosition', options);
}

function commonPageState(property, options) {
  return memoizedSelector(
    selector(options),
    page => page && page.state.common[property]
  );
}
