import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {asyncHandlingOf} from 'support/asyncHandlingOf'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import 'support/fakeResizeObserver';

jest.mock('contentElements/hotspots/TooltipPortal');
jest.mock('contentElements/hotspots/useTooltipTransitionStyles');

describe('Hotspots', () => {
  it('shows tooltip on area hover', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
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
    const {queryByText, container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(queryByText('Some title')).toBeNull();

    await user.hover(clickableArea(container));

    expect(queryByText('Some title')).not.toBeNull();
  });

  it('does not show other tooltip on hover after area has been clicked', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          indicatorPosition: [20, 25],
        },
        {
          id: 2,
          outline: [[50, 20], [50, 30], [60, 30], [60, 20]],
          indicatorPosition: [55, 25],
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Area 1'}]}],
        },
        2: {
          title: [{type: 'heading', children: [{text: 'Area 2'}]}],
        }
      }
    };

    const user = userEvent.setup();
    const {container, queryByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.click(clickableAreas(container)[0]);
    await user.hover(clickableAreas(container)[1]);

    expect(queryByText('Area 1')).not.toBeNull();
  });

  it('hides tooltip when clicked outside area', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
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

    await user.click(clickableArea(container));
    await user.click(document.body);

    expect(container.querySelector(`.${tooltipStyles.box}`)).toBeNull();
  });

  it('does not hide tooltip on click inside tooltip', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
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
    const {container, getByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.click(clickableArea(container));
    await user.click(getByText('Some title'));

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });

  it('does not hide tooltip on unhover after click in tooltip', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
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
    const {container, getByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.hover(clickableArea(container));
    await user.click(getByText('Some title'));
    await user.unhover(clickableArea(container));

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });

  it('hides when backdrop element is intersecting content', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
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
    const {container, rerender, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.click(clickableArea(container));
    await asyncHandlingOf(() =>
      rerender(
        <Hotspots configuration={configuration} sectionProps={{isIntersecting: true}} />
      )
    );;

    expect(container.querySelector(`.${tooltipStyles.box}`)).toBeNull();
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
