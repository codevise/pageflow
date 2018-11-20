export const PAGE_DID_ACTIVATE = 'PAGE_DID_ACTIVATE';
export const PAGE_WILL_ACTIVATE = 'PAGE_WILL_ACTIVATE';
export const PAGE_DID_DEACTIVATE = 'PAGE_DID_DEACTIVATE';
export const PAGE_WILL_DEACTIVATE = 'PAGE_WILL_DEACTIVATE';

export const PAGE_DID_PRELOAD = 'PAGE_DID_PRELOAD';
export const PAGE_DID_PREPARE = 'PAGE_DID_PREPARE';
export const PAGE_SCHEDULE_UNPREPARE = 'PAGE_SCHEDULE_UNPREPARE';
export const PAGE_DID_UNPREPARE = 'PAGE_DID_UNPREPARE';

export const PAGE_DID_RESIZE = 'PAGE_DID_RESIZE';

export const ENHANCE = 'PAGE_ENHANCE';
export const CLEANUP = 'PAGE_CLEANUP';

export const UPDATE_PAGE_ATTRIBUTE = 'UPDATE_PAGE_ATTRIBUTE';
export const UPDATE_PAGE_LINK = 'UPDATE_PAGE_LINK';

export function pageWillActivate({id, position} = {}) {
  return pageAction(PAGE_WILL_ACTIVATE, id, {position});
}

export function pageDidActivate({id} = {}) {
  return pageAction(PAGE_DID_ACTIVATE, id);
}

export function pageWillDeactivate({id} = {}) {
  return pageAction(PAGE_WILL_DEACTIVATE, id);
}

export function pageDidDeactivate({id} = {}) {
  return pageAction(PAGE_DID_DEACTIVATE, id);
}

export function pageDidPreload({id} = {}) {
  return pageAction(PAGE_DID_PRELOAD, id);
}

export function pageDidPrepare({id} = {}) {
  return pageAction(PAGE_DID_PREPARE, id);
}

export function pageScheduleUnprepare({id} = {}) {
  return pageAction(PAGE_SCHEDULE_UNPREPARE, id);
}

export function pageDidUnprepare({id} = {}) {
  return pageAction(PAGE_DID_UNPREPARE, id);
}

export function pageDidResize({id} = {}) {
  return pageAction(PAGE_DID_RESIZE, id);
}

export function enhance({id} = {}) {
  return pageAction(ENHANCE, id);
}

export function cleanup({id} = {}) {
  return pageAction(CLEANUP, id);
}

export function updatePageAttribute({id, name, value} = {}) {
  return pageAction(UPDATE_PAGE_ATTRIBUTE, id, {name, value});
}

export function updatePageLink({pageId, linkId, name, value} = {}) {
  return pageAction(UPDATE_PAGE_LINK, pageId, {linkId, name, value});
}

export function pageAction(type, pageId, payload = {}) {
  return {
    type,
    meta: {
      collectionName: 'pages',
      itemId: pageId
    },
    payload
  };
}
