import 'contentElements/heading/review';
import {review} from 'review';

describe('contentElements/heading/review', () => {
  const extractQuote = review.contentElementTypes.findExtractQuote('heading');

  function inlineValue(...texts) {
    return [{children: texts.map(text => ({text}))}];
  }

  it('returns the heading text', () => {
    expect(extractQuote({value: inlineValue('A headline')})).toEqual('A headline');
  });

  it('joins the text of adjacent marks', () => {
    expect(extractQuote({value: inlineValue('A ', 'bold', ' headline')}))
      .toEqual('A bold headline');
  });

  it('includes tagline and subtitle in reading order', () => {
    const configuration = {
      tagline: inlineValue('Tagline'),
      value: inlineValue('A headline'),
      subtitle: inlineValue('Subtitle')
    };

    expect(extractQuote(configuration)).toEqual('Tagline\nA headline\nSubtitle');
  });

  it('skips blank taglines and subtitles', () => {
    const configuration = {
      tagline: inlineValue(''),
      value: inlineValue('A headline'),
      subtitle: undefined
    };

    expect(extractQuote(configuration)).toEqual('A headline');
  });

  it('falls back to the legacy string value', () => {
    expect(extractQuote({children: 'A legacy headline'})).toEqual('A legacy headline');
  });

  it('prefers the inline text value over the legacy string value', () => {
    const configuration = {
      value: inlineValue('A headline'),
      children: 'A legacy headline'
    };

    expect(extractQuote(configuration)).toEqual('A headline');
  });

  it('does not fall back to the legacy value once the heading was emptied', () => {
    const configuration = {
      value: inlineValue(''),
      children: 'A legacy headline'
    };

    expect(extractQuote(configuration)).toBeNull();
  });

  it('returns null for headings without any text', () => {
    expect(extractQuote({})).toBeNull();
  });

  it('ignores a range since heading comments cover the whole element', () => {
    const range = {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 1}};

    expect(extractQuote({value: inlineValue('A headline')}, range)).toEqual('A headline');
  });
});
