import {createItemSelector} from 'collections';

import {memoizedSelector} from 'utils';

export const selector = createItemSelector('chapters');

export function chapterAttribute(name, options) {
  return memoizedSelector(
    selector(options),
    chapter => chapter && chapter[name]
  );
}

export const chapterAttributes = selector;
