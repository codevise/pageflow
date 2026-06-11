import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';

describe('VideoPlayer poster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('renders given poster image', () => {
    const {getByRole} = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         posterImageFile={useFile({collectionName: 'imageFiles', permaId: 200})} />,
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: ':id_partition/video.mp4'
            },
            imageFiles: {
              large: ':id_partition/large.jpg'
            }
          },
          videoFiles: [
            {id: 1, permaId: 100, isReady: true}
          ],
          imageFiles: [
            {id: 2, permaId: 200, isReady: true}
          ]
        }
      }
    );

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/large.jpg');
  });

  it('falls back to video poster', () => {
    const {getByRole} = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: ':id_partition/video.mp4',
              posterLarge: ':id_partition/poster.jpg'
            }
          },
          videoFiles: [
            {id: 1, permaId: 100, isReady: true}
          ]
        }
      }
    );

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/poster.jpg');
  });
});
