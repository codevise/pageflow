import {createLegacyConfigurationDelegator} from 'contentElements/counter/createLegacyConfigurationDelegator';

describe('createLegacyConfigurationDelegator', () => {
  it('returns numberSize when set', () => {
    const model = fakeModel({numberSize: 'lg'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('lg');
  });

  it('maps legacy textSize large to xxxl', () => {
    const model = fakeModel({textSize: 'large'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('xxxl');
  });

  it('maps legacy textSize medium to xl', () => {
    const model = fakeModel({textSize: 'medium'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('xl');
  });

  it('maps legacy textSize small to md', () => {
    const model = fakeModel({textSize: 'small'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('md');
  });

  it('maps legacy textSize verySmall to xs', () => {
    const model = fakeModel({textSize: 'verySmall'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('xs');
  });

  it('prefers numberSize over textSize', () => {
    const model = fakeModel({numberSize: 'sm', textSize: 'large'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('numberSize')).toBe('sm');
  });

  it('returns countingAnimation when set', () => {
    const model = fakeModel({countingAnimation: 'wheel'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('countingAnimation')).toBe('wheel');
  });

  it('defaults countingAnimation to plain when countingSpeed is set', () => {
    const model = fakeModel({countingSpeed: 'medium'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('countingAnimation')).toBe('plain');
  });

  it('does not default countingAnimation when countingSpeed is none', () => {
    const model = fakeModel({countingSpeed: 'none'});
    const delegator = createLegacyConfigurationDelegator(model);

    expect(delegator.get('countingAnimation')).toBeUndefined();
  });

  it('passes through other properties', () => {
    const model = fakeModel({unit: 'kg'});
    const delegator = createLegacyConfigurationDelegator(model);

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
