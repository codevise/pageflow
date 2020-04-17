import {Widget} from 'pageflow/editor';

import * as support from '$support';

describe('Widget', () => {
  var f = support.factories;

  describe('#toJSON', () => {
    it('includes role, type_name and configuration', () => {
      var widget = new Widget({
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

      expect(widget.toJSON()).toEqual({
        role: 'navigation',
        type_name: 'fancy_bar',
        configuration: {
          some: 'value'
        }
      });
    });
  });
});
