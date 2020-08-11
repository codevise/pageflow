import {buildQueries} from '@testing-library/react';

function queryAllJsonLd(container) {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map(element => JSON.parse(element.text));
}
const getMultipleError = () =>
  'Found multiple JSON-LD script tags.';
const getMissingError = () =>
  'Unable to find JSON-LD script tag.';

const [
  queryJsonLd,
  getAllJsonLd,
  getJsonLd,
  findAllJsonLd,
  findJsonLd,
] = buildQueries(queryAllJsonLd, getMultipleError, getMissingError);

export {
  queryJsonLd,
  queryAllJsonLd,
  getJsonLd,
  getAllJsonLd,
  findAllJsonLd,
  findJsonLd
};
