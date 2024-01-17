import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation')

describe('backdrop animation effects', () => {
  usePageObjects();

  let animateMock;
  let viewTimelines;

  beforeEach(() => {
    animateMock = jest.fn(() => {
      return {
        cancel() {}
      }
    });
    HTMLDivElement.prototype.animate = animateMock;

    viewTimelines = [];

    window.ViewTimeline = function({subject}) {
      viewTimelines.push(this);
    }
  });

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

    expect(viewTimelines.length).toEqual(0);
    expect(animateMock).not.toHaveBeenCalled();
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

    expect(viewTimelines.length).toEqual(1);
    expect(animateMock).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledWith(
      {
        transform: [
          'translateY(8%) scale(116%)',
          'translateY(-8%) scale(116%)'
        ]
      },
      expect.objectContaining({timeline: viewTimelines[0]}
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

    expect(viewTimelines.length).toEqual(1);
    expect(animateMock).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledWith(
      {
        transform: [
          'translateY(8%) scale(116%)',
          'translateY(-8%) scale(116%)'
        ]
      },
      expect.objectContaining({timeline: viewTimelines[0]}
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

    expect(animateMock).not.toHaveBeenCalled();
  });

  it('supports auto zoom', () => {
    const {getSectionByPermaId} = renderEntry({
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

    expect(viewTimelines.length).toEqual(0);
    expect(animateMock).toHaveBeenCalledWith(
      {
        transform: [
          'translate(0%, 0%) scale(1) translate(0%, 0%)',
          'translate(0%, 0%) scale(1.2) translate(0%, 0%)'
        ]
      },
      expect.objectContaining({
        duration: 20500
      })
    );
  });

  it('uses motif area as transform prigin', () => {
    const {getSectionByPermaId} = renderEntry({
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

    expect(viewTimelines.length).toEqual(0);
    expect(animateMock).toHaveBeenCalledWith(
      {
        transform: [
          'translate(-45%, 40%) scale(1) translate(45%, -40%)',
          'translate(-45%, 40%) scale(1.2) translate(45%, -40%)'
        ]
      },
      expect.objectContaining({
        duration: 20500
      })
    );
  });

  it('only triggers auto zoom once visible', () => {
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
                  name: 'autoZoom',
                  value: 50
                }
              ]
            }
          }
        ]
      }
    });

    expect(animateMock).not.toHaveBeenCalled();
  });
});
