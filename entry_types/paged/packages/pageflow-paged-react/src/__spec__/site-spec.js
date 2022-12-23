import site from 'site';
import {privacyLinkUrl} from 'site/selectors';
import createStore from 'createStore';


describe('site', () => {
  it('provides selectors to access site attributes', () => {
    const store = createStore([site], {
      site: {
        privacy_link_url: '/privacy'
      }
    });

    expect(privacyLinkUrl(store.getState())).toBe('/privacy');
  });
});
