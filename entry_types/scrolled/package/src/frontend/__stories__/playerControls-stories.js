import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';

import {PlayerControls} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Player Controls', module);

function addControlbarStory(name, type, style) {
  stories.add(
    name,
    () => {
      return (
        <div style={{fontFamily: 'Source Sans Pro, sans-serif'}}>
          <div style={{background: 'rgba(0, 0, 0, 0.6)', width: '100%', height: '150px'}}></div>
          <PlayerControlsDemo type={type} style={style}/>
        </div>
      );
    },
    {
      percy: {skip: false}
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

addControlbarStory('Basic Controls', 'video', 'white');
addControlbarStory('Inverted Version', 'video', 'black');
