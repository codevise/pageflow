import '$support/mediaElementStub';
import '$support/fakeBrowserFeatures';
import {MediaPool, MediaType} from 'pageflow/frontend';

describe('MediaPool', function() {

  it('create an empty pool of audio and video players', function () {
    let pool = new MediaPool();
    
    expect(pool).toBeDefined();
    expect(pool.playerCount).toBeGreaterThan(1);
    expect(pool.allPlayersForType(MediaType.AUDIO).length).toBe(0);
    expect(pool.allPlayersForType(MediaType.VIDEO).length).toBe(0);
  });
  

  describe('#allocatePlayer', function() {

    it('triggers call to populate pool with players', function () {
      let pool = new MediaPool();
      pool.allocatePlayer({
        playerType: MediaType.AUDIO
      });
      expect(pool.allPlayersForType(MediaType.AUDIO).length).toBe(pool.playerCount);
      expect(pool.allPlayersForType(MediaType.VIDEO).length).toBe(pool.playerCount);
      expect(pool.unAllocatedPlayers[MediaType.AUDIO].length).toBe(pool.playerCount-1);
      expect(pool.allocatedPlayers[MediaType.AUDIO].length).toBe(1);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount);
    });

    it('allocates one audio player and return it', function () {
      let pool = new MediaPool();
      let player = pool.allocatePlayer({
        playerType: MediaType.AUDIO
      });
      expect(player).toBeDefined();
      expect(pool.allocatedPlayers[MediaType.AUDIO][0]).toBe(player);
      expect(pool.getMediaTypeFromEl(player.el())).toBe(MediaType.AUDIO);
    });

    it('allocates one video player and return it', function () {
      let pool = new MediaPool();
      let player = pool.allocatePlayer({
        playerType: MediaType.VIDEO
      });
      expect(player).toBeDefined();
      expect(pool.allocatedPlayers[MediaType.VIDEO][0]).toBe(player);
      expect(pool.getMediaTypeFromEl(player.el())).toBe(MediaType.VIDEO);
    });

    it('reallocates the first allocated player if there is no more available player', function () {
      let pool = new MediaPool();
      for(let i = 0; i < pool.playerCount; i++){
        pool.allocatePlayer({
          playerType: MediaType.VIDEO
        });
      }
      
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(0);
      
      let firstPlayer = pool.allocatedPlayers[MediaType.VIDEO][0];
      let player = pool.allocatePlayer({
        playerType: MediaType.VIDEO
      });
      
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(0);
      
      expect(player).toBeDefined();
      expect(player).toBe(firstPlayer);
    });

  });

  describe('#unallocatePlayer', function() {

    it('unAllocates the given player', function () {
      let pool = new MediaPool();
      let player = pool.allocatePlayer({playerType: MediaType.VIDEO});
      expect(pool.allocatedPlayers[MediaType.VIDEO].length).toBe(1);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount-1);

      pool.unAllocatePlayer(player);
      expect(pool.allocatedPlayers[MediaType.VIDEO].length).toBe(0);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount);
    });

    it('do not unAllocate if no player is given', function () {
      let pool = new MediaPool();
      pool.allocatePlayer({playerType: MediaType.VIDEO});
      expect(pool.allocatedPlayers[MediaType.VIDEO].length).toBe(1);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount-1);

      pool.unAllocatePlayer();
      expect(pool.allocatedPlayers[MediaType.VIDEO].length).toBe(1);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount-1);
    });

    it('removes the player\'s src attribute', function () {
      let pool = new MediaPool();
      let player = pool.allocatePlayer({playerType: MediaType.VIDEO});
      player.getMediaElement().setAttribute('src', 'www.example.com/test.mp4');
      expect(player.getMediaElement().hasAttribute('src')).toBe(true);

      pool.unAllocatePlayer(player);
      expect(player.getMediaElement().hasAttribute('src')).toBe(false);
    });

  });

  describe('#blessAll', function() {
    
    it('triggers call to populate pool with players', function () {
      let pool = new MediaPool();
      pool.blessAll(true);

      expect(pool.allPlayersForType(MediaType.AUDIO).length).toBe(pool.playerCount);
      expect(pool.allPlayersForType(MediaType.VIDEO).length).toBe(pool.playerCount);
      expect(pool.unAllocatedPlayers[MediaType.AUDIO].length).toBe(pool.playerCount);
      expect(pool.unAllocatedPlayers[MediaType.VIDEO].length).toBe(pool.playerCount);
      expect(pool.allocatedPlayers[MediaType.AUDIO].length).toBe(0);
      expect(pool.allocatedPlayers[MediaType.VIDEO].length).toBe(0);
    });

    it('blesses all the players with the given mute value', done => {
      let pool = new MediaPool();
      pool.blessAll(false);
      
      pool.forEachMediaType((key) => {
        let type = MediaType[key];
        pool.allPlayersForType(type).forEach((player) => {
          expect(player.muted()).toBe(false);
        });
      });
      
      pool.blessAll(true);

      pool.forEachMediaType((key) => {
        let type = MediaType[key];
        pool.allPlayersForType(type).forEach((player) => {
          expect(player.muted()).toBe(true);
          done();
        });
      });
    });

  });

});