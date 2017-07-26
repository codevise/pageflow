describe('Widget', function() {
  var f = support.factories;

  describe('#toJSON', function() {
    it('includes role, type_name and configuration', function() {
      var widget = new pageflow.Widget({
        id: 'navigation',
        type_name: 'fancy_bar',
        configuration: {
          some: 'value'
        }
      }, {
        widgetTypes: f.widgetTypes([
          {name: 'fancy_bar', role: 'navigation'}
        ])
      });

      expect(widget.toJSON()).to.eql({
        role: 'navigation',
        type_name: 'fancy_bar',
        configuration: {
          some: 'value'
        }
      });
    });
  });
});
