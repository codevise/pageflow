import {useMemo} from 'react';

export function useWheelCharacters({
  startValue, targetValue, decimalPlaces = 0, locale = 'en', useGrouping = false
}) {
  return useMemo(
    () => createWheelCharacterFunctions({startValue, targetValue, decimalPlaces, locale, useGrouping}),
    [startValue, targetValue, decimalPlaces, locale, useGrouping]
  );
}

export function createWheelCharacterFunctions({
  startValue, targetValue, decimalPlaces = 0, locale = 'en', useGrouping = false
}) {
  const hasNegative = startValue < 0 || targetValue < 0;
  const crossesZero = (startValue > 0 && targetValue < 0) || (startValue < 0 && targetValue > 0);
  const absStartValue = Math.abs(startValue);
  const absTargetValue = Math.abs(targetValue);
  const integerDigitCount = Math.max(
    String(Math.round(absTargetValue)).length,
    String(Math.round(absStartValue)).length
  );

  const formatted = absTargetValue.toLocaleString(locale, {
    minimumIntegerDigits: integerDigitCount,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping
  });

  let digitIndex = 0;

  const charFunctions = [...formatted].map((char) => {
    if (/\d/.test(char)) {
      const position = integerDigitCount - digitIndex++ - 1;
      const divisor = Math.pow(10, position);

      if (crossesZero) {
        const toZero = createDigitCharFunction(position, divisor, absStartValue, 0);
        const fromZero = createDigitCharFunction(position, divisor, 0, absTargetValue);
        const inFirstSegment = (value) => startValue < 0 ? value < 0 : value > 0;

        return (value, progress) =>
          inFirstSegment(value) ?
            toZero(value, (value - startValue) / -startValue) :
            fromZero(value, value / targetValue);
      } else {
        return createDigitCharFunction(position, divisor, absStartValue, absTargetValue);
      }
    } else if (digitIndex < integerDigitCount) {
      const threshold = Math.pow(10, integerDigitCount - digitIndex);
      return (value) => ({text: char, hide: Math.abs(value) < threshold});
    } else {
      return () => ({text: char});
    }
  });

  if (hasNegative) {
    const minusThreshold = -Math.pow(10, -decimalPlaces);
    charFunctions.unshift((value) => ({text: '-', hide: value > minusThreshold}));
  }

  const range = targetValue - startValue;

  return (value) => {
    const progress = range === 0 ? 0 : (value - startValue) / range;
    return charFunctions.map(fn => fn(value, progress));
  };
}

function createDigitCharFunction(position, divisor, segmentStart, segmentEnd) {
  const startDigit = getDigitAtPosition(segmentStart, divisor);
  const endDigit = getDigitAtPosition(segmentEnd, divisor);
  const fullRotations = Math.floor(segmentEnd / (divisor * 10)) -
                        Math.floor(segmentStart / (divisor * 10));
  const distance = endDigit - startDigit + fullRotations * 10;

  return (value, progress) => ({
    value: ((startDigit + progress * distance) % 10 + 10) % 10,
    hideZero: position > 0 && Math.abs(value) < divisor * 1.9
  });
}

function getDigitAtPosition(value, divisor) {
  // Multiply by integer instead of dividing by fraction to avoid floating point errors
  // (e.g., 0.7 / 0.1 = 6.999... but 0.7 * 10 = 7)
  if (divisor < 1) {
    const multiplier = Math.round(1 / divisor);
    return Math.floor(value * multiplier) % 10;
  }
  return Math.floor(value / divisor) % 10;
}
