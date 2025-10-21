import './frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'socialEmbed',
  baseConfiguration: {
    provider: 'x',
    url: 'https://twitter.com/pageflow_io/status/1484828278623985664'
  }
});
