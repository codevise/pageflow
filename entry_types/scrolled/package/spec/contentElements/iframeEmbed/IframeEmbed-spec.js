import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {IframeEmbed} from 'contentElements/iframeEmbed/IframeEmbed';
import fitViewportStyles from 'frontend/FitViewport.module.css';

describe('IframeEmbed', () => {
  it('renders FitViewport with aspect ratio by default', () => {
    const {container} = renderInContentElement(
      <IframeEmbed configuration={{source: 'https://example.com'}} />,
      {seed: {}}
    );

    expect(container.querySelector(`.${fitViewportStyles.container}`)).not.toBeNull();
  });

  it('skips aspect ratio when autoResize is enabled', () => {
    const {container} = renderInContentElement(
      <IframeEmbed configuration={{source: 'https://example.com',
                                   autoResize: true}} />,
      {seed: {}}
    );

    expect(container.querySelector(`.${fitViewportStyles.container}`)).toBeNull();
  });
});
