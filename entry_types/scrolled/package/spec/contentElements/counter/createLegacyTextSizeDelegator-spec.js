import {createLegacyTextSizeDelegator} from 'contentElements/counter/createLegacyTextSizeDelegator';

describe('createLegacyTextSizeDelegator', () => {
  it('returns numberSize when set', () => {
    const model = fakeModel({numberSize: 'lg'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('lg');
  });

  it('maps legacy textSize large to xxxl', () => {
    const model = fakeModel({textSize: 'large'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('xxxl');
  });

  it('maps legacy textSize medium to xl', () => {
    const model = fakeModel({textSize: 'medium'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('xl');
  });

  it('maps legacy textSize small to md', () => {
    const model = fakeModel({textSize: 'small'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('md');
  });

  it('maps legacy textSize verySmall to xs', () => {
    const model = fakeModel({textSize: 'verySmall'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('xs');
  });

  it('prefers numberSize over textSize', () => {
    const model = fakeModel({numberSize: 'sm', textSize: 'large'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('numberSize')).toBe('sm');
  });

  it('passes through other properties', () => {
    const model = fakeModel({unit: 'kg'});
    const delegator = createLegacyTextSizeDelegator(model);

    expect(delegator.get('unit')).toBe('kg');
  });

  function fakeModel(attributes) {
    return {
      get(name) {
        return attributes[name];
      },
      has(name) {
        return name in attributes;
      }
    };
  }
});
