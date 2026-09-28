import React from 'react';

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"]+/gi;
const MAX_LINK_TEXT_LENGTH = 60;
const TRAILING_PUNCTUATION = new Set(['.', ',', '!', '?', ';', ':', "'", '’', '”']);
const BRACKETS = {
  '(': ')',
  '[': ']',
  '{': '}'
};
const OPENING_BRACKET = Object.fromEntries(
  Object.entries(BRACKETS).map(([opening, closing]) => [closing, opening])
);

export function AutoLinkText({text}) {
  const parts = [];
  let start = 0;
  let match;

  URL_PATTERN.lastIndex = 0;

  while ((match = URL_PATTERN.exec(text))) {
    if (startsInsideUnsupportedScheme(text, match.index)) continue;

    const candidate = match[0];
    const url = removeTrailingPunctuation(candidate);

    if (!isValidUrl(url)) continue;

    parts.push(text.slice(start, match.index));
    parts.push(
      <a key={match.index}
         href={url}
         title={url}
         target="_blank"
         rel="noopener noreferrer">
        {shortenUrl(url)}
      </a>
    );

    start = match.index + url.length;
    URL_PATTERN.lastIndex = start;
  }

  parts.push(text.slice(start));
  return parts;
}

function isValidUrl(value) {
  try {
    return Boolean(new URL(value).hostname);
  }
  catch (e) {
    return false;
  }
}

function startsInsideUnsupportedScheme(text, index) {
  let start = index - 1;

  while (start >= 0 && /[a-z0-9+.:-]/i.test(text[start])) start--;

  return /^[a-z][a-z0-9+.:-]*[:+.-]$/i.test(text.slice(start + 1, index));
}

function removeTrailingPunctuation(value) {
  const excessClosingBrackets = {')': 0, ']': 0, '}': 0};

  for (const character of value) {
    if (BRACKETS[character]) {
      excessClosingBrackets[BRACKETS[character]]--;
    }
    else if (OPENING_BRACKET[character]) {
      excessClosingBrackets[character]++;
    }
  }

  let end = value.length;

  while (end > 0) {
    const character = value[end - 1];

    if (TRAILING_PUNCTUATION.has(character)) {
      end--;
    }
    else if (excessClosingBrackets[character] > 0) {
      excessClosingBrackets[character]--;
      end--;
    }
    else {
      break;
    }
  }

  return value.slice(0, end);
}

function shortenUrl(value) {
  const displayValue = value.replace(/^https?:\/\//i, '');
  const characters = Array.from(displayValue);

  if (characters.length <= MAX_LINK_TEXT_LENGTH) return displayValue;

  const endLength = 15;
  const startLength = MAX_LINK_TEXT_LENGTH - endLength - 1;

  return `${characters.slice(0, startLength).join('')}…` +
         characters.slice(-endLength).join('');
}
