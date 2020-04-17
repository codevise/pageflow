import {formatTimeDuration} from '../iso8601';


describe('timeDuration', () => {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;

  it('formats seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds);

    expect(result).toBe('PT6S');
  });

  it('rounds seconds long duration', () => {
    const result = formatTimeDuration(6 * seconds + 120);

    expect(result).toBe('PT6S');
  });

  it('formats minute long duration', () => {
    const result = formatTimeDuration(10 * minutes + 59 * seconds);

    expect(result).toBe('PT10M59S');
  });

  it('formats hour long duration', () => {
    const result = formatTimeDuration(3 * hours + 10 * minutes + 59 * seconds);

    expect(result).toBe('PT3H10M59S');
  });

  it('skips zero components', () => {
    const result = formatTimeDuration(3 * hours);

    expect(result).toBe('PT3H');
  });

  it('formats zero correctly', () => {
    const result = formatTimeDuration(0);

    expect(result).toBe('PT0S');
  });
});
