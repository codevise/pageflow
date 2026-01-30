import {createWheelCharacterFunctions} from 'contentElements/counter/useWheelCharacters';

describe('createWheelCharacterFunctions', () => {
  function getRotationValues({value, ...params}) {
    return createWheelCharacterFunctions(params)(value);
  }
  it('returns digit values when value equals targetValue', () => {
    const result = getRotationValues({value: 123, startValue: 0, targetValue: 123});

    expect(result.map(r => r.value)).toEqual([1, 2, 3]);
  });

  it('returns digit values when startValue equals targetValue', () => {
    const result = getRotationValues({value: 42, startValue: 42, targetValue: 42});

    expect(result.map(r => r.value)).toEqual([4, 2]);
  });

  it('pads with zeros based on startValue digit count', () => {
    const result = getRotationValues({value: 100, startValue: 1000, targetValue: 100});

    expect(result.map(r => r.value)).toEqual([0, 1, 0, 0]);
  });

  it('returns fractional value for smooth animation', () => {
    const result = getRotationValues({value: 0.5, startValue: 0, targetValue: 1});

    expect(result.map(r => r.value)).toEqual([0.5]);
  });

  it('interpolates all digits based on progress', () => {
    const result = getRotationValues({value: 9.5, startValue: 9, targetValue: 10});

    expect(result.map(r => r.value)).toEqual([0.5, 9.5]);
  });

  it('shows ones at 5 when counting from 0 to 10 at value 5', () => {
    const result = getRotationValues({value: 5, startValue: 0, targetValue: 10});

    expect(result.map(r => r.value)).toEqual([0.5, 5]);
  });

  it('marks leading zeros with hideZero flag', () => {
    const result = getRotationValues({value: 5, startValue: 0, targetValue: 100});

    expect(result[0].hideZero).toBe(true);
    expect(result[1].hideZero).toBe(true);
    expect(result[2].hideZero).toBe(false);
  });

  it('marks leading zeros when counting down to zero', () => {
    const result = getRotationValues({value: 0, startValue: 100, targetValue: 0});

    expect(result[0].hideZero).toBe(true);
    expect(result[1].hideZero).toBe(true);
    expect(result[2].hideZero).toBe(false);
  });

  it('includes minus sign for negative target value', () => {
    const result = getRotationValues({value: -1, startValue: 0, targetValue: -1});

    expect(result).toEqual([
      {text: '-', hide: false},
      {value: 1, hideZero: false}
    ]);
  });

  it('hides minus sign when transitioning to negative integer', () => {
    const result = getRotationValues({value: -0.4, startValue: 0, targetValue: -1});

    expect(result[0]).toEqual({text: '-', hide: true});
  });

  it('shows minus sign for small negative values with decimal places', () => {
    const result = getRotationValues({
      value: -0.1,
      startValue: 0,
      targetValue: -0.5,
      decimalPlaces: 1
    });

    expect(result[0]).toEqual({text: '-', hide: false});
  });

  it('includes hidden minus sign at start when counting to negative', () => {
    const result = getRotationValues({value: 10, startValue: 10, targetValue: -10});

    expect(result[0]).toEqual({text: '-', hide: true});
  });

  it('includes decimal separator for decimal places', () => {
    const result = getRotationValues({
      value: 1.5,
      startValue: 0,
      targetValue: 1.5,
      decimalPlaces: 1,
      locale: 'en'
    });

    expect(result).toEqual([
      {value: 1, hideZero: false},
      {text: '.'},
      {value: 5, hideZero: false}
    ]);
  });

  it('uses locale-specific decimal separator', () => {
    const result = getRotationValues({
      value: 1.5,
      startValue: 0,
      targetValue: 1.5,
      decimalPlaces: 1,
      locale: 'de'
    });

    expect(result[1]).toEqual({text: ','});
  });

  it('shows minus sign when value is negative', () => {
    const result = getRotationValues({value: -1, startValue: 0, targetValue: -10});

    expect(result[0]).toEqual({text: '-', hide: false});
  });

  it('animates digits when counting through zero', () => {
    const result = getRotationValues({value: 0, startValue: 10, targetValue: -10});

    expect(result.filter(r => 'value' in r).map(r => r.value)).toEqual([0, 0]);
  });

  it('includes thousand separators', () => {
    const result = getRotationValues({
      value: 1234,
      startValue: 0,
      targetValue: 1234,
      useGrouping: true,
      locale: 'en'
    });

    expect(result).toEqual([
      {value: 1, hideZero: true},
      {text: ',', hide: false},
      {value: 2, hideZero: false},
      {value: 3, hideZero: false},
      {value: 4, hideZero: false}
    ]);
  });

  it('hides thousand separator when value is smaller', () => {
    const result = getRotationValues({
      value: 500,
      startValue: 0,
      targetValue: 10000,
      useGrouping: true,
      locale: 'en'
    });

    const separators = result.filter(r => 'text' in r && r.text === ',');

    expect(separators).toEqual([
      {text: ',', hide: true}
    ]);
  });

  it('animates hundreds when counting from 10 to 1000', () => {
    const result = getRotationValues({value: 505, startValue: 10, targetValue: 1000});

    const values = result.filter(r => 'value' in r).map(r => r.value);

    expect(values[0]).toBe(0.5); // thousands: 0 → 1, at halfway = 0.5
    expect(values[1]).toBe(5);   // hundreds: 0 → 0 (full rotation), at halfway = 5
    expect(values[2]).toBe(0.5); // tens: 1 → 0 (99 rotations), at halfway = 0.5
    expect(values[3]).toBe(5);   // ones: 0 → 0 (99 rotations), at halfway = 5
  });

  it('animates digits when counting down from 10 to 9', () => {
    const result = getRotationValues({value: 9.5, startValue: 10, targetValue: 9});

    expect(result.map(r => r.value)).toEqual([0.5, 9.5]);
  });

  it('keeps hideZero true while digit value is below 1 when counting up past threshold', () => {
    const result = getRotationValues({value: 10, startValue: 9, targetValue: 15});

    expect(result[0].hideZero).toBe(true);
    expect(result[0].value).toBeCloseTo(1 / 6);
  });

  it('does not hide middle zero at end when digit completes full rotation', () => {
    const result = getRotationValues({value: 100, startValue: 0, targetValue: 100});

    expect(result[1].hideZero).toBe(false);
    expect(result[1].value).toBe(0);
  });

  it('does not hide middle zero at end when start was not a leading zero', () => {
    const result = getRotationValues({value: 100, startValue: 10, targetValue: 100});

    expect(result[1].hideZero).toBe(false);
    expect(result[1].value).toBe(0);
  });

  it('shows correct final digit when crossing zero from negative to positive', () => {
    const result = getRotationValues({value: 9, startValue: -10, targetValue: 9});

    // tens digit should be 0, not 0.9
    expect(result[1].value).toBe(0);
    expect(result[2].value).toBe(9);
  });

  it('shows correct final digit when crossing zero from positive to negative', () => {
    const result = getRotationValues({value: -9, startValue: 10, targetValue: -9});

    expect(result[1].value).toBe(0);
    expect(result[2].value).toBe(9);
  });

  it('works with decimal places when counting from 0 to 0.5', () => {
    const result = getRotationValues({
      value: 0.5,
      startValue: 0,
      targetValue: 0.5,
      decimalPlaces: 1,
      locale: 'en'
    });

    expect(result).toEqual([
      {value: 0, hideZero: false},
      {text: '.'},
      {value: 5, hideZero: false}
    ]);
  });

  it('does not hide leading digit at start when counting down from 1900 to 0', () => {
    const result = getRotationValues({value: 1900, startValue: 1900, targetValue: 0});

    // thousands digit should not have hideZero at value 1900
    expect(result[0].hideZero).toBe(false);
    expect(result[0].value).toBe(1);
  });

  it('hides thousands digit at value 1000 when counting down from 1900', () => {
    const result = getRotationValues({value: 1000, startValue: 1900, targetValue: 0});

    // at 1000, the "0" coming in on the thousands wheel should be hidden
    // since it will become a leading zero
    expect(result[0].hideZero).toBe(true);
  });
});
