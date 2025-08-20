import {renderEntry, usePageObjects} from 'support/pageObjects';
import {viewTimelineStub} from 'support/viewTimelineStub';
import {animateStub} from 'support/animateStub';
import '@testing-library/jest-dom/extend-expect'

import effectsStyles from 'frontend/v1/Backdrop/Effects.module.css';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('backdrop animation effects', () => {
  usePageObjects();

  it('neither calls animate nor sets up view timeline by default', () => {
    renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100}
            }
          }
        ]
      }
    });

    expect(viewTimelineStub.instances.length).toEqual(0);
    expect(animateStub.current).not.toHaveBeenCalled();
  });

  it('supports scroll parallax', () => {
    renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'scrollParallax',
                  value: 40
                }
              ]
            }
          }
        ]
      }
    });

    expect(viewTimelineStub.instances.length).toEqual(1);
    expect(animateStub.current).toHaveBeenCalledTimes(1);
    expect(animateStub.current).toHaveBeenCalledWith(
      {
        transform: [
          'translateY(8%) scale(116%)',
          'translateY(-8%) scale(116%)'
        ]
      },
      expect.objectContaining({timeline: viewTimelineStub.instances[0]}
    ));
  });

  it('supports scroll parallax for mobile image', () => {
    usePortraitOrientation.mockReturnValue(true);

    renderEntry({
      seed: {
        imageFiles: [
          {permaId: 100},
          {permaId: 101},
        ],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {
                image: 100,
                imageMobile: 101
              },
              backdropEffectsMobile: [
                {
                  name: 'scrollParallax',
                  value: 40
                }
              ]
            }
          }
        ]
      }
    });

    expect(viewTimelineStub.instances.length).toEqual(1);
    expect(animateStub.current).toHaveBeenCalledTimes(1);
    expect(animateStub.current).toHaveBeenCalledWith(
      {
        transform: [
          'translateY(8%) scale(116%)',
          'translateY(-8%) scale(116%)'
        ]
      },
      expect.objectContaining({timeline: viewTimelineStub.instances[0]}
    ));
  });

  it('does not animate scroll parallax in static preview', () => {
    renderEntry({
      isStaticPreview: true,
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'scrollParallax',
                  value: 50
                }
              ]
            }
          }
        ]
      }
    });

    expect(animateStub.current).not.toHaveBeenCalled();
  });

  it('neither calls animate nor sets up view timeline when reduced motion is preferred', () => {
    window.matchMedia.mockPrefersReducedMotion();

    renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'scrollParallax',
                  value: 40
                }
              ]
            }
          }
        ]
      }
    });

    expect(viewTimelineStub.instances.length).toEqual(0);
    expect(animateStub.current).not.toHaveBeenCalled();
  });

  it('supports auto zoom', () => {
    const {getSectionByPermaId, container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {
                image: 100,
                imageMotifArea: {left: 0, top: 80, width: 10, height: 20}
              },
              backdropEffects: [
                {
                  name: 'autoZoom',
                  value: 50
                }
              ]
            }
          }
        ]
      }
    });

    getSectionByPermaId(1).simulateScrollingIntoView();
    const autoZoomElement = container.querySelector(`.${effectsStyles.autoZoom}`);

    expect(viewTimelineStub.instances.length).toEqual(0);
    expect(autoZoomElement).not.toBeNull();
    expect(autoZoomElement).toHaveStyle('--auto-zoom-duration: 20500ms;');
    expect(autoZoomElement).toHaveStyle('--auto-zoom-origin-x: 45%;');
    expect(autoZoomElement).toHaveStyle('--auto-zoom-origin-y: -40%;');
  });

  it('does not set auto zoom custom properties by default', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {
                image: 100
              }
            }
          }
        ]
      }
    });

    expect(container.querySelector('[style*="--auto-zoom"]')).toBeNull();
  });

  it('only triggers auto zoom once visible', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'autoZoom',
                  value: 50
                }
              ]
            }
          }
        ]
      }
    });

    expect(container.querySelector(`.${effectsStyles.autoZoom}`)).toBeNull();
  });

  it('does not autozoom if reduced motion is preferred', () => {
    window.matchMedia.mockPrefersReducedMotion();

    const {getSectionByPermaId, container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'autoZoom',
                  value: 50
                }
              ]
            }
          }
        ]
      }
    });

    getSectionByPermaId(1).simulateScrollingIntoView();

    expect(container.querySelector(`.${effectsStyles.autoZoom}`)).toBeNull();
  });
});
