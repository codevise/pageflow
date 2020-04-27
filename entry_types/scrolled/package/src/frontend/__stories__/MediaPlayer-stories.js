import React from 'react';
import {storiesOf} from '@storybook/react';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import {EntryStateProvider, AudioPlayer, VideoPlayer} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Media Player', module);

stories.add(
  'Media Video Player',
  () => {
    return (
        <EntryStateProvider seed={normalizeAndMergeFixture({})}>
          <VideoPlayer id={filePermaId('videoFiles', 'interview_toni')} />
        </EntryStateProvider>                    
    );
  },
  {
    percy: {skip: true}
  }
);


stories.add(
  'Media Audio Player',
  () => {
    return (
      <EntryStateProvider seed={normalizeAndMergeFixture({})}>
        <AudioPlayer id={filePermaId('audioFiles', 'quicktime_jingle')}/>
      </EntryStateProvider>  
    );
  },
  {
    percy: {skip: true}
  }
);