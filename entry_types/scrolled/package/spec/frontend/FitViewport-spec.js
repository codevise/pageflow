import {FitViewport} from 'pageflow-scrolled/frontend';
import styles from 'frontend/FitViewport.module.css';
import fullscreenStyles from 'frontend/Fullscreen.module.css';

import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('FitViewport', () => {
  it('does not render content wrapper by default', () => {
    const {container} = render(
      <FitViewport>
        <FitViewport.Content>
          Content
        </FitViewport.Content>
      </FitViewport>
    );

    expect(getInner(container)).toBeNull();
  });

  it('sets aspect ratio custom property based on file aspect ratio', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FitViewport file={file}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveStyle('--fit-viewport-aspect-ratio: 0.5');
  });

  it('supports passing aspect ratio directly', () => {
    const {container} = render(
      <FitViewport aspectRatio={0.5}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveStyle('--fit-viewport-aspect-ratio: 0.5');
  });

  it('supports passing aspect ratio name', () => {
    const {container} = render(
      <FitViewport aspectRatio="square">
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveStyle('--fit-viewport-aspect-ratio: var(--theme-aspect-ratio-square)');
  });

  it('sets scale custom property', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FitViewport file={file} scale={0.8}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveStyle('--fit-viewport-scale: 0.8');
  });

  it('is not opaque by default', () => {
    const {container} = render(
      <FitViewport aspectRatio={0.5}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).not.toHaveClass(styles.opaque);
  });

  it('can be made opaque', () => {
    const {container} = render(
      <FitViewport aspectRatio={0.5} opaque>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveClass(styles.opaque);
  });

  it('support covering full height', () => {
    const {container} = render(
      <FitViewport aspectRatio={0.5} fill>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).not.toHaveStyle('--fit-viewport-aspect-ratio: 0.5');
    expect(container.querySelector(`.${fullscreenStyles.root}`)).not.toBeNull();
  });

  function getOuter(container) {
    return container.querySelector(`.${styles.container}`);
  }

  function getInner(container) {
    return container.querySelector(`.${styles.inner}`);
  }
});
