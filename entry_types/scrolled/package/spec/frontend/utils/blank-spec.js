import {
  isBlank,
  isBlankEditableTextValue,
  presence
} from 'frontend/utils/blank';

describe('isBlank', () => {
  it('returns true for empty string', () => {
    const result = isBlank('');

    expect(result).toBe(true);
  });

  it('returns false for string with characters', () => {
    const result = isBlank(' abc  ');

    expect(result).toBe(false);
  });

  it('returns true for whitespace', () => {
    const result = isBlank('  \t\n');

    expect(result).toBe(true);
  });

  it('returns true for null', () => {
    const result = isBlank(null);

    expect(result).toBe(true);
  });

  it('returns true for undefined', () => {
    const result = isBlank(undefined);

    expect(result).toBe(true);
  });

  it('returns true for html tags that only contain whitespace', () => {
    const result = isBlank('<p>  <br /> <i>\n</i></p>');

    expect(result).toBe(true);
  });

  it(
    'returns true for not wellformed html tags that only contain whitespace',
    () => {
      const result = isBlank('<p>  <br>\t<i></p>');

      expect(result).toBe(true);
    }
  );

  it(
    'returns false for html tags that contain non whitespace characters',
    () => {
      const result = isBlank('<p>  <i>Some text</i></p>');

      expect(result).toBe(false);
    }
  );
});

describe('presence', () => {
  it('returns passed string if not blank', () => {
    const result = presence('something');

    expect(result).toBe('something');
  });

  it('returns null if passed string is blank', () => {
    const result = presence('');

    expect(result).toBeNull();
  });
});

describe('isBlankEditableTextValue', () => {
  it('return true for null', () => {
    expect(isBlankEditableTextValue(null)).toEqual(true);
  });

  it('return true for empty array', () => {
    expect(isBlankEditableTextValue([])).toEqual(true);
  });

  it('returns true for node with single empty text child', () => {
    expect(isBlankEditableTextValue([{children: [{text: ''}]}])).toEqual(true);
  });

  it('returns false for node with non-empty text child', () => {
    expect(isBlankEditableTextValue([{children: [{text: 'some text'}]}])).toEqual(false);
  });

  it('returns false for multiple  nodes with empty text child', () => {
    expect(isBlankEditableTextValue([
      {children: [{text: ''}]},
      {children: [{text: ''}]}
    ])).toEqual(false);
  });
});
