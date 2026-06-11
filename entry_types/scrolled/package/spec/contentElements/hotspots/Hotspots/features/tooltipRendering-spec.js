import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import 'support/fakeResizeObserver';

jest.mock('contentElements/hotspots/TooltipPortal');
jest.mock('contentElements/hotspots/useTooltipTransitionStyles');

describe('Hotspots', () => {
  it('renders tooltip texts, image and links', async () => {
    const seed = {
      imageFileUrlTemplates: {
        large: 'large/:id_partition/image.webp',
        medium: 'medium/:id_partition/image.webp'
      },
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
          tooltipImage: 101
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}],
          link: [{type: 'paragraph', children: [{text: 'Some link'}]}]
        }
      },
      tooltipLinks: {
        1: {href: 'https://example.com', openInNewTab: true}
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition, getByText} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container));

    getByText('Some title')
    const {queryByText, getByRole} = within(container.querySelector(`.${tooltipStyles.box}`));

    expect(queryByText('Some title')).not.toBeNull();
    expect(queryByText('Some description')).not.toBeNull();
    expect(queryByText('Some link')).not.toBeNull();
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('img')).toHaveAttribute('src', 'medium/000/000/002/image.webp');
  });

  it('does not render tooltip link if link text is blank', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}],
          link: [{type: 'paragraph', children: [{text: ''}]}]
        }
      },
      tooltipLinks: {
        1: {href: 'https://example.com', openInNewTab: true}
      }
    };

    const user = userEvent.setup();
    const {container, queryByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(queryByRole('link')).toBeNull();
  });

  it('does not apply min width to tooltip without link', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}],
          link: [{type: 'paragraph', children: [{text: ''}]}]
        }
      },
      tooltipLinks: {
        1: {href: 'https://example.com', openInNewTab: true}
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toHaveClass(tooltipStyles.minWidth);
  });

  it('applies min width to tooltip with link', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}],
          link: [{type: 'paragraph', children: [{text: 'Some link'}]}]
        }
      },
      tooltipLinks: {
        1: {href: 'https://example.com', openInNewTab: true}
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(container.querySelector(`.${tooltipStyles.box}`)).toHaveClass(tooltipStyles.minWidth);
  });

  it('applies max width to tooltip', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
          tooltipMaxWidth: 'narrow'
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}]
        }
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(container.querySelector(`.${tooltipStyles.box}`)).toHaveClass(tooltipStyles['maxWidth-narrow']);
  });

  it('supports separate max width for portrait mode', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      portraitImage: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
          tooltipMaxWidth: 'narrow',
          portraitTooltipMaxWidth: 'veryNarrow'
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}]
        }
      }
    };

    const user = userEvent.setup();
    window.matchMedia.mockPortrait();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(container.querySelector(`.${tooltipStyles.box}`)).toHaveClass(tooltipStyles['maxWidth-veryNarrow']);
  });

  it('supports setting tooltip text align', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          indicatorPosition: [10, 20],
          tooltipTextAlign: 'center'
        }
      ],
      tooltipTexts: {
        1: {
          title: [{type: 'heading', children: [{text: 'Some title'}]}],
          description: [{type: 'paragraph', children: [{text: 'Some description'}]}]
        }
      }
    };

    const user = userEvent.setup();
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(clickableArea(container))

    expect(container.querySelector(`.${tooltipStyles.box}`)).toHaveClass(tooltipStyles['align-center']);
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
