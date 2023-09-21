import Backbone from 'backbone';

import {InfoBoxView} from 'editor/views/InfoBoxView';

describe('InfoBoxView', () => {
  describe('with visibleBindingValue option', () => {
    it('hides element when value of attribute does not match', () => {
      var view = new InfoBoxView({
        model: new Backbone.Model({hidden: true}),
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      view.render();

      expect(view.$el).toHaveClass('hidden_via_binding');
    });

    it('does not set hidden class when value of attribute matches', () => {
      var view = new InfoBoxView({
        model: new Backbone.Model({hidden: false}),
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      view.render();

      expect(view.$el).not.toHaveClass('hidden_via_binding');
    });
  });
});
