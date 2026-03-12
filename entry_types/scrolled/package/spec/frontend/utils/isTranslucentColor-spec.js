import {isTranslucentColor} from 'frontend/utils/isTranslucentColor';

describe('isTranslucentColor', () => {
  it('returns true for color with alpha channel', () => {
    expect(isTranslucentColor('#ff000080')).toBe(true);
  });

  it('returns false for color with ff alpha', () => {
    expect(isTranslucentColor('#ff0000ff')).toBe(false);
  });

  it('returns false for color without alpha', () => {
    expect(isTranslucentColor('#ff0000')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isTranslucentColor(undefined)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isTranslucentColor(null)).toBe(false);
  });
});
