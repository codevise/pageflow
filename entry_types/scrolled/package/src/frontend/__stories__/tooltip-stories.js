import React from 'react';
import {storiesOf} from '@storybook/react';

import {PageflowTooltip} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Pageflow Tooltip', module);

stories.add(
  'Tooltip',
  () => {
    return (
      <div style={{width: '100%', height: '100vh', background: 'rgba(0, 0, 0, 0.6)'}}>
        <PageflowTooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'top'} style={{left: '150px', top: '150px'}}>
          <button>Tooltip Top</button>
        </PageflowTooltip>
        <PageflowTooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'bottom'} style={{left: '350px', top: '150px'}}>
          <button>Tooltip Bottom</button>
        </PageflowTooltip>
        <PageflowTooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'left'} style={{left: '150px', top: '350px'}}>
          <button>Tooltip Left</button>
        </PageflowTooltip>
        <PageflowTooltip fixed={true} content={"Pageflow Tooltip Content"} placement={'right'} style={{left: '350px', top: '350px'}}>
          <button>Tooltip Right</button>
        </PageflowTooltip>
      </div>
    );
  }
);

