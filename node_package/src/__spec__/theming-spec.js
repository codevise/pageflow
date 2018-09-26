import theming from 'theming';
import {privacyLinkUrl} from 'theming/selectors';
import createStore from 'createStore';

import {expect} from 'support/chai';

describe('theming', () => {
  it('provides selectors to access theming attributes', () => {
    const store = createStore([theming], {
      theming: {
        privacy_link_url: '/privacy'
      }
    });

    expect(privacyLinkUrl(store.getState())).to.eq('/privacy');
  });
});
