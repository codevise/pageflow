import {getHeight} from 'frontend/VhFix';

describe('VhFix', () => {
  describe('getHeight', () => {
    it('returns undefined if probe height matches window height', () => {
      const result = getHeight({
        windowHeight: 2000,
        probeHeight: 2000,
        previousHeight: undefined
      });

      expect(result).toBeUndefined();
    });

    it('returns undefined if probe height is greater than window height', () => {
      const result = getHeight({
        windowHeight: 1800,
        probeHeight: 2000,
        previousHeight: undefined
      });

      expect(result).toBeUndefined();
    });

    it('returns window height if probe height is lower than window height', () => {
      const result = getHeight({
        windowHeight: 2100,
        probeHeight: 2000,
        previousHeight: undefined
      });

      expect(result).toEqual(2100);
    });

    it('returns window height if it increases to no longer match probe height', () => {
      const result = getHeight({
        windowHeight: 2100,
        probeHeight: 2000,
        previousHeight: 2000
      });

      expect(result).toEqual(2100);
    });

    it('returns previous height if window height decreases again', () => {
      const result = getHeight({
        windowHeight: 2000,
        probeHeight: 2000,
        previousHeight: 2100
      });

      expect(result).toEqual(2100);
    });

    it('returns window height if it decreases drastically (orientation change)', () => {
      const result = getHeight({
        windowHeight: 1000,
        probeHeight: 1000,
        previousHeight: 2100
      });

      expect(result).toEqual(1000);
    });
  });
});
