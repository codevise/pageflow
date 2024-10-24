import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineImage',
  baseConfiguration: {
    id: filePermaId('imageFiles', 'turtle')
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    },
    {
      name: 'With Caption Variant',
      configuration: {
        caption: 'Some text here',
        captionVariant: 'inverted'
      },
      themeOptions: {
        properties: {
          'figureCaption-inverted': {
            darkContentSurfaceColor: 'var(--root-light-content-surface-color)',
            lightContentSurfaceColor: 'var(--root-dark-content-surface-color)',
            darkContentTextColor: 'var(--root-light-content-text-color)',
            lightContentTextColor: 'var(--root-dark-content-text-color)'
          }
        }
      }
    }
  ],
  inlineFileRights: true
});
