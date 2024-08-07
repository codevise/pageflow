import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';
import indicatorStyles from 'contentElements/hotspots/Indicator.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';
import scrollerStyles from 'contentElements/hotspots/Scroller.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {within, act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

import {getPanZoomStepTransform} from 'contentElements/hotspots/panZoom';
jest.mock('contentElements/hotspots/panZoom');

jest.mock('contentElements/hotspots/TooltipPortal');
jest.mock('contentElements/hotspots/useTooltipTransitionStyles');

describe('Hotspots', () => {
  let observeResizeMock;

  beforeEach(() => {
    observeResizeMock = jest.fn(function() {
      this.callback([
        {
          contentRect: observeResizeMock.mockContentRect || {width: 100, height: 100}
        }
      ]);
    });

    window.ResizeObserver = function(callback) {
      this.callback = callback;
      this.observe = observeResizeMock;
      this.unobserve = function(element) {};
      this.disconnect = function() {};
    };
  });

  useFakeTranslations({
    'pageflow_scrolled.public.next': 'Next'
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

  it('renders areas with clip path based on area outline', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(10% 20%, 10% 30%, 40% 30%, 40% 20%)'
    );
  });

  it('supports separate portrait area outline', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 101,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          portraitOutline: [[20, 20], [20, 30], [30, 30], [30, 20]]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(20% 20%, 20% 30%, 30% 30%, 30% 20%)'
    );
  });

  it('ignores portrait outline if portrait image is missing', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          portraitOutline: [[20, 20], [20, 30], [30, 30], [30, 20]]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(10% 20%, 10% 30%, 40% 30%, 40% 20%)'
    );
  });

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
    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    await user.click(container.querySelector(`.${areaStyles.clip}`));
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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

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
    await user.click(container.querySelector(`.${areaStyles.clip}`))

    expect(container.querySelector(`.${tooltipStyles.box}`)).toHaveClass(tooltipStyles['align-center']);
  });

  it('does not observe resize by default', () => {
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

    renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(observeResizeMock).not.toHaveBeenCalled();
  });

  it('observes resize when near viewport', () => {
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

    expect(observeResizeMock).toHaveBeenCalledTimes(1);
    expect(observeResizeMock).toHaveBeenCalledWith(expect.any(HTMLDivElement));
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

    observeResizeMock.mockContentRect = {width: 300, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '30px',
      top: '20px'
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
    observeResizeMock.mockContentRect = {width: 300, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '60px',
      top: '30px'
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
    observeResizeMock.mockContentRect = {width: 300, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '30px',
      top: '20px'
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

    observeResizeMock.mockContentRect = {width: 100, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '15px',
      top: '15px',
      height: '15px'
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
    observeResizeMock.mockContentRect = {width: 100, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '20px',
      top: '15px',
      height: '15px'
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
    observeResizeMock.mockContentRect = {width: 100, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
      left: '10px',
      top: '15px',
      height: '15px'
    });
  });

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
    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {queryByText, container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(queryByText('Some title')).toBeNull();

    await user.hover(container.querySelector(`.${areaStyles.clip}`));

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
    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {container, queryByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.click(container.querySelectorAll(`.${areaStyles.clip}`)[0]);
    await user.hover(container.querySelectorAll(`.${areaStyles.clip}`)[1]);

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
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.click(container.querySelector(`.${areaStyles.clip}`));
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
    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {container, getByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.click(container.querySelector(`.${areaStyles.clip}`));
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
    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {container, getByText, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    await user.hover(container.querySelector(`.${areaStyles.clip}`));
    await user.click(getByText('Some title'));
    await user.unhover(container.querySelector(`.${areaStyles.clip}`));

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
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

    await user.click(container.querySelector(`.${areaStyles.clip}`));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);
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

    await user.click(container.querySelector(`.${areaStyles.clip}`));

    expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[0]).not.toHaveClass(indicatorStyles.hidden);
    expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[1]).not.toHaveClass(indicatorStyles.hidden);
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

    await user.hover(container.querySelector(`.${areaStyles.clip}`));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);

    await user.unhover(container.querySelector(`.${areaStyles.clip}`));

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);
  });

  it('does not render area outline as svg by default', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector('svg polygon')).toBeNull();
  });

  it('renders area outline as svg when selected in editor', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );

    expect(container.querySelector('svg polygon')).toHaveAttribute(
      'points',
      '10,20 10,30 40,30 40,20'
    )
  });

  it('supports highlighting area via command', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'HIGHLIGHT_AREA', index: 0});

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(areaStyles.highlighted);
  });

  it('supports resetting area highlight via command', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'HIGHLIGHT_AREA', index: 0});
    triggerEditorCommand({type: 'RESET_AREA_HIGHLIGHT'});

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.highlighted);
  });

  it('supports setting active area via command', () => {
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

    observeResizeMock.mockContentRect = {width: 200, height: 100};
    const {container, triggerEditorCommand, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    simulateScrollPosition('near viewport');
    triggerEditorCommand({type: 'SET_ACTIVE_AREA', index: 0});

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });

  it('sets active area id in transient state in editor', async () => {
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
    const setTransientState = jest.fn();

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />,
      {
        seed,
        editorState: {isEditable: true, isSelected: true, setTransientState}
      }
    );
    await user.click(container.querySelector(`.${areaStyles.clip}`));

    expect(setTransientState).toHaveBeenCalledWith({activeAreaId: 1})
  });

  describe('pan and zoom', () => {
    let animateMock;
    let scrollTimelines;

    let intersectionObservers;

    function intersectionObserverByRoot(root) {
      return intersectionObservers.find(intersectionObserver =>
        intersectionObserver.root === root
      );
    }

    beforeEach(() => {
      animateMock = jest.fn(() => {
        return {
          cancel() {}
        }
      });
      HTMLDivElement.prototype.animate = animateMock;

      scrollTimelines = [];

      window.ScrollTimeline = function(options) {
        this.options = options;
        scrollTimelines.push(this);
      };

      intersectionObservers = [];

      window.IntersectionObserver = function(callback, {threshold, root}) {
        if (intersectionObserverByRoot(root)) {
          console.log(intersectionObservers.map(i => i.root?.outerHTML))
          throw new Error('Did not except more than one intersection observer per root');
        }

        intersectionObservers.push(this);

        this.root = root;
        this.targets = new Set();

        this.observe = function(target) {
          this.targets.add(target);
        };

        this.unobserve = function(target) {
          this.targets.delete(target);
        };

        this.mockIntersecting = function(target) {
          if (!this.targets.has(target)) {
            throw new Error(`Intersection observer does not currently ${target}.`);
          }

          act(() =>
            callback([{target, isIntersecting: true, intersectionRatio: threshold}])
          );
        };

        this.disconnect = function() {}
      };

      getPanZoomStepTransform.mockReset();
      getPanZoomStepTransform.mockReturnValue({
        x: 0,
        y: 0,
        scale: 1
      });
    });

    it('renders ultra image when element should load', () => {
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

      expect(scrollTimelines.length).toEqual(0);
      expect(animateMock).not.toHaveBeenCalled();
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

      expect(scrollTimelines.length).toEqual(1);
      expect(scrollTimelines[0].options).toEqual({
        source: expect.any(HTMLDivElement),
        axis: 'inline'
      });
      expect(animateMock).toHaveBeenCalledTimes(3);
      expect(animateMock).toHaveBeenCalledWith(
        Array.from({length: 3}, () => expect.objectContaining({
          transform: expect.any(String),
          easing: 'ease'
        })),
        expect.objectContaining({
          timeline: scrollTimelines[0]
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

      expect(scrollTimelines.length).toEqual(0);
      expect(animateMock).not.toHaveBeenCalled();
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

      observeResizeMock.mockContentRect = {width: 2000, height: 500};
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
      observeResizeMock.mockContentRect = {width: 2000, height: 500};
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

    it('only sets up resize observer when near viewport', () => {
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

      expect(observeResizeMock).not.toHaveBeenCalled();
    });

    it('observes intersection of scroller steps', () => {
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

      expect(
        intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`)).targets
      ).toContain(container.querySelector(`.${scrollerStyles.step}`));
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
      intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
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
      intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(imageAreaStyles.activeImageVisible);

    });

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
      intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[0]).not.toHaveClass(indicatorStyles.hidden);
      expect(container.querySelectorAll(`.${indicatorStyles.indicator}`)[1]).toHaveClass(indicatorStyles.hidden);
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
        intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
      ).toBeUndefined();
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
      await user.click(container.querySelector(`.${areaStyles.clip}`));

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

      intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);
      const scroller = container.querySelector(`.${scrollerStyles.scroller}`);
      scroller.scrollTo = jest.fn();
      await user.click(document.body);

      expect(scroller.scrollTo).toHaveBeenCalled();
      expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
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

      await user.hover(container.querySelector(`.${areaStyles.clip}`));

      expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(imageAreaStyles.activeImageVisible);
    });

    it('accounts for pan zoom in tooltip position', () => {
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

      observeResizeMock.mockContentRect = {width: 200, height: 100};
      getPanZoomStepTransform.mockReturnValue({
        x: -800,
        y: -200,
        scale: 5
      })
      const {container, simulateScrollPosition} = renderInContentElement(
        <Hotspots configuration={configuration} />, {seed}
      );
      simulateScrollPosition('near viewport');
      intersectionObserverByRoot(container.querySelector(`.${scrollerStyles.scroller}`))
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);

      expect(container.querySelector(`.${tooltipStyles.reference}`)).toHaveStyle({
        left: '100px',
        top: '50px'
      });
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
      intersectionObserverByRoot(scroller)
        .mockIntersecting(container.querySelectorAll(`.${scrollerStyles.step}`)[1]);
      await user.click(getByRole('button', {name: 'Next'}));

      expect(scroller.scrollTo).toHaveBeenCalled();
    });
  });
});
