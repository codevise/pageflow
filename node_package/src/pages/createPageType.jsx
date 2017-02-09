import {createItemScopeProvider} from 'collections';
import {pageDidPreload, pageDidPrepare, pageScheduleUnprepare,
        pageWillActivate, pageDidActivate, pageWillDeactivate, pageDidDeactivate,
        pageDidResize, enhance, cleanup} from './actions';
import MediaContextProvider from './MediaContextProvider';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

const PageProvider = createItemScopeProvider('pages');

export default function({Component,
                         store,
                         selectTargetElement = pageElement => pageElement[0]}) {
  return {
    scroller: false,

    enhance(pageElement, configuration) {
      ReactDOM.render(
        <Provider store={store}>
          <PageProvider itemId={pageId(pageElement)}>
            <MediaContextProvider mediaContext={{page: pageElement.page('instance')}}>
              <Component />
            </MediaContextProvider>
          </PageProvider>
        </Provider>,
        selectTargetElement(pageElement)
      );
      store.dispatch(enhance({id: pageId(pageElement)}));
    },

    preload(pageElement) {
      store.dispatch(pageDidPreload({id: pageId(pageElement)}));
    },

    prepare(pageElement) {
      store.dispatch(pageDidPrepare({id: pageId(pageElement)}));
    },

    unprepare(pageElement) {
      store.dispatch(pageScheduleUnprepare({id: pageId(pageElement)}));
    },

    activating(pageElement, configuration, options) {
      store.dispatch(pageWillActivate({
        id: pageId(pageElement),
        position: options.position
      }));
    },

    activated(pageElement) {
      store.dispatch(pageDidActivate({id: pageId(pageElement)}));
    },

    deactivating(pageElement) {
      store.dispatch(pageWillDeactivate({id: pageId(pageElement)}));
    },

    deactivated(pageElement) {
      store.dispatch(pageDidDeactivate({id: pageId(pageElement)}));
    },

    resize(pageElement) {
      store.dispatch(pageDidResize({id: pageId(pageElement)}));
    },

    update(pageElement, configuration) {
      pageflow.commonPageCssClasses.updateCommonPageCssClasses(pageElement, configuration);
    },

    cleanup(pageElement) {
      store.dispatch(cleanup({id: pageId(pageElement)}));
      ReactDOM.unmountComponentAtNode(pageElement[0]);
    }
  };
}

function pageId(pageElement) {
  return parseInt(pageElement.attr('id'), 10);
}
