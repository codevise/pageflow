import camelize from '../camelize';


describe('camelize', () => {
  it('turns snake case into camel case', () => {
    const result = camelize('in_snake_case');

    expect(result).toBe('inSnakeCase');
  });
});

describe('camelize.keys', () => {
  it('returns object with camelized keys', () => {
    const result = camelize.keys({'in_snake_case': 5});

    expect(result).toEqual({inSnakeCase: 5});
  });
});

describe('camelize.deep', () => {
  it('camelized keys in nested structure', () => {
    const result = camelize.deep({
      'an_array': [{'some_key': 5}],
      'nested_object': {'some_key': 6}
    });

    expect(result).toEqual({
      anArray: [{someKey: 5}],
      nestedObject: {someKey: 6}
    });
  });
});

describe('camelize.concat', () => {
  it('concats camelized strings into a new one', () => {
    const result = camelize.concat('somePrefix', 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  it('skips null parts', () => {
    const result = camelize.concat(null, 'somePrefix', null, 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  it('skips undefined parts', () => {
    const result = camelize.concat(undefined, 'somePrefix', undefined, 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });

  it('skips empty strings', () => {
    const result = camelize.concat('', 'somePrefix', 'forA', 'camelizedString');

    expect(result).toBe('somePrefixForACamelizedString');
  });
});
