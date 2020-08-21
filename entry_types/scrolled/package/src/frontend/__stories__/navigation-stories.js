import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';
import {AppHeader} from '../navigation/AppHeader';
import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Navigation stories', module);

let getSeed = function(){
  return {
    chapters: [
      {
        id: 1,
        permaId: 10,
        position: 1,
        configuration: {
          title: 'Chapter 1',
          summary: 'An introductory chapter'
        }
      },
      {
        id: 2,
        permaId: 20,
        position: 2,
        configuration: {
          title: 'Chapter 2',
          summary: 'Second Chapter'
        }
      },
      {
        id: 3,
        permaId: 30,
        position: 2,
        configuration: {
          title: 'Chapter 3',
          summary: 'The Third Chapter'
        }
      },
    ]
  };
}

stories.add(
  'Desktop',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed())}>
      <AppHeader />
      <Entry />
    </RootProviders>,
  {
    percy: {skip: true}
  }
);

stories.add(
  'Mobile',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed())}>
      <AppHeader />
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
