import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntryWithSectionLifecycle} from 'support';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import {Backdrop} from 'frontend/Backdrop';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation')

describe('Backdrop', () => {
  useFakeMedia();

  it('does not render image when outside viewport', () => {
    const {queryByRole} =
      renderInEntryWithSectionLifecycle(
        <Backdrop image={100} />,
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
        <Backdrop image={100} />,
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

  it('supports rendering mobile image given by id in portrait orientation', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {simulateScrollPosition, getByRole} =
      renderInEntryWithSectionLifecycle(
        <Backdrop image={100} imageMobile={200} />,
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
        <Backdrop image={100} imageMobile={200} />,
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
        <Backdrop imageMobile={200} />,
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

  it('supports rendering color as background', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {container} =
      renderInEntryWithSectionLifecycle(
        <Backdrop color="#f00" />
      )

    expect(container.querySelector('div[style]'))
        .toHaveAttribute('style', expect.stringContaining('rgb(255, 0, 0)'));
  });

  it('supports rendering color via legacy image prop', () => {
    usePortraitOrientation.mockReturnValue(false);

    const {container} =
      renderInEntryWithSectionLifecycle(
        <Backdrop image="#f00" />
      )

    expect(container.querySelector('div[style]'))
        .toHaveAttribute('style', expect.stringContaining('rgb(255, 0, 0)'));
  });

  describe('with video', () => {
    it('does not render video when outside viewport', () => {
      const {queryPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          <Backdrop video={100} />,
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
          <Backdrop video={100} />,
          {
            queries: fakeMediaRenderQueries,
            seed: {
              videoFiles: [{permaId: 100}]
            }
          }
        );

      simulateScrollPosition('near viewport');

      expect(queryPlayerByFilePermaId(100)).toBeDefined();
    });

    it('plays without volume when scrolled into viewport', () => {
      const {simulateScrollPosition, getPlayerByFilePermaId} =
        renderInEntryWithSectionLifecycle(
          <Backdrop video={100} />,
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
          <Backdrop video={100} />,
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
          <Backdrop video={100} />,
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
          <Backdrop video={100} />,
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
  });
});
