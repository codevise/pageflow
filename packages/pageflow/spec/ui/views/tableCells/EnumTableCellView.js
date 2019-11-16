describe('EnumTableCellView', () => {
  support.useFakeTranslations({
    'columns.first_name.cell_title.all': 'All',
    'columns.first_name.cell_title.blank': 'Blank',
  });

  test(
    'sets text from attribute translation if attribute is present',
    () => {
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
    }
  );

  test(
    'sets text from attribute translation if column attribute is blank',
    () => {
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
    }
  );
});