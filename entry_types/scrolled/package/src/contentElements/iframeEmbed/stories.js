import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'iframeEmbed',
  baseConfiguration: {
    source: 'https://example.com',
    caption: 'Some caption'
  },
  consent: {
    configuration: {
      requireConsent: true
    }
  },
  variants: [
    {
      name: 'With Consent',
      configuration: {
        requireConsent: true
      }
    }
  ]
});
