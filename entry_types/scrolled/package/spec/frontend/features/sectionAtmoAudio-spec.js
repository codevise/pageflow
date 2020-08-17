

import {act} from '@testing-library/react';

import {media} from 'pageflow/frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {useFakeMedia} from 'support/fakeMedia';
import {fakeParentWindow} from 'support';


describe('section AtmoAudio', () => {
  usePageObjects();
  useFakeMedia();

  beforeEach(() => {
    fakeParentWindow()
  });

  function getAudioFileSeed({
    id = 1,
    permaId = 100,
    basename = 'audio'
  } = {}) {
    return {
      fileUrlTemplates: {
        audioFiles: {
          mp3: ':id_partition/:basename.mp3',
          m4a: ':id_partition/:basename.m4a',
          ogg: ':id_partition/:basename.ogg'
        }
      },
      audioFiles: [
        {id, permaId, isReady: true, basename}
      ]
    };
  }

  it('is played when section becomes active', async () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11, configuration: {transition: 'scroll', atmoAudioFileId: 100}}
        ],
        ...getAudioFileSeed({
          id: 1,
          permaId: 100,
          basename: 'audio'
        })
      }
    });

    await act(async () => {
      media.mute(false);
      getSectionByPermaId(11).simulateScrollingIntoView();
    });

    expect(media.getPlayer).toHaveBeenCalledWith(expect.anything(),
                                                 expect.objectContaining({
                                                   filePermaId: 100,
                                                   tagName: 'audio'
                                                 }));
  });
});
