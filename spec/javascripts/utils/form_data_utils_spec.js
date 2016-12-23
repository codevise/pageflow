describe('formDataUtils', function() {
  describe('fromObject', function() {
    it('returns flat hash with keys in angle bracket notation', function() {
      var object = {
        some: {
          nested: 'value',
          deeply: {
            nested: 'data'
          }
        }
      };

      var result = pageflow.formDataUtils.fromObject(object);

      expect(result).to.eql({
        'some[nested]': 'value',
        'some[deeply][nested]': 'data'
      });
    });

    it('handles spaces, +, = and & signs correctly', function() {
      var object = {
        some: {
          value: '1 + 1 = 2 & a',
        }
      };

      var result = pageflow.formDataUtils.fromObject(object);

      expect(result).to.eql({
        'some[value]': '1 + 1 = 2 & a',
      });
    });
  });

  describe('fromModel', function() {
    it('return flat hash using model name and json representation', function() {
      var Model = Backbone.Model.extend({
        modelName: 'person',

        toJSON: function() {
          return _.pick(this.attributes, 'name');
        }
      });
      var model = new Model({name: 'Tom', ignored: 'attribute'});

      var result = pageflow.formDataUtils.fromModel(model);

      expect(result).to.eql({
        'person[name]': 'Tom'
      });
    });
  });
});