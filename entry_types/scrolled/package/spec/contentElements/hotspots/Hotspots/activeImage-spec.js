import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import scrollerStyles from 'contentElements/hotspots/Scroller.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

import 'support/animateStub';
import 'support/fakeResizeObserver';
import {simulateIntersecting} from 'support/fakeIntersectionObserver';
import 'support/scrollTimelineStub';
import 'support/requestAnimationFrameStub';

describe('Hotspots', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.next': 'Next'
  });

  it('supports active image rendered inside area', async () => {
    const seed = {
      imageFileUrlTemplates: {
        large: ':id_partition/large/image.webp',
        ultra: ':id_partition/ultra/image.webp'
      },
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    const {getByRole} = within(container.querySelector(`.${areaStyles.area}`));

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/large/image.webp');
  });

  it('lazy loads active images', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    const {queryByRole} = within(container.querySelector(`.${areaStyles.area}`));

    expect(queryByRole('img')).toBeNull();
  });

  it('supports separate portrait active image', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}, {id: 3, permaId: 102}]
    };
    const configuration = {
      image: 100,
      portraitImage: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101,
          portraitActiveImage: 102
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    const {getByRole} = within(container.querySelector(`.${areaStyles.area}`));

    expect(getByRole('img')).toHaveAttribute('src', '000/000/003/image.webp');
  });

  it('falls back to default active image in portrait mode', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    const {getByRole} = within(container.querySelector(`.${areaStyles.area}`));

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/image.webp');
  });

  it('shows active image on area click', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);

    await user.click(clickableArea(container));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);
  });

  it('shows active image on area hover', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
          activeImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);

    await user.hover(clickableArea(container));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);

    await user.unhover(clickableArea(container));

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);
  });

  describe('with pan zoom', () => {
    it('uses ultra variant of active image', () => {
      const seed = {
        imageFileUrlTemplates: {
          large: ':id_partition/large/image.webp',
          ultra: ':id_partition/ultra/image.webp'
        },
        imageFiles: [
          {id: 1, permaId: 100, width: 1920, height: 1080},
          {id: 2, permaId: 101, width: 1920, height: 1080}
        ]
      };
      const configuration = {
        image: 100,
        enablePanZoom: 'always',
        areas: [
          {
            id: 1,
            activeImage: 101,
            outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
            zoom: 50
          }
        ]
      };

      const {container, simulateScrollPosition} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );
      simulateScrollPosition('near viewport');

      const {getByRole} = within(container.querySelector(`.${areaStyles.area}`));

      expect(getByRole('img')).toHaveAttribute('src', '000/000/002/ultra/image.webp');
    });

    it('does not show active image on area hover', async () => {
      const seed = {
        imageFileUrlTemplates: {large: ':id_partition/image.webp'},
        imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
      };
      const configuration = {
        image: 100,
        enablePanZoom: 'always',
        areas: [
          {
            outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
            indicatorPosition: [20, 25],
            activeImage: 101
          }
        ],
        tooltipTexts: {
          1: {
            title: [{type: 'heading', children: [{text: 'Some title'}]}],
          }
        }
      };

      const user = userEvent.setup();
      const {container} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );

      await user.hover(clickableArea(container));

      expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);
    });

    it('displays active image based on intersecting scroller step when pan zoom is enabled', () => {
      const seed = {
        imageFileUrlTemplates: {large: ':id_partition/large/image.webp'},
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
          }
        ]
      };

      const {container, simulateScrollPosition} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );
      simulateScrollPosition('near viewport');
      simulateIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);
    });
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
