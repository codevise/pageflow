import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntryWithSectionLifecycle} from 'support';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import {Backdrop} from 'frontend/Backdrop';
import {useBackdrop} from 'frontend/useBackdrop';
import {FullscreenDimensionProvider} from 'frontend/Fullscreen';

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

  it('render image when backdrop is active and eagerLoad is true', () => {
    const {getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})}
                        eagerLoad={true}
                        state="active" />,
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

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('does not render image when backdrop is not active event when eagerLoad is true', () => {
    const {queryByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})}
                        eagerLoad={true}
                        state="below" />,
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

  it('renders image when near viewport', () => {
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
      container.querySelector('[style*="--filter"]')
               .style.getPropertyValue('--filter')
    ).toEqual('blur(10px)');
  });

  it('supports rendering mobile image given by id in portrait orientation', () => {
    const {simulateScrollPosition, container, getByRole} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100, imageMobile: 200}
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

    simulateScrollPosition('near viewport');

    expect(getByRole('img'))
      .toHaveAttribute('src', expect.stringContaining('landscape.jpg'));
    expect(container.querySelector('source'))
      .toHaveAttribute('srcset', expect.stringContaining('portrait.jpg'));
  });

  it('ignores mobile image when rendered with custom fullscreen dimensions', () => {
    const {simulateScrollPosition, container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100, imageMobile: 200}
        })} />,
        {
          wrapper: ({children}) =>
            <FullscreenDimensionProvider width={400} height={300}>
              {children}
            </FullscreenDimensionProvider>,
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

    expect(container.querySelector('source')).toBeNull();
  });

  it('supports applying effects to portrait image', () => {
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
      container.querySelector('[style*="--mobile-filter"]')
               .style
               .getPropertyValue('--mobile-filter')
    ).toEqual('blur(10px)');
  });

  it('does not set portrait effects style if not configured', () => {
    const {container} =
      renderInEntryWithSectionLifecycle(
        () => <Backdrop backdrop={useBackdrop({
          backdrop: {image: 100, imageMobile: 200},
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
              {permaId: 100, basename: 'landscape'},
              {permaId: 200, basename: 'portrait'},
            ]
          }
        }
      )

    expect(container.querySelector('[style*="--mobile-filter"]')).toBeNull();
  });

  it('invokes onMotifAreaUpdate callback', () => {
    const callback = jest.fn();
    renderInEntryWithSectionLifecycle(
      () => <Backdrop backdrop={useBackdrop({backdrop: {image: 100}})}
                      onMotifAreaUpdate={callback} />,
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
        container.querySelector('[style*="--filter"]')
                 .style.getPropertyValue('--filter')
      ).toEqual('blur(10px)');
    });
  });
});
