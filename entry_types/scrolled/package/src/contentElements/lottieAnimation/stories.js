import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'lottieAnimation',
  baseConfiguration: {
    id: filePermaId('lottieFiles', 'lottieAnimation')
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    },
    {
      name: 'With Rounded Corners',
      configuration: {
        imageModifiers: [
          {name: 'rounded', value: 'md'}
        ]
      },
      themeOptions: {
        properties: {
          root: {
            'contentElementBoxBorderRadius-md': '16px'
          }
        }
      }
    },
    {
      name: 'With Circle Crop',
      configuration: {
        imageModifiers: [
          {name: 'crop', value: 'circle'}
        ]
      }
    }
  ],
  inlineFileRights: true
});
