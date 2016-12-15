describe('pageflow.i18nUtils.findKeyWithTranslation', function() {
  support.useFakeTranslations({
    'some.key': 'Some text',
    'fallback': 'Fallback'
  });

  it('returns key withpresent translation', function() {
    var result = pageflow.i18nUtils.findKeyWithTranslation(
      ['not.there', 'some.key', 'fallback']
    );

    expect(result).to.eq('some.key');
  });

  it('falls back first key if all are missing', function() {
    var result = pageflow.i18nUtils.findKeyWithTranslation(
      ['not.there', 'also.not.there']
    );

    expect(result).to.eq('not.there');
  });
});
