import {FitViewport} from 'pageflow-scrolled/frontend';
import {HeightContext} from 'frontend/Fullscreen';
import styles from 'frontend/FitViewport.module.css';

import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('FitViewport', () => {
  it('sets padding on inner div based on file aspect ratio', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FitViewport file={file}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getInner(container)).toHaveAttribute('style', 'padding-top: 50%;');
  });

  it('sets max width on outer div based on file aspect ratio', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FitViewport file={file}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveAttribute('style', 'max-width: 200vh;');
  });

  it('sets max width based on height provided via HeightContext', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <HeightContext.Provider value={400}>
        <FitViewport file={file}>
          <FitViewport.Content />
        </FitViewport>
      </HeightContext.Provider>
    );

    expect(getOuter(container)).toHaveAttribute('style', 'max-width: 800px;');
  });

  it('supports passing aspect ratio directly', () => {
    const {container} = render(
      <FitViewport aspectRatio={0.5}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getInner(container)).toHaveAttribute('style', 'padding-top: 50%;');
    expect(getOuter(container)).toHaveAttribute('style', 'max-width: 200vh;');
  });

  function getOuter(container) {
    return container.querySelector('div[style]');
  }

  function getInner(container) {
    return container.querySelector('div[style] div[style]');
  }
});
