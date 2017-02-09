import pageTypesModule from 'pageTypes';
import {pageType} from 'pageTypes/selectors';

import createStore from 'createStore';

import {expect} from 'support/chai';

describe('pageType', () => {
  it('provides selector to get page type config of a page', () => {
    const pageTypesSeed = {video: {name: 'video'}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });

    const result = pageType({page: {type: 'video'}})(store.getState());

    expect(result.name).to.eq('video');
  });

  it('allows to get page from selector props', () => {
    const pageTypesSeed = {video: {name: 'video'}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });
    const props = {
      targetPage: {type: 'video'}
    };

    const result = pageType({
      page: props => props.targetPage
    })(store.getState(), props);

    expect(result.name).to.eq('video');
  });

  it('return null if page is null', () => {
    const pageTypesSeed = {video: {}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });

    const result = pageType({
      page: props => props.targetPage
    })(store.getState(), {});

    expect(result).to.eq(null);
  });
});
