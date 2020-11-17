import React from 'react';
import {storiesOf} from '@storybook/react';

import {Tooltip} from '../Tooltip';

const stories = storiesOf('Frontend/Tooltip', module);

stories.add(
  'Tooltip',
  () => {
    return (
      <div style={{width: '100%', height: '100vh', background: '#fff', margin: 100}}>
        <Tooltip fixed={true} content={"Pageflow Tooltip Content"} highlight={true}>
          <button>Tooltip</button>
        </Tooltip>
      </div>
    );
  }
);
