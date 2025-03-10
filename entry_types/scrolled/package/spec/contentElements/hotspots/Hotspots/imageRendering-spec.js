import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import styles from 'contentElements/hotspots/Hotspots.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

import 'support/animateStub';
import {fakeResizeObserver} from 'support/fakeResizeObserver';
import 'support/scrollTimelineStub';

import {getInitialTransform} from 'contentElements/hotspots/panZoom';
jest.mock('contentElements/hotspots/panZoom');

describe('Hotspots', () => {
  beforeEach(() => {
    getInitialTransform.restoreMockImplementation();
  });

  it('does not render images by default', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100
    };

    const {queryByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(queryByRole('img')).toBeNull();
  });

  it('renders image when element should load', () => {
    const seed = {
      imageFileUrlTemplates: {
        large: ':id_partition/large/image.webp',
        ultra: ':id_partition/ultra/image.webp'
      },
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100
    };

    const {getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/large/image.webp');
  });

  it('supports portrait image', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 101
    };

    window.matchMedia.mockPortrait();
    const {getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/image.webp');
  });

  it('renders ultra image when pan zoom is enabled and element should load', () => {
    const seed = {
      imageFileUrlTemplates: {
        large: ':id_partition/large/image.webp',
        ultra: ':id_partition/ultra/image.webp'
      },
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always'
    };

    const {getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/ultra/image.webp');
  });

  it('applies initial transform to wrapper element to cover backdrop content element', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100, width: 2000, height: 1000}]
    };
    const configuration = {
      image: 100,
      position: 'backdrop',
      areas: [
        {
          outline: [[80, 45], [100, 45], [100, 55], [80, 55]],
          zoom: 100,
          indicatorPosition: [90, 50],
        }
      ]
    };

    fakeResizeObserver.contentRect = {width: 300, height: 100};
    getInitialTransform.mockReturnValue({
      x: -700,
      y: -100,
      scale: 5,
      indicators: [{x: -800, y: -200}]
    });
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${styles.wrapper}`)).toHaveStyle({
      transform: 'translate(-700px, -100px) scale(5)'
    });
  });
});
