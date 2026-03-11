import {ConsentVendors} from 'editor/models/ConsentVendors';

describe('ConsentVendors', () => {
  describe('fromUrl', () => {
    it('detects vendor from seed data url matcher', () => {
      const consentVendors = new ConsentVendors({
        urlMatchers: {
          '\\.some-vendor\\.com/': 'someVendor'
        }
      });

      expect(consentVendors.fromUrl('https://foo.some-vendor.com/abc'))
        .toEqual('someVendor');
      expect(consentVendors.fromUrl('https://other.com/abc'))
        .toBeUndefined();
    });

    it('detects vendor from path-based url matcher', () => {
      const consentVendors = new ConsentVendors({
        urlMatchers: {
          'google\\.com/maps/embed': 'googleMaps'
        }
      });

      expect(consentVendors.fromUrl('https://www.google.com/maps/embed?pb=1234'))
        .toEqual('googleMaps');
      expect(consentVendors.fromUrl('https://www.google.com/search?q=test'))
        .toBeUndefined();
    });
  })
})
