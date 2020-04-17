export const HOTKEY_SPACE = 'HOTKEY_SPACE';
export const HOTKEY_TAB = 'HOTKEY_TAB';

import {pageAction} from 'pages/actions';

export function space({currentPageId}) {
  return pageAction(HOTKEY_SPACE, currentPageId);
}

export function tab({currentPageId}) {
  return pageAction(HOTKEY_TAB, currentPageId);
}
