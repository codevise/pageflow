import fixture from '../../../spec/fixtures/file_references.json';

import {collectFileReferences} from 'shared/collectFileReferences';

describe('collectFileReferences', () => {
  fixture.cases.forEach(testCase => {
    it(testCase.name, () => {
      const references = collectFileReferences({
        locations: testCase.locations,
        configuration: testCase.configuration
      });

      expect(references.map(comparable)).toEqual(testCase.references);
    });
  });

  function comparable(reference) {
    return {...reference, path: reference.path.map(String)};
  }
});
