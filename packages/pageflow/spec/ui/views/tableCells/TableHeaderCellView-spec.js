describe('TableHeaderCellView', function() {
  support.useFakeTranslations({
    'columns.first_name.column_header': 'First Name'
  });

  it('uses attribute translation as text', function() {
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