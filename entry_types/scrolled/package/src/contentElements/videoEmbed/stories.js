import './frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'videoEmbed',
  baseConfiguration: {
    videoSource: "https://www.youtube.com/embed/G_-KPFsYMX4"
  }
});
