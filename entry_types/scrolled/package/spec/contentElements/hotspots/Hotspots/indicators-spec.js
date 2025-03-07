import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import indicatorStyles from 'contentElements/hotspots/Indicator.module.css';
import scrollerStyles from 'contentElements/hotspots/Scroller.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

import 'support/animateStub';
import {simulateIntersecting} from 'support/fakeIntersectionObserver';
import 'support/fakeResizeObserver';
import 'support/scrollTimelineStub';

describe('Hotspots', () => {
  it('renders area indicators', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {indicatorPosition: [10, 20]}
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('supports separate portrait indicator positon', () => {
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
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      left: '20%',
      top: '30%'
    });
  });

  it('ignores portrait indicator position if portrait image is missing', () => {
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
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('sets custom property for indicator color', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          indicatorPosition: [10, 20],
          color: 'accent'
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );

    expect(container.querySelector(`.${areaStyles.area} svg polygon`)).toHaveStyle({
      'stroke': 'var(--theme-palette-color-accent)',
    });
    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-accent)',
    });
  });

  it('supports separate color for portrait indicator', () => {
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
          portraitIndicatorPosition: [20, 30],
          color: 'accent',
          portraitColor: 'primary'
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-primary)',
    });
  });

  it('falls back to default indicator color for portrait indicator', () => {
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
          portraitIndicatorPosition: [20, 30],
          color: 'accent'
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-accent)',
    });
  });

  it('ignores portrait indicator color if portrait image is missing', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          indicatorPosition: [10, 20],
          portraitIndicatorPosition: [20, 30],
          color: 'accent',
          portraitColor: 'primary'
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${indicatorStyles.indicator}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-accent)',
    });
  });

  it('does not hide other indicators when area is activated', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100, width: 1920, height: 1080}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        },
        {
          id: 1,
          outline: [[60, 20], [60, 30], [80, 30], [80, 20]]
        }
      ]
    };

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.click(clickableArea(container));

    expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[0]).not.toHaveClass(indicatorStyles.hidden);
    expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[1]).not.toHaveClass(indicatorStyles.hidden);
  });

  describe('with pan zoom', () => {
    it('hides other indicators when area is active', () => {
      const seed = {
        imageFileUrlTemplates: {large: ':id_partition/image.webp'},
        imageFiles: [{id: 1, permaId: 100, width: 1920, height: 1080}]
      };
      const configuration = {
        image: 100,
        enablePanZoom: 'always',
        areas: [
          {
            id: 1,
            outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
            zoom: 50
          },
          {
            id: 1,
            outline: [[60, 20], [60, 30], [80, 30], [80, 20]],
            zoom: 50
          }
        ]
      };

      const {container, simulateScrollPosition} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );
      simulateScrollPosition('near viewport');
      simulateIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[0]).not.toHaveClass(indicatorStyles.hidden);
      expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[1]).toHaveClass(indicatorStyles.hidden);
    });
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
