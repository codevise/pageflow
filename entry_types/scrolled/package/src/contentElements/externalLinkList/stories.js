import React from 'react';

import {
  Entry, RootProviders,
  contentElementWidths
} from 'pageflow-scrolled/frontend';

import {
  linkWidths,
  maxLinkWidth
} from './linkWidths';

import {
  editableTextValue,
  exampleHeading,
  filePermaId,
  normalizeAndMergeFixture,
  storiesOfContentElement
} from 'pageflow-scrolled/spec/support/stories';
import {storiesOf} from '@storybook/react';

storiesOfContentElement(module, {
  typeName: 'externalLinkList',
  baseConfiguration: {
    itemTexts: {
      1: {
        title: editableTextValue('PageflowIO'),
        description: editableTextValue('This is description')
      },
      2: {
        title: editableTextValue('pageflowio'),
        description: editableTextValue('This is pageflowio link')
      },
      3: {
        title: editableTextValue('PageflowIo'),
        description: editableTextValue('This is another pageflowio link')
      },
      4: {
        title: editableTextValue('PageflowIo'),
        description: editableTextValue('This is another pageflowio link')
      },
    },
    itemLinks: {
      1: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      },
      2: {
        href: 'https://www.pageflow.io/',
        openInNewTab: true
      },
      3: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      },
      4: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      }
    },
    links: [
      {
        id: '1',
        thumbnailCropPosition: {x: 0, y: 50},
        thumbnail: filePermaId('imageFiles', 'turtle')
      },
      {
        id: '2',
        thumbnail: ''
      },
      {
        id: '3',
        thumbnail: filePermaId('imageFiles', 'turtle')
      },
      {
        id: '4',
        thumbnail: filePermaId('imageFiles', 'turtle')
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
      name: 'With thumbnail size',
      configuration: {
        textPosition: 'right',
        thumbnailSize: 'large',
      }
    },
    {
      name: 'With text size',
      configuration: {
        textSize: 'large',
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
    },
    {
      name: 'Without link urls',
      configuration: {
        itemTexts: {
          1: {
            title: editableTextValue('Static Teaser'),
            description: editableTextValue('This is description')
          },
          2: {
            title: editableTextValue('Other item'),
            description: editableTextValue('This is other description')
          }
        },
        itemLinks: {},
        links: [
          {
            id: '1',
            thumbnail: filePermaId('imageFiles', 'turtle'),
          },
          {
            id: '2'
          }
        ]
      },
    },
    {
      name: 'With legacy external links',
      configuration: {
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
      }
    }
  ],
  inlineFileRights: true
});

[['below'], ['right'], ['overlay', 'square']].forEach(([textPosition, thumbnailAspectRatio]) =>
  storiesOf(`Content Elements/externalLinkList`, module)
    .add(
      `Text Position - ${textPosition}`,
      () => (
        <RootProviders seed={exampleSeed({textPosition, thumbnailAspectRatio})}>
          <Entry />
        </RootProviders>
      )
  )
);

function exampleSeed({textPosition, thumbnailAspectRatio}) {
  const sectionConfiguration = {
    transition: 'scroll'
  };

  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionConfiguration,
          layout: 'left',
          backdrop: {
            color: '#cad2c5'
          },
        }
      },
      {
        id: 2,
        configuration: {
          ...sectionConfiguration,
          layout: 'center',
          backdrop: {
            color: '#84a98c'
          },
        }
      },
      {
        id: 3,
        configuration: {
          ...sectionConfiguration,
          layout: 'right',
          backdrop: {
            color: '#52796f'
          },
        }
      }
    ],
    contentElements: [
      ...exampleContentElements(1, 'left', textPosition, thumbnailAspectRatio),
      ...exampleContentElements(2, 'center', textPosition, thumbnailAspectRatio),
      ...exampleContentElements(3, 'right', textPosition, thumbnailAspectRatio),
    ]
  });
}

function linkCount({layout, textPosition, width, linkWidth}) {
  if (textPosition === 'right') {
    return 3;
  }
  else {
    return range(
      linkWidths.xs,
      maxLinkWidth({width, layout, textPosition})
    ).reverse().indexOf(linkWidth) + 1;
  }
}

function exampleContentElements(sectionId, layout, textPosition, thumbnailAspectRatio) {
  return [
    exampleHeading({sectionId, text: `Layout ${layout}`}),
    ...([
      contentElementWidths.md,
      contentElementWidths.lg,
      contentElementWidths.xl
    ].flatMap(width =>
      range(
        linkWidths.xs,
        maxLinkWidth({width, layout, textPosition})
      ).map(linkWidth => (
        {
          sectionId,
          typeName: 'externalLinkList',
          configuration: {
            textPosition,
            width,
            linkWidth,
            thumbnailAspectRatio,
            ...links({
              count: linkCount({layout, textPosition, width, linkWidth})
            })
          }
        }
      ))
    ))
  ];
}

function range(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

function links({count}) {
  return {
    itemTexts: Object.fromEntries(Array.from({length: count}, (_, index) =>
      [
        index + 1,
        {
          title: editableTextValue(`Link ${index + 1}`),
          description: editableTextValue('This is the description')
        }
      ]
    )),
    itemLinks: Object.fromEntries(Array.from({length: count}, (_, index) =>
      [
        index + 1,
        {
          href: 'https://www.pageflow.io/',
        }
      ]
    )),
    links: Array.from({length: count}, (_, index) => (
      {
        id: `${index + 1}`,
        thumbnail: filePermaId('imageFiles', 'turtle'),
      }
    ))
  };
}
