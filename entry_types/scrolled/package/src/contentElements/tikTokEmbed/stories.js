import './frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'tikTokEmbed',
  baseConfiguration: {
    url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173'
  },
  consent: true
});
