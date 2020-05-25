import {
  getTransitionNames,
  getAvailableTransitionNames,
  getTransitionStylesName
} from 'frontend/transitions';

describe('getTransitionNames', () => {
  it('returns array of names', () => {
    const result = getTransitionNames();

    expect(result).toContain('scroll');
    expect(result).toContain('fade');
  });
});

describe('getAvailableTransitions', () => {
  it('offers fade transitions if section and previous section both have full height', () => {
    const section = {fullHeight: true};
    const previousSection = {fullHeight: true};

    const result = getAvailableTransitionNames(section, previousSection);

    expect(result).toContain('fade');
    expect(result).toContain('fadeBg');
  });

  it('does not offer fade transitions if section does not have full height', () => {
    const section = {};
    const previousSection = {fullHeight: true};

    const result = getAvailableTransitionNames(section, previousSection);

    expect(result).toContain('scroll');
    expect(result).not.toContain('fade');
    expect(result).not.toContain('fadeBg');
  });

  it('does not offer fade transitions if previous section does not have full height', () => {
    const section = {fullHeight: true};
    const previousSection = {};

    const result = getAvailableTransitionNames(section, previousSection);

    expect(result).toContain('scroll');
    expect(result).not.toContain('fade');
    expect(result).not.toContain('fadeBg');
  });
});

describe('getTransitionStylesName', () => {
  it('uses fadeIn if both section and previous section have fullHeight', () => {
    const previousSection = {fullHeight: true, transition: 'scroll'};
    const section = {fullHeight: true, transition: 'fade'};
    const nextSection = {transition: 'scroll'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('fadeInScrollOut');
  });

  it('falls back to scrollIn if previous section does not have fullHeight', () => {
    const previousSection = {transition: 'scroll'};
    const section = {fullHeight: true, transition: 'fade'};
    const nextSection = {fullHeight: true, transition: 'scroll'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('scrollInScrollOut');
  });

  it('falls back to scrollIn if section does not have fullHeight', () => {
    const previousSection = {fullHeight: true, transition: 'scroll'};
    const section = {transition: 'fade'};
    const nextSection = {fullHeight: true, transition: 'scroll'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('scrollInScrollOut');
  });

  it('falls back to scrollIn if previous is missing', () => {
    const section = {transition: 'fade'};
    const nextSection = {fullHeight: true, transition: 'scroll'};

    const result = getTransitionStylesName(section, null, nextSection);

    expect(result).toBe('scrollInScrollOut');
  });

  it('uses fadeOut if both section and next section have fullHeight', () => {
    const previousSection = {transition: 'scroll'};
    const section = {fullHeight: true, transition: 'reveal'};
    const nextSection = {fullHeight: true, transition: 'fade'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('revealFadeOut');
  });

  it('falls back to scrollOut if next section does not have fullHeight', () => {
    const previousSection = {transition: 'scroll'};
    const section = {fullHeight: true, transition: 'reveal'};
    const nextSection = {transition: 'fade'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('revealScrollOut');
  });

  it('falls back to scrollOut if section does not have fullHeight', () => {
    const previousSection = {transition: 'scroll'};
    const section = {transition: 'reveal'};
    const nextSection = {fullHeight: true, transition: 'fade'};

    const result = getTransitionStylesName(section, previousSection, nextSection);

    expect(result).toBe('revealScrollOut');
  });

  it('falls back to scrollOut if next section is missing', () => {
    const previousSection = {transition: 'scroll'};
    const section = {transition: 'reveal'};

    const result = getTransitionStylesName(section, previousSection, null);

    expect(result).toBe('revealScrollOut');
  });
});
