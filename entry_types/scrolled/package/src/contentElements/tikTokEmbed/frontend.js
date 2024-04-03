import {frontend} from 'pageflow-scrolled/frontend';
import {TikTokEmbed} from './TikTokEmbed';

frontend.contentElementTypes.register('tikTokEmbed', {
  component: TikTokEmbed,
  lifecycle: true,

  consentVendors({t}) {
    const prefix = 'pageflow_scrolled.public.tiktok';

    return [{
      name: 'tiktok',
      displayName: t(`${prefix}.consent_vendor_name`),
      description: t(`${prefix}.consent_vendor_description`),
      paradigm: 'lazy opt-in'
    }];
  }
});
