import {shallowEqual} from 'frontend/utils/shallowEqual';

describe('shallowEqual', () => {
  it('returns true for objects with same keys and values', () => {
    expect(shallowEqual({a: 1, b: 'x'}, {b: 'x', a: 1})).toBe(true);
  });

  it('returns false if a value differs', () => {
    expect(shallowEqual({a: 1}, {a: 2})).toBe(false);
  });

  it('returns false if key count differs', () => {
    expect(shallowEqual({a: 1}, {a: 1, b: 2})).toBe(false);
  });

  it('returns false for different keys with undefined values', () => {
    expect(shallowEqual({a: undefined}, {b: undefined})).toBe(false);
  });

  it('compares nested objects by identity', () => {
    expect(shallowEqual({a: {}}, {a: {}})).toBe(false);
  });
});
