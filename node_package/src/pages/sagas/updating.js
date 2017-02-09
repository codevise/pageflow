import {UPDATE_PAGE_ATTRIBUTE, UPDATE_PAGE_LINK} from '../actions';
import {getItemIdFromItemAction} from 'collections/itemActionHelpers';

import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';
import Backbone from 'backbone';

export default function*(pagesCollection) {
  if (!(pagesCollection instanceof Backbone.Collection)) {
    return;
  }

  yield takeEvery(UPDATE_PAGE_ATTRIBUTE, function*(action) {
    yield call(updatePageAttribute, {
      pagesCollection,
      id: getItemIdFromItemAction(action),
      name: action.payload.name,
      value: action.payload.value
    });
  });

  yield takeEvery(UPDATE_PAGE_LINK, function*(action) {
    yield call(updatePageLink, {
      pagesCollection,
      pageId: getItemIdFromItemAction(action),
      linkId: action.payload.linkId,
      name: action.payload.name,
      value: action.payload.value
    });
  });
}

function updatePageLink({pagesCollection, pageId, linkId, name, value}) {
  const pageLink = getPage(pagesCollection, pageId).pageLinks().get(linkId);

  if (!pageLink) {
    throw new Error(`Could not find page link with id ${linkId} in page with perma id ${pageId}.`);
  }

  pageLink.set(name, value);
}

function updatePageAttribute({pagesCollection, id, name, value}) {
  getPage(pagesCollection, id).configuration.set(name, value);
}

function getPage(collection, id) {
  const page = collection.where({'perma_id': id})[0];

  if (!page) {
    throw new Error(`Could not find page with perma id ${id}.`);
  }

  return page;
}
