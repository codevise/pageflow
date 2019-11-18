import {ConfigurationEditorTabView} from '$pageflow/ui';

import sinon from 'sinon';

describe('ConfigurationEditorTabView', () => {
  describe('#group', () => {
    test('delegates to groups.apply', () => {
      var groups = new ConfigurationEditorTabView.Groups();
      var groupFn = sinon.spy();
      var tabView = new ConfigurationEditorTabView({
        groups: groups
      });

      groups.define('someGroup', groupFn);
      tabView.group('someGroup');

      expect(groupFn).toHaveBeenCalledOn(tabView);
    });
  });

  describe('.Groups', () => {
    describe('#define', () => {
      test(
        'fails with explanation when trying to define group with non function',
        () => {
          var groups = new ConfigurationEditorTabView.Groups();

          expect(function() {
            groups.define('myGroup', 'yay');
          }).toThrowError(/group has to be function/i);
        }
      );
    });

    describe('#apply', () => {
      test('applies function given in #define', () => {
        var groups = new ConfigurationEditorTabView.Groups();
        var groupFn = sinon.spy();
        var context = {};

        groups.define('someGroup', groupFn);
        groups.apply('someGroup', context);

        expect(groupFn).toHaveBeenCalledOn(context);
      });

      test('fails with explanation when group is not defined', () => {
        var groups = new ConfigurationEditorTabView.Groups();
        var context = {};

        expect(function() {
          groups.apply('undefinedGroup', context);
        }).toThrowError(/undefined group/i);
      });
    });
  });
});