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

    it('supports getting value from function passed as value option', function() {
      var person = new Backbone.Model({first_name: 'Tom'});
      var tableCellView = new pageflow.TableCellView({
        column: {
          name: 'first_name',
          value: function(person) {
            return person.get('first_name') + '!';
          }
        },
        model: person
      });

      var result = tableCellView.attributeValue();

      expect(result).to.eq('Tom!');
    });

    describe('with configurationAttribute option set to true', function() {
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

      it('still passes model to value function', function() {
        var person = new Backbone.Model();
        person.configuration = new Backbone.Model({first_name: 'Tom'});
        var tableCellView = new pageflow.TableCellView({
          column: {
            name: 'first_name',
            configurationAttribute: true,
            value: function(person) {
              return person.configuration.get('first_name') + '!';
            }
          },
          model: person,
        });

        var result = tableCellView.attributeValue();

        expect(result).to.eq('Tom!');
      });
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

  describe('#setupContentBinding', function() {
    it('triggers update() on rendering TableCellView if contentBinding is declared', function() {
      var FunnelCellView = pageflow.TableCellView.extend({
        template: function(serializedModel) {
          return serializedModel.jargon;
        },
        update: function() {
          return this.getModel().set('jargon', this.options.model.get(this.options.contentBinding));
        }
      });

      var languageIsJargon = new Backbone.Model({
        language: 'Japanese',
        jargon: 'Hacker Slang'
      });

      var jargonCellView = new FunnelCellView({
        column: {name: 'jargon'},
        contentBinding: 'language',
        model: languageIsJargon
      });

      jargonCellView.render();

      expect(languageIsJargon.get('jargon')).to.eq('Japanese');
    });

    it('updates TableCellView when value of variable that is bound to changes', function() {
      var FunnelCellView = pageflow.TableCellView.extend({
        template: function(serializedModel) {
          return serializedModel.jargon;
        },
        update: function() {
          return this.getModel().set('jargon',
                                     this.options.model.get(this.options.column.contentBinding));
        }
      });

      var languageIsJargon = new Backbone.Model({
        language: 'Japanese',
        jargon: 'Hacker Slang'
      });

      var jargonCellView = new FunnelCellView({
        column: {
          name: 'jargon',
          contentBinding: 'language'
        },
        model: languageIsJargon
      });

      jargonCellView.render();
      languageIsJargon.set('language', 'Klingon');

      expect(languageIsJargon.get('jargon')).to.eq('Klingon');
    });
  });
});
