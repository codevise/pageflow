describe('TableCellView', function() {
  describe('#attributeValue', function() {
    it('returns value of column attribute', function() {
      var person = new Backbone.Model({first_name: 'Tom'});
      var tableCellView = new pageflow.TableCellView({
        column: {name: 'first_name'},
        model: person
      });

      var result = tableCellView.attributeValue();

      expect(result).to.eq('Tom');
    });

    it('supports reading from configuration', function() {
      var person = new Backbone.Model();
      person.configuration = new Backbone.Model({first_name: 'Tom'});
      var tableCellView = new pageflow.TableCellView({
        column: {
          name: 'first_name',
          configurationAttribute: true
        },
        model: person
      });

      var result = tableCellView.attributeValue();

      expect(result).to.eq('Tom');
    });
  });

  describe('#attributeTranslation', function() {
    support.useFakeTranslations({
      'columns.first_name.text': 'Test',
      'columns.first_name.with.interpolaton': '%{value}',
    });

    it('returns first present translation from attributeTranslationKeyPrefixes', function() {
      var tableCellView = new pageflow.TableCellView({
        column: {name: 'first_name'},
        attributeTranslationKeyPrefixes: [
          'missing',
          'columns'
        ]
      });

      var result = tableCellView.attributeTranslation('text');

      expect(result).to.eq('Test');
    });

    it('returns first present translation from attributeTranslationKeyPrefixes', function() {
      var tableCellView = new pageflow.TableCellView({
        column: {name: 'first_name'},
        attributeTranslationKeyPrefixes: ['columns']
      });

      var result = tableCellView.attributeTranslation('with.interpolaton', {value: 'Test'});

      expect(result).to.eq('Test');
    });
  });
});