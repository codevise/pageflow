import {getAspectRatio} from 'contentElements/vrImage/getAspectRatio';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

describe('getAspectRatio', () => {
  describe('when aspectRatio is not set (auto behavior)', () => {
    it('returns 0.5 for full width', () => {
      const result = getAspectRatio({
        configuration: {},
        contentElementWidth: contentElementWidths.full,
        portraitOrientation: false
      });

      expect(result).toEqual(0.5);
    });

    it('returns 0.75 for non-full width', () => {
      const result = getAspectRatio({
        configuration: {},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(0.75);
    });

    it('returns 0.75 for non-full width when aspectRatio is null', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: null},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(0.75);
    });
  });

  describe('when aspectRatio is set to specific value', () => {
    it('returns correct ratio for wide', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'wide'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(0.5625);
    });

    it('returns correct ratio for narrow', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'narrow'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(0.75);
    });

    it('returns correct ratio for square', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'square'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(1);
    });

    it('returns correct ratio for portrait', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'portrait'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(1.7777);
    });

    it('returns 0.75 for unknown aspect ratio', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'unknown'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: false
      });

      expect(result).toEqual(0.75);
    });

    it('uses specific aspect ratio even for full width', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'square'},
        contentElementWidth: contentElementWidths.full,
        portraitOrientation: false
      });

      expect(result).toEqual(1);
    });
  });

  describe('portrait orientation behavior', () => {
    it('uses portraitAspectRatio when in portrait orientation', () => {
      const result = getAspectRatio({
        configuration: {
          aspectRatio: 'wide',
          portraitAspectRatio: 'square'
        },
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: true
      });

      expect(result).toEqual(1);
    });

    it('uses portraitAspectRatio even when main aspectRatio is not set', () => {
      const result = getAspectRatio({
        configuration: {
          portraitAspectRatio: 'portrait'
        },
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: true
      });

      expect(result).toEqual(1.7777);
    });


    it('falls back to main aspectRatio when portraitAspectRatio is not set', () => {
      const result = getAspectRatio({
        configuration: {aspectRatio: 'square'},
        contentElementWidth: contentElementWidths.md,
        portraitOrientation: true
      });

      expect(result).toEqual(1);
    });

    it('falls back to auto behavior when neither is set in portrait', () => {
      const result = getAspectRatio({
        configuration: {},
        contentElementWidth: contentElementWidths.full,
        portraitOrientation: true
      });

      expect(result).toEqual(0.5);
    });
  });
});