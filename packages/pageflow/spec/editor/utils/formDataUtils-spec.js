describe('formDataUtils', () => {
  describe('fromObject', () => {
    test('returns flat hash with keys in angle bracket notation', () => {
      var object = {
        some: {
          nested: 'value',
          deeply: {
            nested: 'data'
          }
        }
      };

      var result = pageflow.formDataUtils.fromObject(object);

      expect(result).toEqual({
        'some[nested]': 'value',
        'some[deeply][nested]': 'data'
      });
    });

    test('handles spaces, +, = and & signs correctly', () => {
      var object = {
        some: {
          value: '1 + 1 = 2 & a',
        }
      };

      var result = pageflow.formDataUtils.fromObject(object);

      expect(result).toEqual({
        'some[value]': '1 + 1 = 2 & a',
      });
    });
  });

  describe('fromModel', () => {
    test('return flat hash using model name and json representation', () => {
      var Model = Backbone.Model.extend({
        modelName: 'person',

        toJSON: function() {
          return _.pick(this.attributes, 'name');
        }
      });
      var model = new Model({name: 'Tom', ignored: 'attribute'});

      var result = pageflow.formDataUtils.fromModel(model);

      expect(result).toEqual({
        'person[name]': 'Tom'
      });
    });
  });
});