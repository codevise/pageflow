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
  exampleHeading,
  filePermaId,
  normalizeAndMergeFixture,
  storiesOfContentElement
} from 'pageflow-scrolled/spec/support/stories';
import {storiesOf} from '@storybook/react';

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
        links: [
          {
            id: '1',
            title: 'Static Teaser',
            thumbnail: filePermaId('imageFiles', 'turtle'),
            description: 'This is description'
          },
          {
            id: '2',
            title: 'Other item',
            description: 'This is pageflowio link'
          }
        ]
      },
    }
  ],
  inlineFileRights: true
});

[['below', 6], ['right', 3]].forEach(([textPosition, linkCount]) =>
  storiesOf(`Content Elements/externalLinkList`, module)
    .add(
      `Text Position - ${textPosition}`,
    () => (
      <RootProviders seed={exampleSeed({textPosition, linkCount})}>
        <Entry />
      </RootProviders>
    )
  )
);

function exampleSeed({textPosition, linkCount}) {
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
      ...exampleContentElements(1, 'left', textPosition, linkCount),
      ...exampleContentElements(2, 'center', textPosition, linkCount),
      ...exampleContentElements(3, 'right', textPosition, linkCount),
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

function exampleContentElements(sectionId, layout, textPosition) {
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
            links: links({
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
  return Array.from({length: count}, (_, index) => (
    {
      id: `${index + 1}`,
      title: `Link ${index + 1}`,
      url: 'https://www.pageflow.io/',
      thumbnail: filePermaId('imageFiles', 'turtle'),
      description: 'This is the description'
    }
  ));
}
