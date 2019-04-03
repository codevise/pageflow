import {formatTimeDuration} from '../iso8601';

import {expect} from 'support/chai';

describe('timeDuration', () => {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;

  it('formats seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds);

    expect(result).to.eq('PT6S');
  });

  it('rounds seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds + 120);

    expect(result).to.eq('PT6S');
  });

  it('formats minute long duration', () => {
    const result = formatTimeDuration(10 * minutes + 59 * seconds);

    expect(result).to.eq('PT10M59S');
  });

  it('formats hour long duration', () => {
    const result = formatTimeDuration(3 * hours + 10 * minutes + 59 * seconds);

    expect(result).to.eq('PT3H10M59S');
  });

  it('skips zero components', () => {
    const result = formatTimeDuration(3 * hours);

    expect(result).to.eq('PT3H');
  });

  it('formats zero correctly', () => {
    const result = formatTimeDuration(0);

    expect(result).to.eq('PT0S');
  });
});
