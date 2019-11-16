describe('TableHeaderCellView', () => {
  support.useFakeTranslations({
    'columns.first_name.column_header': 'First Name'
  });

  test('uses attribute translation as text', () => {
    var cell = new pageflow.TableHeaderCellView({
      column: {
        name: 'first_name'
      },
      attributeTranslationKeyPrefixes: ['columns']
    });

    cell.render();

    expect(cell.$el).to.have.$text('First Name');
  });
});