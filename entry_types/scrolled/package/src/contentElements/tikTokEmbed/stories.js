import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'tikTokEmbed',
  baseConfiguration: {
    url: 'https://twitter.com/pageflow_io/status/1484828278623985664'
  },
  consent: true
});
