import {ContentElementTypeRegistry} from 'frontend/api/ContentElementTypeRegistry';

import I18n from 'i18n-js';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('ContentElementTypeRegistry', () => {
  describe('consentVendors', () => {
    useFakeTranslations({
      'pageflow_scrolled.public.chart.vendor_name': 'Datawrapper',
      'pageflow_scrolled.public.embedded_video.youtube.vendor_name': 'YouTube',
      'pageflow_scrolled.public.embedded_video.vimeo.vendor_name': 'Vimeo'
    });

    it('returns vendors based on content elements', () => {
      const contentElementTypes = new ContentElementTypeRegistry();
      contentElementTypes.register('textBlock', {});
      contentElementTypes.register('chart', {
        consentVendors({t}) {
          return [{
            name: 'datawrapper',
            displayName: t('pageflow_scrolled.public.chart.vendor_name')
          }]
        }
      });

      const result = contentElementTypes.consentVendors({
        t: I18n.t,
        contentElements: [
          {typeName: 'chart'},
          {typeName: 'chart'},
          {typeName: 'textBlock', configuration: {}}
        ]
      });

      expect(result).toEqual([{
        name: 'datawrapper',
        displayName: 'Datawrapper'
      }]);
    });

    it('supports function that takes configuration', () => {
      const contentElementTypes = new ContentElementTypeRegistry();
      contentElementTypes.register('textBlock', {});
      contentElementTypes.register('videoEmbed', {
        consentVendors({configuration, t}) {
          const providerName = configuration.providerName;

          return [{
            name: providerName,
            displayName: t('vendor_name', {
              scope: `pageflow_scrolled.public.embedded_video.${providerName}`
            })
          }];
        }
      });

      const result = contentElementTypes.consentVendors({
        t: I18n.t,
        contentElements: [
          {typeName: 'videoEmbed', configuration: {providerName: 'youtube'}},
          {typeName: 'videoEmbed', configuration: {providerName: 'youtube'}},
          {typeName: 'videoEmbed', configuration: {providerName: 'vimeo'}},
          {typeName: 'textBlock', configuration: {}}
        ]
      });

      expect(result).toEqual([
        {name: 'youtube', displayName: 'YouTube'},
        {name: 'vimeo', displayName: 'Vimeo'}
      ]);
    });
  });
});
