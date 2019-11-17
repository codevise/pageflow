describe('ConfigurationEditorTabView', function() {
  describe('#group', function() {
    it('delegates to groups.apply', function() {
      var groups = new pageflow.ConfigurationEditorTabView.Groups();
      var groupFn = sinon.spy();
      var tabView = new pageflow.ConfigurationEditorTabView({
        groups: groups
      });

      groups.define('someGroup', groupFn);
      tabView.group('someGroup');

      expect(groupFn).to.have.been.calledOn(tabView);
    });
  });

  describe('.Groups', function() {
    describe('#define', function() {
      it('fails with explanation when trying to define group with non function', function() {
        var groups = new pageflow.ConfigurationEditorTabView.Groups();

        expect(function() {
          groups.define('myGroup', 'yay');
        }).to.throw(/group has to be function/i);
      });
    });

    describe('#apply', function() {
      it('applies function given in #define', function() {
        var groups = new pageflow.ConfigurationEditorTabView.Groups();
        var groupFn = sinon.spy();
        var context = {};

        groups.define('someGroup', groupFn);
        groups.apply('someGroup', context);

        expect(groupFn).to.have.been.calledOn(context);
      });

      it('fails with explanation when group is not defined', function() {
        var groups = new pageflow.ConfigurationEditorTabView.Groups();
        var context = {};

        expect(function() {
          groups.apply('undefinedGroup', context);
        }).to.throw(/undefined group/i);
      });
    });
  });
});