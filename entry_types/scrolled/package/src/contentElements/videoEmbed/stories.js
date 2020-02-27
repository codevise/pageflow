import './frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'videoEmbed',
  baseConfiguration: {
    videoSource: "https://www.youtube.com/embed/G_-KPFsYMX4"
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    },
    {
      name: 'Aspect Ratio 16:9',
      configuration: {aspectRatio: 'wide'}
    },
    {
      name: 'Aspect Ratio 4:3',
      configuration: {aspectRatio: 'narrow'}
    },
    {
      name: 'Aspect Ratio 1:1',
      configuration: {aspectRatio: 'square'}
    },
    {
      name: 'Aspect Ratio 9:16',
      configuration: {aspectRatio: 'portrait'}
    }
  ]
});
