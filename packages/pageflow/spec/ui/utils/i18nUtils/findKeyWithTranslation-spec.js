import {i18nUtils} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.i18nUtils.findKeyWithTranslation', () => {
  support.useFakeTranslations({
    'some.key': 'Some text',
    'fallback': 'Fallback'
  });

  it('returns key withpresent translation', () => {
    var result = i18nUtils.findKeyWithTranslation(
      ['not.there', 'some.key', 'fallback']
    );

    expect(result).toBe('some.key');
  });

  it('falls back first key if all are missing', () => {
    var result = i18nUtils.findKeyWithTranslation(
      ['not.there', 'also.not.there']
    );

    expect(result).toBe('not.there');
  });
});
