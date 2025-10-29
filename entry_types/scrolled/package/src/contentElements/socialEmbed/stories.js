import './frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

const providers = {
  bluesky: {
    displayName: 'BlueSky',
    exampleUrl: 'at://did:plc:2vu3huob444jsk6mue2ojgde/app.bsky.feed.post/3m3rxqylvbr2e'
  },
  instagram: {
    displayName: 'Instagram',
    exampleUrl: 'https://www.instagram.com/reel/DP4acPdEfVq/'
  },
  tiktok: {
    displayName: 'TikTok',
    exampleUrl: 'https://www.tiktok.com/@scout2015/video/6718335390845095173'
  },
  x: {
    displayName: 'X',
    exampleUrl: 'https://x.com/pageflow_io/status/1484828278623985664'
  }
};

storiesOfContentElement(module, {
  typeName: 'socialEmbed',
  baseConfiguration: {
    provider: 'x',
    url: providers.x.exampleUrl
  },
  variants: Object.entries(providers).flatMap(([name, provider]) => [
    {
      name: `${provider.displayName} - Placeholder`,
      configuration: {provider: name, url: ''}
    },
    {
      name: `${provider.displayName} - Opt-In`,
      configuration: {provider: name, url: provider.exampleUrl},
      consentState: 'denied'
    },
    {
      name: `${provider.displayName}`,
      configuration: {provider: name, url: provider.exampleUrl}
    }
  ])
});
