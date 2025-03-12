import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

import 'support/animateStub';
import {fakeResizeObserver} from 'support/fakeResizeObserver';
import 'support/scrollTimelineStub';

import {getInitialTransform, getPanZoomStepTransform} from 'contentElements/hotspots/panZoom';
jest.mock('contentElements/hotspots/panZoom');

describe('Hotspots', () => {
  beforeEach(() => {
    getInitialTransform.restoreMockImplementation();
    getPanZoomStepTransform.restoreMockImplementation();
  });

  it('positions tooltip reference based on indicator position', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          indicatorPosition: [10, 20],
        }
      ]
    };

    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('uses separate portrait indicator positon for tooltip reference', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 101,
      areas: [
        {
          indicatorPosition: [10, 20],
          portraitIndicatorPosition: [20, 30]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '20%',
      top: '30%'
    });
  });

  it('ignores portrait indicator position for tooltip reference if portrait image is missing', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          indicatorPosition: [10, 20],
          portraitIndicatorPosition: [20, 30]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('supports using area bounding box as tooltip reference', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          indicatorPosition: [15, 20],
          outline: [[10, 20], [10, 30], [40, 30], [40, 15]],
          tooltipReference: 'area'
        }
      ]
    };

    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '15%',
      top: '15%',
      height: '15%'
    });
  });

  it('uses separate portrait outline positon for tooltip reference', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 101,
      areas: [
        {
          portraitTooltipReference: 'area',
          outline: [[20, 20], [20, 30], [50, 30], [45, 15]],
          indicatorPosition: [10, 20],
          portraitOutline: [[10, 20], [10, 30], [40, 30], [40, 15]],
          portraitIndicatorPosition: [20, 30]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '20%',
      top: '15%',
      height: '15%'
    });
  });

  it('ignores portrait outline position for tooltip reference if portrait image is missing', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          tooltipReference: 'area',
          portraitTooltipReference: 'area',
          outline: [[10, 20], [10, 30], [40, 30], [40, 15]],
          indicatorPosition: [10, 20],
          portraitOutline: [[2, 2], [2, 3], [5, 3], [4, 1]],
          portraitIndicatorPosition: [2, 3]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '10%',
      top: '15%',
      height: '15%'
    });
  });

  it('applies initial transform to cover backdrop content element', () => {
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
      x: -800,
      y: -200,
      scale: 5,
      indicators: [{x: 0, y: 0}]
    })
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${tooltipStyles.reference}`).parentElement).toHaveStyle({
      transform: 'translate(-800px, -200px) scale(5)'
    });
  });

  describe('with pan zoom', () => {
    it('applies pan zoom transform to parent of tooltip reference', () => {
      const seed = {
        imageFileUrlTemplates: {large: ':id_partition/image.webp'},
        imageFiles: [{id: 1, permaId: 100, width: 2000, height: 1000}]
      };
      const configuration = {
        image: 100,
        enablePanZoom: 'always',
        areas: [
          {
            outline: [[80, 45], [100, 45], [100, 55], [80, 55]],
            zoom: 100,
            indicatorPosition: [90, 50],
          }
        ]
      };

      fakeResizeObserver.contentRect = {width: 200, height: 100};
      getPanZoomStepTransform.mockReturnValue({
        x: -400,
        y: -100,
        scale: 2,
        indicators: [{x: -800, y: -200}]
      })
      const {container, simulateScrollPosition} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );
      simulateScrollPosition('near viewport');

      expect(container.querySelector(`.${tooltipStyles.reference}`).parentElement).toHaveStyle({
        transform: 'translate(-400px, -100px) scale(2)'
      });
    });
  });
});
