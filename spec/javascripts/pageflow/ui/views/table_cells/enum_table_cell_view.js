describe('EnumTableCellView', function() {
  support.useFakeTranslations({
    'columns.first_name.cell_title.all': 'All',
    'columns.first_name.cell_title.blank': 'Blank',
  });

  it('sets text from attribute translation if attribute is present', function() {
    var person = new Backbone.Model({mode: 'all'});
    var cell = new pageflow.EnumTableCellView({
      column: {
        name: 'mode'
      },
      model: person,
      attributeTranslationKeyPrefixes: ['columns']
    });

    cell.render();

    expect(cell.$el).to.have.$text('All');
  });

  it('sets text from attribute translation if column attribute is blank', function() {
    var person = new Backbone.Model({mode: ''});
    var cell = new pageflow.EnumTableCellView({
      column: {
        name: 'mode'
      },
      model: person,
      attributeTranslationKeyPrefixes: ['columns']
    });

    cell.render();

    expect(cell.$el).to.have.$text('Blank');
  });
});