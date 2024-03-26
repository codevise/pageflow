import {FitViewport} from 'pageflow-scrolled/frontend';
import {FullscreenDimensionProvider} from 'frontend/Fullscreen';
import styles from 'frontend/FitViewport.module.css';
import fullscreenStyles from 'frontend/Fullscreen.module.css';

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

  it('sets max width based on height provided via FullscreenDimensionProvider', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FullscreenDimensionProvider height={400}>
        <FitViewport file={file}>
          <FitViewport.Content />
        </FitViewport>
      </FullscreenDimensionProvider>
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

  it('supports scaling down', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FitViewport file={file} scale={0.8}>
        <FitViewport.Content />
      </FitViewport>
    );

    expect(getOuter(container)).toHaveAttribute('style', 'max-width: 160vh;');
  });

  it('supports scaling down when height provided via FullscreenDimensionProvider', () => {
    const file = {width: 200, height: 100};
    const {container} = render(
      <FullscreenDimensionProvider height={400}>
        <FitViewport file={file} scale={0.9}>
          <FitViewport.Content />
        </FitViewport>
      </FullscreenDimensionProvider>
    );

    expect(getOuter(container)).toHaveAttribute('style', 'max-width: 720px;');
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

    expect(getInner(container)).toBeNull();
    expect(container.querySelector(`.${fullscreenStyles.root}`)).not.toBeNull();
  });

  function getOuter(container) {
    return container.querySelector(`.${styles.container}`);
  }

  function getInner(container) {
    return container.querySelector(`.${styles.container} div[style]`);
  }
});
