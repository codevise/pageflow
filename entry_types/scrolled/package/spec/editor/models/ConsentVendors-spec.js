import {ConsentVendors} from 'editor/models/ConsentVendors';

describe('ConsentVendors', () => {
  describe('fromUrl', () => {
    it('detects vendor from seed data host matcher', () => {
      const consentVendors = new ConsentVendors({
        hostMatchers: {
          '\\.some-vendor.com$': 'someVendor'
        }
      });

      expect(consentVendors.fromUrl('https://foo.some-vendor.com/abc'))
        .toEqual('someVendor');
      expect(consentVendors.fromUrl('https://other.com/abc'))
        .toBeUndefined();
    });
  })
})
