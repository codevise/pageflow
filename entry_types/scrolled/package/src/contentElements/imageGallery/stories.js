import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'imageGallery',
  baseConfiguration: {
    items: [
      {
        id: 1,
        image: filePermaId('imageFiles', 'turtle')
      },
      {
        id: 2,
        image: filePermaId('imageFiles', 'churchBefore')
      },
      {
        id: 3,
        image: filePermaId('imageFiles', 'churchAfter')
      },
      {
        id: 4,
        image: filePermaId('imageFiles', 'turtle')
      },
      {
        id: 5,
        image: filePermaId('imageFiles', 'churchBefore')
      },
      {
        id: 6,
        image: filePermaId('imageFiles', 'churchAfter')
      }
    ]
  },
  inlineFileRights: true,
  variants: [
    {
      name: 'Custom scroll button size',
      themeOptions: {
        properties: {
          root: {
            imageGalleryScrollButtonSize: '60px'
          }
        }
      }
    },
    {
      name: 'With Captions',
      configuration: {
        captions: {
          1: [
            {
              type: 'paragraph',
              children: [
                {text: 'At vero eos et accusam et justo duo dolores et ea rebum.'}
              ]
            }
          ]
        }
      }
    },
    {
      name: 'With Caption Variant',
      configuration: {
        captions: {
          1: [
            {
              type: 'paragraph',
              children: [
                {text: 'At vero eos et accusam et justo duo dolores et ea rebum.'}
              ]
            }
          ]
        },
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
  ]
});
