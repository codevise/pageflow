import {frontend} from 'pageflow-scrolled/frontend';
import {VideoEmbed} from './VideoEmbed';
import {getProviderName} from './getProviderName';

frontend.contentElementTypes.register('videoEmbed', {
  component: VideoEmbed,
  lifecycle: true,

  consentVendors({configuration, t}) {
    const provider = getProviderName(configuration.videoSource);

    if (provider) {
      const prefix = 'pageflow_scrolled.public.video_embed.consent';

      return [{
        name: provider,
        displayName: t(`${prefix}.${provider}.vendor_name`),
        description: t(`${prefix}.${provider}.vendor_description`)
      }];
    }

    return [];
  }
});
