import {frontend} from 'pageflow-scrolled/frontend';
import {TwitterEmbed} from './TwitterEmbed';

frontend.contentElementTypes.register('twitterEmbed', {
  component: TwitterEmbed,
  lifecycle: true,

  consentVendors({t}) {
    const prefix = 'pageflow_scrolled.public.twitter';

    return [{
      name: 'twitter',
      displayName: t(`${prefix}.consent_vendor_name`),
      description: t(`${prefix}.consent_vendor_description`),
      paradigm: 'lazy opt-in'
    }];
  }
});
