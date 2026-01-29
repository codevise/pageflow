import {useMemo} from 'react';

export function createWheelCharacterFunctions({startValue, targetValue, decimalPlaces = 0, locale = 'en', useGrouping = false}) {
  const hasNegative = startValue < 0 || targetValue < 0;
  const crossesZero = (startValue > 0 && targetValue < 0) || (startValue < 0 && targetValue > 0);
  const absStartValue = Math.abs(startValue);
  const absTargetValue = Math.abs(targetValue);
  const integerDigitCount = Math.max(
    String(Math.round(absTargetValue)).length,
    String(Math.round(absStartValue)).length
  );
  const delta = absTargetValue - absStartValue;
  const range = targetValue - startValue;

  const formatted = absTargetValue.toLocaleString(locale, {
    minimumIntegerDigits: integerDigitCount,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping
  });

  const charFunctions = [];
  let digitIndex = 0;

  for (const char of formatted) {
    if (/\d/.test(char)) {
      const position = integerDigitCount - 1 - digitIndex;
      const divisor = Math.pow(10, position);

      if (crossesZero) {
        charFunctions.push((absValue) => ({
          value: (absValue / divisor) % 10,
          hideZero: position > 0 && absValue < divisor
        }));
      } else {
        const startDigit = Math.floor(absStartValue / divisor) % 10;
        const endDigit = Math.floor(absTargetValue / divisor) % 10;
        const fullRotations = Math.floor(absTargetValue / (divisor * 10)) -
                              Math.floor(absStartValue / (divisor * 10));
        let distance = endDigit - startDigit + fullRotations * 10;
        if (delta < 0 && endDigit > startDigit) distance -= 10;

        charFunctions.push((absValue, progress) => ({
          value: ((startDigit + progress * distance) % 10 + 10) % 10,
          hideZero: position > 0 && absValue < divisor
        }));
      }
      digitIndex++;
    } else if (digitIndex < integerDigitCount) {
      const threshold = Math.pow(10, integerDigitCount - digitIndex);
      charFunctions.push((absValue) => ({text: char, hide: absValue < threshold}));
    } else {
      charFunctions.push(() => ({text: char}));
    }
  }

  if (hasNegative) {
    charFunctions.unshift((absValue, progress, value) => ({text: '-', hide: value > -1}));
  }

  return (value) => {
    const absValue = Math.abs(value);
    const progress = range === 0 ? 0 : (value - startValue) / range;
    return charFunctions.map(fn => fn(absValue, progress, value));
  };
}

export function useWheelCharacters({startValue, targetValue, decimalPlaces = 0, locale = 'en', useGrouping = false}) {
  return useMemo(
    () => createWheelCharacterFunctions({startValue, targetValue, decimalPlaces, locale, useGrouping}),
    [startValue, targetValue, decimalPlaces, locale, useGrouping]
  );
}
