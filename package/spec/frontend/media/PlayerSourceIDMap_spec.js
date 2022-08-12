import {PlayerSourceIDMap} from 'pageflow/frontend';

describe('PlayerSourceIDMap', () => {
  it('returns player obtained from getPlayer with mapped sources for id', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media, {playerOptions: {some: 'options'}});
    const sources = [{src: 'some/audio.mp3'}];
    const player = {};
    media.getPlayer.mockReturnValue(player);

    map.mapSources(5, sources);
    const result = map.get(5);

    expect(result).toBe(player);
    expect(media.getPlayer).toHaveBeenCalledWith(sources,
                                                 expect.objectContaining({filePermaId: 5}));
  });

  it('passes playerOptions to getPlayer', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media, {playerOptions: {some: 'option'}});
    const sources = [{src: 'some/audio.mp3'}];

    map.mapSources(5, sources);
    map.get(5);

    expect(media.getPlayer).toHaveBeenCalledWith(sources,
                                                 expect.objectContaining({some: 'option'}));
  });

  it('keeps two most recent players allocated', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media, {playerOptions: {some: 'option'}})
    const sources = [{src: 'some/audio.mp3'}];

    map.mapSources(5, sources);
    map.mapSources(6, sources);
    map.mapSources(7, sources);
    const firstPlayer = map.get(5);
    const secondPlayer = map.get(6);
    map.get(7);

    expect(media.releasePlayer).not.toHaveBeenCalledWith(secondPlayer);
    expect(media.releasePlayer).toHaveBeenCalledWith(firstPlayer);
  });

  it('does not request same player again', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media)
    const sources = [{src: 'some/audio.mp3'}];

    map.mapSources(5, sources);
    map.get(5);
    map.get(5);

    expect(media.releasePlayer).not.toHaveBeenCalled();
    expect(media.getPlayer).toHaveBeenCalledTimes(1);
  });

  it('reuses previous player if it is requested again', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media, {playerOptions: {some: 'option'}})
    const sources = [{src: 'some/audio.mp3'}];

    map.mapSources(5, sources);
    map.mapSources(6, sources);
    map.get(5);
    map.get(6);
    map.get(5);

    expect(media.releasePlayer).not.toHaveBeenCalled();
    expect(media.getPlayer).toHaveBeenCalledTimes(2);
  });

  it('returns null players for undefined id', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media)

    const player = map.get(undefined);

    expect(player.play).toBeDefined();
    expect(media.getPlayer).not.toHaveBeenCalled();
  });

  it('returns null players if undefined sources have been stored', () => {
    const media = fakeMedia();
    const map = new PlayerSourceIDMap(media)

    map.mapSources(5, undefined);
    const player = map.get(5);

    expect(player.play).toBeDefined();
    expect(media.getPlayer).not.toHaveBeenCalled();
  });

  function fakeMedia() {
    const players = {}
    return {
      getPlayer: jest.fn().mockImplementation((sources, {filePermaId, playerId}) =>
        players[filePermaId] = players[filePermaId] || {filePermaId, playerId}
      ),
      releasePlayer: jest.fn()
    }
  }
});
