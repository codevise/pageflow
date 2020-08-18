import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';

import {PlayerControls} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Player Controls', module);

function addControlbarStory(name, wrapperStyle, props) {
  stories.add(
    name,
    () => {
      return (
        <div style={{fontFamily: 'Source Sans Pro, sans-serif', ...wrapperStyle}}>
          <div style={{background: 'rgba(0, 0, 0, 0.6)', width: '100%', height: '150px'}}></div>
          <PlayerControlsDemo {...props} />
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

addControlbarStory('White', {color: '#fff', background: '#333'}, {
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

addControlbarStory('Black', {color: '#000'}, {
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

addControlbarStory('Waveform', {color: '#000'}, {
  variant: 'waveform',
  textTracksMenuItems: [
    {label: '(Off)', value: 'off', active: true},
    {label: 'English (CC)', value: 'en'},
    {label: 'Deutsch', value: 'de'}
  ]
});
