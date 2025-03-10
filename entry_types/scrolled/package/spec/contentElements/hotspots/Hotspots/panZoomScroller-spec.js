import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';
import scrollerStyles from 'contentElements/hotspots/Scroller.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

import {fakeResizeObserver} from 'support/fakeResizeObserver';
import {fakeIntersectionObserver, simulateIntersecting} from 'support/fakeIntersectionObserver';
import {animateStub} from 'support/animateStub';
import {scrollTimelineStub} from 'support/scrollTimelineStub';
import 'support/requestAnimationFrameStub';

import {getPanZoomStepTransform} from 'contentElements/hotspots/panZoom';
jest.mock('contentElements/hotspots/panZoom');

jest.mock('contentElements/hotspots/TooltipPortal');
jest.mock('contentElements/hotspots/useTooltipTransitionStyles');

describe('Hotspots', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.next': 'Next'
  });

  beforeEach(() => {
    getPanZoomStepTransform.mockReset();
    getPanZoomStepTransform.mockReturnValue({
      x: 0,
      y: 0,
      scale: 1
    });
  });

  it('does not render invisible scroller when pan zoom is disabled', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'never',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${scrollerStyles.scroller}`)).toBeNull();
  });

  it('renders invisible scroller when pan zoom is enabled', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${scrollerStyles.scroller}`)).not.toBeNull();
  });

  it('does not render invisible scroller if pan zoom enabled on phone platform', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'phonePlatform',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${scrollerStyles.scroller}`)).toBeNull();
  });

  it('renders invisible scroller on phone platform if pan zoom enabled on phone platform', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'phonePlatform',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed, phonePlatform: true}
    );

    expect(container.querySelector(`.${scrollerStyles.scroller}`)).not.toBeNull();
  });

  it('scroller has one step per area plus two for overview states', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        },
        {
          id: 1,
          outline: [[40, 20], [40, 30], [60, 30], [60, 20]]
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelectorAll(`.${scrollerStyles.step}`).length).toEqual(4);
  });

  it('neither calls animate nor sets up scroll timeline by default', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(scrollTimelineStub.instances.length).toEqual(0);
    expect(animateStub.current).not.toHaveBeenCalled();
  });

  it('calls animate with scroll timeline when near viewport and pan and zoom is enabled', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(scrollTimelineStub.instances.length).toEqual(1);
    expect(scrollTimelineStub.instances[0].options).toEqual({
      source: expect.any(HTMLDivElement),
      axis: 'inline'
    });
    expect(animateStub.current).toHaveBeenCalledTimes(3);
    expect(animateStub.current).toHaveBeenCalledWith(
      Array.from({length: 3}, () => expect.objectContaining({
        transform: expect.any(String),
        easing: 'ease'
      })),
      expect.objectContaining({
        timeline: scrollTimelineStub.instances[0]
      })
    );
  });

  it('only sets up pan zoom scroll timeline when near viewport', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(scrollTimelineStub.instances.length).toEqual(0);
    expect(animateStub.current).not.toHaveBeenCalled();
  });

  it('sets active section based on intersecting scroller step when pan zoom is enabled', () => {
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
        }
      ]
    };

    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    simulateIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });

  it('only sets up intersection observer when near viewport', () => {
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
        }
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(
      fakeIntersectionObserver.byRoot(container.querySelector(`.${scrollerStyles.scroller}`))
    ).toBeUndefined();
  });

  it('calls getPanZoomStepTransform with relevant dimensions', () => {
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
        }
      ]
    };

    fakeResizeObserver.contentRect = {width: 2000, height: 500};
    const {simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getPanZoomStepTransform).toHaveBeenCalledWith({
      areaOutline: [[10, 20], [10, 30], [40, 30], [40, 20]],
      areaZoom: 50,
      imageFileWidth: 1920,
      imageFileHeight: 1080,
      containerWidth: 2000,
      containerHeight: 500
    });
  });

  it('passes portrait outlines to getPanZoomStepTransform in portrait mode', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [
        {id: 1, permaId: 100, width: 1920, height: 1080},
        {id: 2, permaId: 101, width: 1080, height: 1920}
      ]
    };
    const configuration = {
      image: 100,
      portraitImage: 101,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          portraitOutline: [[20, 20], [20, 30], [30, 30], [30, 20]],
          zoom: 50,
          portraitZoom: 40
        }
      ]
    };

    window.matchMedia.mockPortrait();
    fakeResizeObserver.contentRect = {width: 2000, height: 500};
    const {simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getPanZoomStepTransform).toHaveBeenCalledWith({
      areaOutline: [[20, 20], [20, 30], [30, 30], [30, 20]],
      areaZoom: 40,
      imageFileWidth: 1080,
      imageFileHeight: 1920,
      containerWidth: 2000,
      containerHeight: 500
    });
  });

  it('scrolls pan zoom scroller instead of setting active index directly when pan zoom is enabled', async () => {
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
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Area 1'}]}],
        }
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    const scroller = container.querySelector(`.${scrollerStyles.scroller}`);
    scroller.scrollTo = jest.fn();
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container));

    expect(scroller.scrollTo).toHaveBeenCalled();
    expect(container.querySelector(`.${tooltipStyles.box}`)).toBeNull();
  });

  it('scrolls pan zoom scroll when setting active area via command and pan zoom is enabled', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {container, simulateScrollPosition, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    simulateScrollPosition('near viewport');
    const scroller = container.querySelector(`.${scrollerStyles.scroller}`);
    scroller.scrollTo = jest.fn();
    triggerEditorCommand({type: 'SET_ACTIVE_AREA', index: 0});

    expect(scroller.scrollTo).toHaveBeenCalled();
    expect(container.querySelector(`.${tooltipStyles.box}`)).toBeNull();
  });

  it('scrolls pan zoom scroller instead of resetting active area directly when pan zoom is enabled', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      enablePanZoom: 'always',
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
        }
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    simulateIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);
    const scroller = container.querySelector(`.${scrollerStyles.scroller}`);
    scroller.scrollTo = jest.fn();
    await user.click(document.body);

    expect(scroller.scrollTo).toHaveBeenCalled();
    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });

  it('allows changing active area via scroll button', async () => {
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
          indicatorPosition: [90, 50],
        },
        {
          outline: [[20, 45], [30, 45], [30, 55], [20, 55]],
          indicatorPosition: [25, 50],
        }
      ]
    };

    const user = userEvent.setup();
    const {container, getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    const scroller = container.querySelector(`.${scrollerStyles.scroller}`);
    scroller.scrollTo = jest.fn();
    simulateIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);
    await user.click(getByRole('button', {name: 'Next'}));

    expect(scroller.scrollTo).toHaveBeenCalled();
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
