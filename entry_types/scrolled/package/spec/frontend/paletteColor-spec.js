import {paletteColor} from 'frontend/paletteColor';

describe('paletteColor', () => {
  it('returns custom CSS property', () => {
    expect(paletteColor('brand-red')).toEqual('var(--theme-palette-color-brand-red)');
  });

  it('returns undefined if name is undefined', () => {
    expect(paletteColor(undefined)).toBeUndefined();
  });
});
