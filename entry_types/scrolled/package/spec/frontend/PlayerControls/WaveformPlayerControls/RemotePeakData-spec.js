import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry} from 'support'
import {asyncHandlingOf} from 'support/asyncHandlingOf';
import {enableFetchMocks} from 'jest-fetch-mock'

import {RemotePeakData} from 'frontend/PlayerControls/WaveformPlayerControls/RemotePeakData';
import {useFile} from 'entryState';

enableFetchMocks();

describe('RemotePeakData', () => {
  const fileUrlTemplates = {
    audioFiles: {
      mp3: 'some-host/peaks/:id_partition/audio.mp3',
      peakData: 'some-host/peaks/:id_partition/audio.json'
    }
  };

  it('passes null to children for audio file without peak data', () => {
    const children = jest.fn(() => '');

    renderInEntry(
      () => <RemotePeakData audioFile={useFile({collectionName: 'audioFiles',
                                                permaId: 10})}
                            children={children} />,
      {
        seed: {
          fileUrlTemplates,
          audioFiles: [{permaId: 10, variants: ['mp3']}]
        }
      }
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(null);
  });

  it('passes peak data to children for audio file with peak data', async () => {
    const children = jest.fn(() => '');
    fetch.mockResponse(JSON.stringify({data: [1, 2, 3]}));

    await asyncHandlingOf(() => {
      renderInEntry(
        () => <RemotePeakData audioFile={useFile({collectionName: 'audioFiles',
                                                  permaId: 10})}
                              children={children} />,
        {
          seed: {
            fileUrlTemplates,
            audioFiles: [{permaId: 10, variants: ['mp3', 'peakData']}]
          }
        }
      );
    });

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('passes null to children if audio file is null', () => {
    const children = jest.fn(() => '');

    renderInEntry(
      () => <RemotePeakData audioFile={null}
                            children={children} />,
      {
        seed: {
          fileUrlTemplates
        }
      }
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(null);
  });
});
