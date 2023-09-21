import {useContentElementConsentVendor} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useContentElementConsentVendor', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useContentElementConsentVendor({contentElementId: 10}), {
        seed: {
          consentVendors: [{name: 'someVendor', displayName: 'Some Vendor'}],
          contentElementConsentVendors: {10: 'someVendor'},
          contentElements: [{id: 10}]
        }
      }
    );

    const data = result.current;
    expect(data).toMatchObject({name: 'someVendor', displayName: 'Some Vendor'});
  });

  it('returns undefined if content element does not have consent vendor', () => {
    const {result} = renderHookInEntry(
      () => useContentElementConsentVendor({contentElementId: 1}), {
        seed: {
          contentElements: [{id: 1}]
        }
      }
    );

    const data = result.current;
    expect(data).toBeUndefined();
  });
});
