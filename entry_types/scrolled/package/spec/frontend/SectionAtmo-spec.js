import React from 'react';

import {SectionAtmo} from 'frontend/SectionAtmo';
import {AtmoContext} from 'frontend/useAtmo';
import {useFile} from 'entryState';

import {renderInEntry} from 'support';

describe('SectionAtmo', () => {
  let updateAtmo, wrapper;

  beforeEach(() => {
    updateAtmo = jest.fn();
    wrapper = function AtmoProvider({children}) {
      return <AtmoContext.Provider value={{updateAtmo}} children={children} />
    }
  });

  it('updates atmo when audio file is selected', () => {
    const seed = {
      audioFiles: [{permaId: 5}]
    };

    const {rerender} = renderInEntry(() => <SectionAtmo audioFile={null} />, {seed, wrapper});
    rerender(
      () => <SectionAtmo audioFile={useFile({collectionName: 'audioFiles', permaId: 5})} />,
      {seed, wrapper}
    );

    expect(updateAtmo).toHaveBeenCalledWith(expect.objectContaining({audioFilePermaId: 5}));
  });

  it('updates atmo when audio file is changed', () => {
    const seed = {
      audioFiles: [{permaId: 5}, {permaId: 6}]
    };

    const {rerender} = renderInEntry(
      () => <SectionAtmo audioFile={useFile({collectionName: 'audioFiles', permaId: 5})} />,
      {seed, wrapper}
    );
    rerender(
      () => <SectionAtmo audioFile={useFile({collectionName: 'audioFiles', permaId: 6})} />,
      {seed, wrapper}
    );

    expect(updateAtmo).toHaveBeenCalledWith(expect.objectContaining({audioFilePermaId: 6}));
  });

  it('updates atmo when audio file is unset', () => {
    const seed = {
      audioFiles: [{permaId: 5}]
    };

    const {rerender} = renderInEntry(
      () => <SectionAtmo audioFile={useFile({collectionName: 'audioFiles', permaId: 5})} />,
      {seed, wrapper}
    );
    rerender(() => <SectionAtmo audioFile={null} />, {seed, wrapper});

    expect(updateAtmo).toHaveBeenCalledWith(expect.objectContaining({audioFilePermaId: undefined}));
  });

  it('does not update atmo on first render', () => {
    const seed = {
      audioFiles: [{permaId: 5}]
    };

    renderInEntry(
      () => <SectionAtmo audioFile={useFile({collectionName: 'audioFiles', permaId: 5})} />,
      {seed, wrapper}
    );

    expect(updateAtmo).not.toHaveBeenCalled();
  });
});
