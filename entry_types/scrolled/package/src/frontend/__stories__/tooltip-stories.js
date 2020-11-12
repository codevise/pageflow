import React from 'react';
import {storiesOf} from '@storybook/react';

import {Tooltip} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Pageflow Tooltip', module);

stories.add(
  'Tooltip',
  () => {
    return (
      <div style={{width: '100%', height: '100vh', background: 'rgba(0, 0, 0, 0.6)'}}>
        <Tooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'top'} style={{left: '150px', top: '150px'}}>
          <button>Tooltip Top</button>
        </Tooltip>
        <Tooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'bottom'} style={{left: '350px', top: '150px'}}>
          <button>Tooltip Bottom</button>
        </Tooltip>
        <Tooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'left'} style={{left: '150px', top: '350px'}}>
          <button>Tooltip Left</button>
        </Tooltip>
        <Tooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'right'} style={{left: '350px', top: '350px'}}>
          <button>Tooltip Right</button>
        </Tooltip>
      </div>
    );
  }
);

