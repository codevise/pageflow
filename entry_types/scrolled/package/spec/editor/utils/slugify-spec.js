import {slugify} from 'editor/utils/slugify';

import cases from '../../fixtures/slugify.json';

describe('slugify', () => {
  cases.forEach(({title, slug}) => {
    it(`turns ${JSON.stringify(title)} into ${JSON.stringify(slug)}`, () => {
      expect(slugify(title)).toBe(slug);
    });
  });
});
