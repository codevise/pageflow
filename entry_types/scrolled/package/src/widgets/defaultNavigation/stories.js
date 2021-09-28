import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';
import '../../widgets/defaultNavigation';
import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Widgets/Default Navigation', module);

let getSeed = function({chapterCount}){
  const summaries = [
    'An introductory chapter',
    'Second Chapter',
    'The Third Chapter'
  ]
  return {
    widgets: [{
      role: 'navigation',
      typeName: 'defaultNavigation'
    }],
    chapters: Array(chapterCount).fill().map((_, index) => (
      {
        id: index + 1,
        permaId: (index + 1) * 10,
        position: index + 1,
        configuration: {
          title: `Chapter ${index + 1}`,
          summary: summaries[index] || 'Another chapter'
        }
      }
    ))
  };
}

stories.add(
  'Desktop',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed({chapterCount: 3}))}>
      <Entry />
    </RootProviders>,
  {
    percy: {skip: false}
  }
);

stories.add(
  'Desktop - Many chapters',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed({chapterCount: 20}))}>
      <Entry />
    </RootProviders>,
  {
    percy: {skip: false}
  }
);

stories.add(
  'Mobile',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed({chapterCount: 3}))}>
      <Entry />
    </RootProviders>,
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
