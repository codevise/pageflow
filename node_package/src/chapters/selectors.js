import {createItemSelector} from 'collections';

export const selector = createItemSelector('chapters');

export function chapterAttribute(name, options) {
  return selector({map: chapter => chapter[name], ...options});
}

export const chapterAttributes = selector;
