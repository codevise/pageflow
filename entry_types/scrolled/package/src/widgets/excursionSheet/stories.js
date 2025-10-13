import React from 'react';
import {storiesOf} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';

import {
  normalizeAndMergeFixture,
  filePermaId
} from 'pageflow-scrolled/spec/support/stories';
import '../../widgets/mainStorylineSheet';
import '../../widgets/excursionSheet';
import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Widgets/Excursion Sheet', module);

window.__ACTIVE_EXCURSION__ = 'example-excursion';

function getSeed({
  returnButtonLabel = undefined
}) {
  return {
    storylines: [
      {
        id: 1000,
        permaId: 100,
        configuration: {main: true}
      },
      {
        id: 2000,
        permaId: 200
      }
    ],
    chapters: [
      {
        id: 1,
        permaId: 10,
        storylineId: 1000,
        position: 1
      },
      {
        id: 100,
        permaId: 1000,
        storylineId: 2000,
        position: 1,
        configuration: {
          title: 'Example Excursion',
          ...(returnButtonLabel ? {returnButtonLabel} : {})
        }
      }
    ],
    sections: [
      {
        id: 1,
        permaId: 10,
        chapterId: 1,
        configuration: {
          backdrop: {
            image: filePermaId('imageFiles', 'turtle')
          },
          fullHeight: true
        }
      },
      {
        id: 1000,
        permaId: 10000,
        chapterId: 100,
        configuration: {
          backdrop: {
            image: filePermaId('imageFiles', 'turtle')
          },
          fullHeight: true
        }
      }
    ],
    widgets: [
      {
        role: 'mainStoryline',
        typeName: 'mainStorylineSheet'
      },
      {
        role: 'excursion',
        typeName: 'excursionSheet'
      }
    ]
  };
}

function ExcursionStory({seed}) {
  return (
    <RootProviders seed={normalizeAndMergeFixture(seed)}>
      <Entry />
    </RootProviders>
  );
}

stories.add(
  'Default',
  () => (
    <ExcursionStory seed={getSeed({})} />
  ),
  {
    percy: {skip: false}
  }
);

stories.add(
  'Custom Return Label',
  () => (
    <ExcursionStory
      seed={getSeed({
        returnButtonLabel: 'Back to Story'
      })}
    />
  )
);

stories.add(
  'Mobile',
  () => (
    <ExcursionStory seed={getSeed({})} />
  ),
  {
    percy: {
      widths: [320]
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6'
    }
  }
);
