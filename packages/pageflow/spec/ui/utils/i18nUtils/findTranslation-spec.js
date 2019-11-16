describe('pageflow.i18nUtils.findTranslation', () => {
  support.useFakeTranslations({
    'some.key': 'Some text',
    'fallback': 'Fallback',
    'with.interpolation': 'Value %{value}',
    'html.key.without.suffix': '<div />',
    'html.key.with.suffix_html': '<div />'
  });

  test('returns first present translation', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['not.there', 'some.key', 'fallback']
    );

    expect(result).toBe('Some text');
  });

  test('falls back to defaultValue', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['not.there'],
      {defaultValue: 'Default'}
    );

    expect(result).toBe('Default');
  });

  test('supports interpolations', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['with.interpolation'],
      {value: 'interpolated'}
    );

    expect(result).toBe('Value interpolated');
  });

  test('does not escape html if html flag is not set', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['html.key.without.suffix']
    );

    expect(result).toBe('<div />');
  });

  test('searches for keys ending in _html if flag is set', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['html.key.with.suffix'],
      {html: true}
    );

    expect(result).toBe('<div />');
  });

  test(
    'HTML-escapes translations the key of which does not end in _html, if html flag '+
       'is set',
    () => {
         var result = pageflow.i18nUtils.findTranslation(
           ['html.key.without.suffix'],
           {html: true}
         );

         expect(result).toBe('&lt;div /&gt;');
       }
  );

  test('does not escape default value if html flag is not set', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['not.there'],
      {defaultValue: '<div />'}
    );

    expect(result).toBe('<div />');
  });

  test('does not escape default value if html flag is set', () => {
    var result = pageflow.i18nUtils.findTranslation(
      ['not.there'],
      {defaultValue: '<div />', html: true}
    );

    expect(result).toBe('<div />');
  });
});
