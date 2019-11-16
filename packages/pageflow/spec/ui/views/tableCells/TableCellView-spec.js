import Backbone from 'backbone';

import {TableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('TableCellView', () => {
  describe('#attributeValue', () => {
    test('returns value of column attribute', () => {
      var person = new Backbone.Model({first_name: 'Tom'});
      var tableCellView = new TableCellView({
        column: {name: 'first_name'},
        model: person
      });

      var result = tableCellView.attributeValue();

      expect(result).toBe('Tom');
    });

    test(
      'supports getting value from function passed as value option',
      () => {
        var person = new Backbone.Model({first_name: 'Tom'});
        var tableCellView = new TableCellView({
          column: {
            name: 'first_name',
            value: function(person) {
              return person.get('first_name') + '!';
            }
          },
          model: person
        });

        var result = tableCellView.attributeValue();

        expect(result).toBe('Tom!');
      }
    );

    describe('with configurationAttribute option set to true', () => {
      test('supports reading from configuration', () => {
        var person = new Backbone.Model();
        person.configuration = new Backbone.Model({first_name: 'Tom'});
        var tableCellView = new TableCellView({
          column: {
            name: 'first_name',
            configurationAttribute: true
          },
          model: person
        });

        var result = tableCellView.attributeValue();

        expect(result).toBe('Tom');
      });

      test('still passes model to value function', () => {
        var person = new Backbone.Model();
        person.configuration = new Backbone.Model({first_name: 'Tom'});
        var tableCellView = new TableCellView({
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

        expect(result).toBe('Tom!');
      });
    });
  });

  describe('#attributeTranslation', () => {
    support.useFakeTranslations({
      'columns.first_name.text': 'Test',
      'columns.first_name.with.interpolaton': '%{value}',
    });

    test(
      'returns first present translation from attributeTranslationKeyPrefixes',
      () => {
        var tableCellView = new TableCellView({
          column: {name: 'first_name'},
          attributeTranslationKeyPrefixes: [
            'missing',
            'columns'
          ]
        });

        var result = tableCellView.attributeTranslation('text');

        expect(result).toBe('Test');
      }
    );

    test(
      'returns first present translation from attributeTranslationKeyPrefixes',
      () => {
        var tableCellView = new TableCellView({
          column: {name: 'first_name'},
          attributeTranslationKeyPrefixes: ['columns']
        });

        var result = tableCellView.attributeTranslation('with.interpolaton', {value: 'Test'});

        expect(result).toBe('Test');
      }
    );
  });

  describe('#setupContentBinding', () => {
    test(
      'triggers update() on rendering TableCellView if contentBinding is declared',
      () => {
        var FunnelCellView = TableCellView.extend({
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

        expect(languageIsJargon.get('jargon')).toBe('Japanese');
      }
    );

    test(
      'updates TableCellView when value of variable that is bound to changes',
      () => {
        var FunnelCellView = TableCellView.extend({
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

        expect(languageIsJargon.get('jargon')).toBe('Klingon');
      }
    );
  });
});
