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
    },
    {
      name: 'With pan zoom enabled',
      configuration: {
        enablePanZoom: 'always',
        areas: [
          {
            id: 1,
            outline: [[20, 30], [50, 30], [50, 50], [20, 50]],
            indicatorPosition: [25, 45]
          },
          {
            id: 2,
            outline: [[60, 40], [80, 40], [80, 60], [60, 60]],
            indicatorPosition: [65, 55]
          }
        ],
        tooltipTexts: {
          1: {
            title: [{children: [{text: 'First Area'}]}],
            description: [{type: 'paragraph', children: [{text: 'First area description'}]}]
          },
          2: {
            title: [{children: [{text: 'Second Area'}]}],
            description: [{type: 'paragraph', children: [{text: 'Second area description'}]}]
          }
        }
      }
    },
    {
      name: 'With hidden pager buttons',
      configuration: {
        enablePanZoom: 'always',
        areas: [
          {
            id: 1,
            outline: [[20, 30], [50, 30], [50, 50], [20, 50]],
            indicatorPosition: [25, 45]
          },
          {
            id: 2,
            outline: [[60, 40], [80, 40], [80, 60], [60, 60]],
            indicatorPosition: [65, 55]
          }
        ],
        tooltipTexts: {
          1: {
            title: [{children: [{text: 'First Area'}]}],
            description: [{type: 'paragraph', children: [{text: 'First area description'}]}]
          },
          2: {
            title: [{children: [{text: 'Second Area'}]}],
            description: [{type: 'paragraph', children: [{text: 'Second area description'}]}]
          }
        }
      },
      themeOptions: {
        hotspotsPagerButtonsHidden: true
      }
    }
  ],
  inlineFileRights: true
});
