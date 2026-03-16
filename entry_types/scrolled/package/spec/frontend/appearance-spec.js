import {renderHook} from '@testing-library/react-hooks';

import {useAppearanceOverlayStyle} from 'frontend/appearance';

describe('useAppearanceOverlayStyle', () => {
  it('returns empty object for shadow appearance', () => {
    const {result} = renderHook(() =>
      useAppearanceOverlayStyle({appearance: 'shadow'})
    );

    expect(result.current).toEqual({});
  });

  it('returns empty object for transparent appearance', () => {
    const {result} = renderHook(() =>
      useAppearanceOverlayStyle({appearance: 'transparent'})
    );

    expect(result.current).toEqual({});
  });

  describe('cards appearance', () => {
    it('returns backdropFilter for translucent cardSurfaceColor', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'cards',
          cardSurfaceColor: '#ff000080'
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff000080',
        backdropFilter: 'blur(10px)'
      });
    });

    it('does not return backdropFilter for opaque cardSurfaceColor', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'cards',
          cardSurfaceColor: '#ff0000'
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff0000'
      });
    });

    it('does not return backdropFilter when no cardSurfaceColor is set', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({appearance: 'cards'})
      );

      expect(result.current).toEqual({});
    });

    it('scales overlayBackdropBlur to max 10px', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'cards',
          cardSurfaceColor: '#ff000080',
          overlayBackdropBlur: 50
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff000080',
        backdropFilter: 'blur(5px)'
      });
    });

    it('does not return backdropFilter when overlayBackdropBlur is 0', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'cards',
          cardSurfaceColor: '#ff000080',
          overlayBackdropBlur: 0
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff000080'
      });
    });
  });

  describe('split appearance', () => {
    it('returns backdropFilter for translucent splitOverlayColor', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'split',
          splitOverlayColor: '#ff000080',
          overlayBackdropBlur: 50
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff000080',
        backdropFilter: 'blur(5px)'
      });
    });

    it('returns default backdropFilter when no splitOverlayColor is set', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({appearance: 'split'})
      );

      expect(result.current).toEqual({backdropFilter: 'blur(10px)'});
    });

    it('does not return backdropFilter for opaque splitOverlayColor', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'split',
          splitOverlayColor: '#ff0000'
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff0000'
      });
    });

    it('returns default backdropFilter for translucent splitOverlayColor', () => {
      const {result} = renderHook(() =>
        useAppearanceOverlayStyle({
          appearance: 'split',
          splitOverlayColor: '#ff000080'
        })
      );

      expect(result.current).toEqual({
        backgroundColor: '#ff000080',
        backdropFilter: 'blur(10px)'
      });
    });
  });
});
