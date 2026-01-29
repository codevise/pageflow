import React from 'react';
import {render} from '@testing-library/react';

import {WheelNumber} from 'contentElements/counter/WheelNumber';

import '@testing-library/jest-dom/extend-expect';

describe('WheelNumber', () => {
  function renderWheelNumber(props) {
    return render(
      <WheelNumber
        value={0}
        startValue={0}
        targetValue={100}
        {...props}
      />
    );
  }

  it('renders 3 wheels with 10 digits each for 3-digit target value', () => {
    const {container} = renderWheelNumber();

    const digitSpans = Array.from(container.querySelectorAll('span')).filter(span =>
      /^\d$/.test(span.textContent)
    );

    expect(digitSpans.length).toBe(30); // 3 wheels × 10 digits
  });

  it('sets rotation values to show correct digits when value equals target', () => {
    const {container} = renderWheelNumber({
      value: 123,
      targetValue: 123
    });

    const zeroDigits = Array.from(container.querySelectorAll('span')).filter(span =>
      span.textContent === '0'
    );

    const rotationValues = zeroDigits.map(digit =>
      parseFloat(digit.parentElement.style.getPropertyValue('--val'))
    );

    expect(rotationValues).toEqual([1, 2, 3]);
  });

  it('hides zero digit in leading zero wheels', () => {
    const {container} = renderWheelNumber({
      value: 5,
      startValue: 0,
      targetValue: 100
    });

    const wheels = container.querySelectorAll('[class*="wheel"]');
    const getDigit = (wheel, d) => Array.from(wheel.children).find(span => span.textContent === String(d));

    expect(getDigit(wheels[0], 0)).not.toBeVisible();
    expect(getDigit(wheels[0], 1)).toBeVisible();
    expect(getDigit(wheels[1], 0)).not.toBeVisible();
    expect(getDigit(wheels[1], 1)).toBeVisible();
    expect(getDigit(wheels[2], 0)).toBeVisible();
  });

  it('renders text entries as static text', () => {
    const {container} = renderWheelNumber({
      value: -1,
      startValue: 0,
      targetValue: -1
    });

    expect(container.textContent).toContain('-');

    const wheels = container.querySelectorAll('[class*="wheel"]');
    expect(wheels.length).toBe(1);
  });

  it('applies hidden class to text entries with hide flag', () => {
    const {container} = renderWheelNumber({
      value: -0.4,
      startValue: 0,
      targetValue: -1
    });

    const minusSpan = Array.from(container.querySelectorAll('span')).find(
      span => span.textContent === '-'
    );

    expect(minusSpan.className).toMatch(/hidden/);
  });
});
