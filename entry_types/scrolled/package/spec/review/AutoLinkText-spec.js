import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {AutoLinkText} from 'review/AutoLinkText';

describe('AutoLinkText', () => {
  it('turns URLs into links with shortened text and the full URL as title', () => {
    const url = 'https://www.example.com/a/very/long/path/that/keeps/going/without/' +
                'short/segments?utm_campaign=long-url-in-comment-thread';

    const {getByRole} = render(<AutoLinkText text={`Please check ${url}`} />);

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('title', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent(
      'www.example.com/a/very/long/path/that/keeps/…-comment-thread'
    );
  });

  it('shortens display text only when it exceeds 60 characters', () => {
    const sixtyCharacterUrl = `https://${'a'.repeat(56)}.com`;
    const sixtyOneCharacterUrl = `https://${'a'.repeat(57)}.com`;
    const {getByRole, rerender} = render(<AutoLinkText text={sixtyCharacterUrl} />);

    expect(getByRole('link')).toHaveTextContent(sixtyCharacterUrl.slice(8));

    rerender(<AutoLinkText text={sixtyOneCharacterUrl} />);

    expect(getByRole('link').textContent).toHaveLength(60);
    expect(getByRole('link')).toHaveTextContent('…');
  });

  it('does not split Unicode characters when shortening display text', () => {
    const url = `https://example.com/${'a'.repeat(31)}😀${'b'.repeat(20)}`;
    const expected = `example.com/${'a'.repeat(31)}😀…${'b'.repeat(15)}`;

    const {getByRole} = render(<AutoLinkText text={url} />);

    expect(getByRole('link')).toHaveTextContent(expected);
  });

  it('leaves sentence punctuation outside the link', () => {
    const {getByRole} = render(
      <AutoLinkText text="See https://example.com/docs). Next." />
    );

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link.nextSibling).toHaveTextContent('). Next.');
  });

  it.each([
    ['(https://example.com/docs.)', 'https://example.com/docs', '.)'],
    ['[(https://example.com/docs)]', 'https://example.com/docs', ')]'],
    [
      '(https://example.com/docs/(section)).',
      'https://example.com/docs/(section)',
      ').'
    ]
  ])('removes surrounding punctuation from %s', (text, url, trailingText) => {
    const {getByRole} = render(<AutoLinkText text={text} />);

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', url);
    expect(link.nextSibling).toHaveTextContent(trailingText);
  });

  it('keeps balanced parentheses that are part of a URL', () => {
    const url = 'https://example.com/docs/(section)';

    const {getByRole} = render(<AutoLinkText text={url} />);

    expect(getByRole('link')).toHaveAttribute('href', url);
  });

  it('keeps apostrophes that are part of a URL', () => {
    const url = "https://en.wikipedia.org/wiki/O'Reilly_Media";

    const {getByRole} = render(<AutoLinkText text={url} />);

    expect(getByRole('link')).toHaveAttribute('href', url);
    expect(getByRole('link')).toHaveAttribute('title', url);
  });

  it('leaves enclosing single quotes outside the link', () => {
    const url = 'https://example.com/docs';

    const {getByRole} = render(<AutoLinkText text={`See '${url}'`} />);

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', url);
    expect(link.previousSibling).toHaveTextContent("See '");
    expect(link.nextSibling).toHaveTextContent("'");
  });

  it.each([
    ["He wrote 'see https://example.com/docs'.", "'."],
    ["'(https://example.com/docs)'", ")'"],
    ['“https://example.com/docs”', '”']
  ])('leaves closing sentence quotes outside the link in %s', (text, trailingText) => {
    const {getByRole} = render(<AutoLinkText text={text} />);

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link.nextSibling).toHaveTextContent(trailingText);
  });

  it('links multiple URLs while preserving intervening text', () => {
    const {getAllByRole, container} = render(
      <AutoLinkText text={'First https://one.example.com\nthen http://two.example.com.'} />
    );

    expect(getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
      'https://one.example.com',
      'http://two.example.com'
    ]);
    expect(container.textContent).toBe('First one.example.com\nthen two.example.com.');
  });

  it('does not link unsupported URL schemes', () => {
    const text = 'Do not open javascript:alert(1), mailto:test@example.com, ' +
                 'git+https://example.com/repo or blob:https://example.com/id';
    const {queryByRole, getByText} = render(<AutoLinkText text={text} />);

    expect(queryByRole('link')).toBeNull();
    expect(getByText(text)).toBeInTheDocument();
  });

  it('only links standalone URLs following nested unsupported schemes', () => {
    const text = 'view-source:blob:https://example.com/id then https://standalone.example.com';
    const {getByRole, container} = render(<AutoLinkText text={text} />);

    expect(getByRole('link')).toHaveAttribute('href', 'https://standalone.example.com');
    expect(container.textContent)
      .toBe('view-source:blob:https://example.com/id then standalone.example.com');
  });

  it('links a valid URL following a malformed candidate', () => {
    const {getByRole, container} = render(
      <AutoLinkText text="Broken https://? then https://valid.example.com" />
    );

    expect(getByRole('link')).toHaveAttribute('href', 'https://valid.example.com');
    expect(container.textContent).toBe('Broken https://? then valid.example.com');
  });
});
