import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';

import {RootProviders, PlayerControls} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Player Controls', module)
  .addDecorator((Story) =>
    <RootProviders seed={normalizeAndMergeFixture({})}>
      <Story />
    </RootProviders>);

function addControlbarStory(name, props) {
  stories.add(
    name,
    () => {
      return (
        <div style={{fontFamily: 'Source Sans Pro, sans-serif'}}>
          <PlayerControlsDemo {...props}>
            <div style={{background: 'rgba(0, 0, 0, 0.6)', width: '100%', height: '150px'}}></div>
          </PlayerControlsDemo>
        </div>
      );
    }
  );
}

function PlayerControlsDemo(props) {
  const [currentTime, setCurrentTime] = useState(200);
  const [scrubbingAt, setScrubbingAt] = useState();

  return (
    <PlayerControls {...props}
                    duration={500}
                    bufferedEnd={300}
                    currentTime={scrubbingAt === undefined ? currentTime : scrubbingAt}
                    scrubTo={setScrubbingAt}
                    seekTo={time => { setScrubbingAt(undefined); setCurrentTime(time) }} />
  );
}

addControlbarStory('Classic', {
  qualityMenuExpanded: true,
  qualityMenuItems: [
    {label: '2160p', annotation: '4k', value: '4k', active: true},
    {label: '1080p', annotation: 'HD', value: 'fullhd'},
    {label: '720p', annotation: 'HD', value: 'medium'},
  ],
  textTracksMenuItems: [
    {label: '(Off)', value: 'off', active: true},
    {label: 'English (CC)', value: 'en'},
    {label: 'Deutsch', value: 'de'}
  ]
});

addControlbarStory('Waveform', {
  variant: 'waveform',
  textTracksMenuItems: [
    {label: '(Off)', value: 'off', active: true},
    {label: 'English (CC)', value: 'en'},
    {label: 'Deutsch', value: 'de'}
  ]
});
