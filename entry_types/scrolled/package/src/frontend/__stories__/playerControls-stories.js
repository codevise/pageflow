import React from 'react';
import {storiesOf} from '@storybook/react';

import {ControlBar} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Player Controls', module);

function addControlbarStory(name, type, style) {
  let playerAreaColor = (style === 'white' ? 'black' : 'white');
  stories.add(
    name,
    () => {
      return (
        <div style={{fontFamily: 'Source Sans Pro, sans-serif'}}>
          <div style={{background: playerAreaColor, width: '100%', height: '150px'}}></div>
          <ControlBar type={type} style={style}/>
        </div>
      );
    },
    {
      percy: {skip: true}
    }
  );
}

addControlbarStory('Video Controls', 'video', 'black');
addControlbarStory('Audio Controls', 'audio', 'black');
addControlbarStory('White Version', 'video', 'white');
addControlbarStory('Transparent Version', 'video', 'transparent');