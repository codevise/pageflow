describe('pageflow.i18nUtils.translationKeysWithSuffix', function() {
  it('returns array with additional suffixed key for each item', function() {
    var result = pageflow.i18nUtils.translationKeysWithSuffix(
      ['some.key', 'fallback'],
      'disabled'
    );

    expect(result).to.deep.eq(['some.key_disabled', 'some.key', 'fallback_disabled', 'fallback']);
  });
});
