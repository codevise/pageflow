import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntryWithSectionLifecycle} from 'support';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import {frontend} from 'pageflow-scrolled/frontend';
import {Backdrop} from 'frontend/v1/Backdrop';
import {useBackdrop} from 'frontend/v1/useBackdrop';
import styles from 'frontend/Backdrop.module.css';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation')

describe('Backdrop', () => {
  useFakeMedia();

  it('does not render image when outside viewport', () => {
    const {queryByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'image'}
            ]
          }
        }
      );

    expect(queryByRole('img')).toBeNull()
  });

  it('supports rendering image given by id', () => {
    const {simulateScrollPosition, getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'image'}
            ]
          }
        }
      );

    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('supports applying effects to image', () => {
    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100},
          backdropEffects: [{name: 'blur', value: 100}]
        })} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'image'}
            ]
          }
        }
      );

    expect(
      container.querySelector('[style*="filter"]').style.filter
    ).toEqual('blur(10px)');
  });

  it('supports rendering mobile image given by id in portrait orientation', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {simulateScrollPosition, getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100, imageMobile: 200}})} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'landscape'},
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('portrait.jpg'));
  });

  it('uses default image in landscape orientation even if mobile image is configured', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {simulateScrollPosition, getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100, imageMobile: 200}})} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'landscape'},
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('landscape.jpg'));
  });

  it('falls back to portrait image if default image is not defined', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {simulateScrollPosition, getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {imageMobile: 200}})} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('portrait.jpg'));
  });

  it('supports applying effects to protrait image', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100, imageMobile: 200},
          backdropEffectsMobile: [{name: 'blur', value: 100}]
        })} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'landscape'},
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    expect(
      container.querySelector('[style*="filter"]').style.filter
    ).toEqual('blur(10px)');
  });

  it('does not apply portrait effects to landscape image', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100, imageMobile: 200},
          backdropEffectsMobile: [{name: 'blur', value: 100}]
        })} />,
        {
          seed: {
            fileUrlTemplates: {
              imageFiles: {
                large: ':basename.jpg'
              }
            },
            imageFiles: [
              {permaId: 100, basename: 'landscape'},
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    expect(container.querySelector('[style*="filter"]')).toBeNull();
  });

  it('invokes onMotifAreaUpdate callback', () => {
    const callback = jest.fn();
    renderInEntryWithSectionLifecycle(
      () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})} onMotifAreaUpdate={callback} />,
      {
        seed: {
          imageFiles: [
            {permaId: 100, basename: 'image'}
          ]
        }
      }
    );

    expect(callback).toHaveBeenCalled()
  });

  it('supports rendering color as background', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {color: '#f00'}})} />
      )

    expect(container.querySelector('div[style]'))
        .toHaveAttribute('style', expect.stringContaining('rgb(255, 0, 0)'));
  });

  it('supports rendering color via legacy image prop', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: '#f00'}})} />
      )

    expect(container.querySelector('div[style]'))
        .toHaveAttribute('style', expect.stringContaining('rgb(255, 0, 0)'));
  });

  describe('with video', () => {
    it('does not render video when outside viewport', () => {
      const {queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      expect(queryPlayerByFilePermaId(100)).toBeNull();
    });

    it('renders video when near viewport', () => {
      const {simulateScrollPosition, queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('near viewport');

      expect(queryPlayerByFilePermaId(100)).not.toBeNull();
    });

    it('plays without volume when scrolled into viewport', () => {
      const {simulateScrollPosition, getPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('in viewport');
      const player = getPlayerByFilePermaId(100);

      expect(player.changeVolumeFactor).toHaveBeenCalledWith(0, 0);
      expect(player.playOrPlayOnLoad).toHaveBeenCalled();
    });

    it('fades in volume when section becomes active', () => {
      const {simulateScrollPosition, getPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('in viewport');
      const player = getPlayerByFilePermaId(100);
      simulateScrollPosition('center of viewport');

      expect(player.changeVolumeFactor).toHaveBeenCalledWith(1, 1000);
    });

    it('fades out volume when section becomes inactive', () => {
      const {simulateScrollPosition, getPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('in viewport');
      const player = getPlayerByFilePermaId(100);
      simulateScrollPosition('center of viewport');
      simulateScrollPosition('in viewport');

      expect(player.changeVolumeFactor).toHaveBeenCalledWith(0, 1000);
    });

    it('pauses when scrolled outside viewport', () => {
      const {simulateScrollPosition, getPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('in viewport');
      simulateScrollPosition('near viewport');
      const player = getPlayerByFilePermaId(100);

      expect(player.pause).toHaveBeenCalled();
    });

    it('invokes onMotifAreaUpdate callback', () => {
      const callback = jest.fn();
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100}})}
                        onMotifAreaUpdate={callback} />,
        {
          seed: {
            videoFiles: [{permaId: 100}]
          }
        }
      );

      expect(callback).toHaveBeenCalled();
    });

    it('supports applying effects', () => {
      const {container} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({
            backdrop: {video: 100},
            backdropEffects: [{name: 'blur', value: 100}]
          })} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      expect(
        container.querySelector('[style*="filter"]').style.filter
      ).toEqual('blur(10px)');
    });

    it('supports rendering mobile video given by id in portrait orientation', () => {
      usePortraitOrientation.mockReturnValue(true);

      const {simulateScrollPosition, queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100, videoMobile: 200}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [
                {permaId: 100},
                {permaId: 200},
              ]
            }
          }
        )

      simulateScrollPosition('near viewport');

      expect(queryPlayerByFilePermaId(200)).not.toBeNull();
    });

    it('uses default video in landscape orientation even if mobile video is configured', () => {
      usePortraitOrientation.mockReturnValue(false);

      const {simulateScrollPosition, queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {video: 100, videoMobile: 200}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [
                {permaId: 100},
                {permaId: 200},
              ]
            }
          }
        )

      simulateScrollPosition('near viewport');

      expect(queryPlayerByFilePermaId(100)).not.toBeNull();
    });

    it('falls back to portrait video if default video is not defined', () => {
      usePortraitOrientation.mockReturnValue(false);

      const {simulateScrollPosition, queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {videoMobile: 200}})} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [
                {permaId: 200},
              ]
            }
          }
        )

      simulateScrollPosition('near viewport');

      expect(queryPlayerByFilePermaId(200)).not.toBeNull();
    });

    it('supports applying effects to protrait video', () => {
      usePortraitOrientation.mockReturnValue(true);

      const {container} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({
            backdrop: {video: 100, videoMobile: 200},
            backdropEffectsMobile: [{name: 'blur', value: 100}],
          })} />,
          {
            seed: {
              videoFiles: [
                {permaId: 100},
                {permaId: 200},
              ]
            }
          }
        )

      expect(
        container.querySelector('[style*="filter"]').style.filter
      ).toEqual('blur(10px)');
    });

    it('does not apply portrait effects to landscape video', () => {
      usePortraitOrientation.mockReturnValue(false);

      const {container} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({
            backdrop: {video: 100, videoMobile: 200},
            backdropEffectsMobile: [{name: 'blur', value: 100}],
          })} />,
          {
            seed: {
              videoFiles: [
                {permaId: 100},
                {permaId: 200},
              ]
            }
          }
        )

      expect(container.querySelector('[style*="filter"]')).toBeNull();
    });
  });

  describe('with content element', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('test', {
        component: function Probe({contentElementId, sectionProps}) {
          return (
            <div data-testid={`contentElement-${contentElementId}`}>
              {sectionProps.isIntersecting ? 'Intersecting' : ''}
              Container height: {sectionProps.containerDimension.height}
            </div>
          );
        }
      });
    });

    it('renders content element passing isIntersecting and containerDimension', () => {
      const {queryByTestId} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({id: 1, backdrop: {contentElement: 100}})}
                          motifAreaState={{isMotifIntersected: true}} />,
          {
            seed: {
              sections: [{id: 1}],
              contentElements: [
                {
                  id: 10,
                  sectionId: 1,
                  permaId: 100,
                  typeName: 'test',
                  configuration: {position: 'backdrop'}
                }
              ]
            }
          }
        );

      expect(queryByTestId('contentElement-10')).toHaveTextContent('Intersecting');
      expect(queryByTestId('contentElement-10')).toHaveTextContent('Container height: 0');
    });

    it('renders nothing if content element has been deleted', () => {
      const {container} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({backdrop: {contentElement: 100}})}
                          motifAreaState={{}} />,
          {
            seed: {
              contentElements: []
            }
          }
        );

      expect(container.textContent).toEqual('');
    });

    it('renders nothing if content element references element in other section', () => {
      const {container} =
        renderInEntryWithSectionLifecycle(
          () => <Backdrop backdrop={useBackdrop({id: 1, backdrop: {contentElement: 100}})}
                          motifAreaState={{}} />,
          {
            seed: {
              sections: [
                {id: 1},
                {id: 2}
              ],
              contentElements: [
                {
                  id: 10,
                  permaId: 100,
                  sectionId: 2,
                  typeName: 'test',
                  configuration: {position: 'backdrop'}
                }
              ]
            }
          }
        );

      expect(container.textContent).toEqual('');
    });
  });

  it('hides element to unload compositor layer by default', () => {
    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({})} />
      );

    expect(container.querySelector(`.${styles.noCompositionLayer}`)).not.toBeNull()
  });

  it('makes element visible when near viewport', () => {
    const {container, simulateScrollPosition} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({})} />
      );

    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${styles.noCompositionLayer}`)).toBeNull()
  });

  it('makes element visible when eagerLoad prop is set', () => {
    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop eagerLoad={true} backdrop={useBackdrop({})} />
      );

    expect(container.querySelector(`.${styles.noCompositionLayer}`)).toBeNull()
  });
});
