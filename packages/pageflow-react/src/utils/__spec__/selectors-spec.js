import {prop, map, has} from '../selectors';

import sinon from 'sinon';

describe('prop selector', () => {
  it('returns prop with given name', () => {
    const state = {};
    const props = {label: 'Text'};

    const result = prop('label')(state, props);

    expect(result).toBe('Text');
  });

  it('supports path lookup', () => {
    const state = {};
    const props = {nested: {label: 'Text'}};

    const result = prop('nested.label')(state, props);

    expect(result).toBe('Text');
  });

  it('throws error if top level prop is missing', () => {
    const state = {};
    const props = {};

    expect(() => {
      prop('label')(state, props);
    }).toThrowError(/Missing required prop/);
  });

  it('returns undefined if nested prop is missing', () => {
    const state = {};
    const props = {nested: {}};

    const result = prop('nested.not.there')(state, props);

    expect(result).toBeUndefined();
  });
});

describe('has selector', () => {
  it('returns selector that returns state of given featue flag', () => {
    const browser = {
      has(featureName) {
        return featureName == 'some present feature';
      }
    };

    const resultForPresentFeature = has('some present feature')({}, {}, browser);
    const resultForAbsentFeature = has('some absent feature')({}, {}, browser);

    expect(resultForPresentFeature).toBe(true);
    expect(resultForAbsentFeature).toBe(false);
  });
});
