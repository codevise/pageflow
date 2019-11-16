import {i18nUtils} from '$pageflow/ui';

describe('pageflow.i18nUtils.translationKeysWithSuffix', () => {
  test('returns array with additional suffixed key for each item', () => {
    var result = i18nUtils.translationKeysWithSuffix(
      ['some.key', 'fallback'],
      'disabled'
    );

    expect(result).toEqual(['some.key_disabled', 'some.key', 'fallback_disabled', 'fallback']);
  });
});
