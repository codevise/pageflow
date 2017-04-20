import {createItemSelector} from 'collections';

import {memoizedSelector} from 'utils';

export const selector = createItemSelector('storylines');

export function storylineAttribute(name, options) {
  return memoizedSelector(
    selector(options),
    storyline => storyline && storyline[name]
  );
}
