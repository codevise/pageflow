import {createItemSelector} from 'collections';

export const selector = createItemSelector('storylines');

export function storylineAttribute(name, options) {
  return selector({map: storyline => storyline[name], ...options});
}
