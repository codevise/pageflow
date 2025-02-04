import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock,
  ExampleEntry
} from 'pageflow-scrolled/spec/support/stories';

import './index';

const stories = storiesOf('Widgets/Icon Scroll Indicator', module);

function getSeed({widgetConfiguration = {}, sectionConfiguration} = {}) {
  return {
    widgets: [{
      role: 'scrollIndicator',
      typeName: 'iconScrollIndicator',
      configuration: widgetConfiguration
    }],
    sections: [{
      id: 1,
      configuration: {
        fullHeight: true,
        backdrop: {
          image: filePermaId('imageFiles', 'turtle')
        },
        ...sectionConfiguration
      }
    }],
    contentElements: [
      exampleHeading({sectionId: 1, text: 'A Heading'}),
      exampleTextBlock({sectionId: 1}),
    ]
  }
};

stories.add(
  'Desktop',
  () => <ExampleEntry seed={normalizeAndMergeFixture(getSeed())} />
);

stories.add(
  'Desktop - Right',
  () =>
    <ExampleEntry seed={normalizeAndMergeFixture(getSeed({
      sectionConfiguration: {layout: 'right'}
    }))} />
);

stories.add(
  'Desktop - Large/Center Viewport',
  () =>
    <ExampleEntry seed={normalizeAndMergeFixture(getSeed({
      widgetConfiguration: {
        size: 'large',
        alignment: 'centerViewport'
      }
    }))} />
);

stories.add(
  'Mobile',
  () => <ExampleEntry seed={normalizeAndMergeFixture(getSeed())} />,
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
