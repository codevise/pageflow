import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import indicatorStyles from 'contentElements/hotspots/Indicator.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';

describe('Hotspots', () => {
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
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100
    };

    const {getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/image.webp');
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

    const {getByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(getByRole('button')).toHaveStyle(
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
    const {getByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(getByRole('button')).toHaveStyle(
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
    const {getByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(getByRole('button')).toHaveStyle(
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
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveStyle({
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

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-primary)',
    });
  });

  it('falls back to default indicator color  for portrait indicator', () => {
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

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveStyle({
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

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveStyle({
      '--color': 'var(--theme-palette-color-accent)',
    });
  });

  it('renders tooltip', () => {
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
      }
    };

    const {queryByText} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(queryByText('Some title')).not.toBeNull();
    expect(queryByText('Some description')).not.toBeNull();
  });

  it('positions tooltip based on indicator position', () => {
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

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('uses separate portrait indicator positon for tooltips', () => {
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

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveStyle({
      left: '20%',
      top: '30%'
    });
  });

  it('ignores portrait indicator position for tooltips if portrait image is missing', () => {
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

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveStyle({
      left: '10%',
      top: '20%'
    });
  });

  it('shows tooltip on area click', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).not.toHaveClass(tooltipStyles.visible);

    await user.click(getByRole('button'));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);
  });

  it('shows tooltip on area or tooltip hover', async () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).not.toHaveClass(tooltipStyles.visible);

    await user.hover(getByRole('button'));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);

    await user.unhover(getByRole('button'));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).not.toHaveClass(tooltipStyles.visible);

    await user.hover(container.querySelector(`.${tooltipStyles.tooltip}`));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);

    await user.unhover(container.querySelector(`.${tooltipStyles.tooltip}`));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).not.toHaveClass(tooltipStyles.visible);
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.click(getByRole('button', {name: 'Area 1'}));
    await user.hover(getByRole('button', {name: 'Area 2'}));

    expect(container.querySelectorAll(`.${tooltipStyles.visible}`).length).toEqual(1);
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.click(getByRole('button'));
    await user.click(document.body);

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).not.toHaveClass(tooltipStyles.visible);
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
    const {container, getByRole, getByText} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.click(getByRole('button'));
    await user.click(getByText('Some title'));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);
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
    const {container, getByRole, getByText} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    await user.hover(getByRole('button'));
    await user.click(getByText('Some title'));
    await user.unhover(getByRole('button'));

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);
  });

  it('supports active image rendered inside area', async () => {
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

    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');
    const {getByRole} = within(container.querySelector(`.${areaStyles.area}`));

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/image.webp');
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.activeImageVisible);

    await user.click(getByRole('button'));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(areaStyles.activeImageVisible);
  });

  it('shows active image on area or tooltip hover', async () => {
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
    const {getByRole, container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.activeImageVisible);

    await user.hover(getByRole('button'));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(areaStyles.activeImageVisible);

    await user.unhover(getByRole('button'));

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.activeImageVisible);

    await user.hover(container.querySelector(`.${tooltipStyles.tooltip}`));

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(areaStyles.activeImageVisible);

    await user.unhover(container.querySelector(`.${tooltipStyles.tooltip}`));

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.activeImageVisible);
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

    const {container, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'SET_ACTIVE_AREA', index: 0});

    expect(container.querySelector(`.${tooltipStyles.tooltip}`)).toHaveClass(tooltipStyles.visible);
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
    const {getByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />,
      {
        seed,
        editorState: {isEditable: true, setTransientState}
      }
    );
    await user.click(getByRole('button'));

    expect(setTransientState).toHaveBeenCalledWith({activeAreaId: 1})
  });
});
