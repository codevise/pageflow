import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'hotspots',
  baseConfiguration: {
    image: filePermaId('imageFiles', 'turtle'),
    width: 2,
    initialActiveArea: 0,
    areas: [
      {
        id: 1,
        outline: [[20, 30], [50, 30], [50, 50], [20, 50]],
        indicatorPosition: [25, 45]
      }
    ],
    tooltipTexts: {
      1: {
        title: [{children: [{text: 'Some Title'}]}],
        description: [{type: 'paragraph', children: [{text: 'This text describes area'}]}],
        link: [{children: [{text: 'Read more'}]}]
      }
    }
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    }
  ],
  inlineFileRights: true
});
