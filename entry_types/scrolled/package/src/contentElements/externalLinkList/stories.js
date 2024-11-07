import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'externalLinkList',
  baseConfiguration: {
    links: [
      {
        id: '1',
        title: 'PageflowIO',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is description',
        open_in_new_tab: '0',
        thumbnailCropPosition: {x: 0, y: 50}
      },
      {
        id: '2',
        title: 'pageflowio',
        url: 'https://www.pageflow.io/',
        thumbnail: '',
        description: 'This is pageflowio link',
        open_in_new_tab: '1'
      },
      {
        id: '3',
        title: 'PageflowIo',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is another pageflowio link',
        open_in_new_tab: '0'
      },
      {
        id: '4',
        title: 'PageflowIo',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is another pageflowio link',
        open_in_new_tab: '0'
      }
    ]
  },
  variants: [
    {
      name: 'With thumbnail aspect ratio',
      configuration: {
        thumbnailAspectRatio: 'square',
      }
    },
    {
      name: 'With inverted content colors',
      configuration: {
        variant: 'cards-inverted'
      },
      themeOptions: {
        properties: {
          'externalLinkList-cards-inverted': {
            darkContentSurfaceColor: 'var(--root-light-content-surface-color)',
            lightContentSurfaceColor: 'var(--root-dark-content-surface-color)',
            darkContentTextColor: 'var(--root-light-content-text-color)',
            lightContentTextColor: 'var(--root-dark-content-text-color)'
          }
        }
      }
    },
    {
      name: 'With transparent background',
      configuration: {
        variant: 'cards-inverted'
      },
      sectionConfiguration: {
        backdrop: {
          image: filePermaId('imageFiles', 'turtle')
        }
      },
      inlineFileRightsWidgetTypeName: 'textInlineFileRights',
      themeOptions: {
        properties: {
          'externalLinkList-cards-inverted': {
            externalLinksCardSurfaceColor: 'transparent',
            externalLinksCardTextColor: 'var(--content-text-color)',
            externalLinksCardPaddingInline: '0'
          }
        }
      }
    }
  ],
  inlineFileRights: true
});
