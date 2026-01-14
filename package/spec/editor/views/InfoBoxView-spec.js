import '@testing-library/jest-dom/extend-expect';
import Backbone from 'backbone';

import {InfoBoxView} from 'editor/views/InfoBoxView';
import {renderBackboneView} from 'testHelpers/renderBackboneView';

describe('InfoBoxView', () => {
  describe('with visibleBindingValue option', () => {
    it('hides element when value of attribute does not match', () => {
      const view = new InfoBoxView({
        model: new Backbone.Model({hidden: true}),
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      renderBackboneView(view);

      expect(view.el).toHaveClass('hidden_via_binding');
    });

    it('does not set hidden class when value of attribute matches', () => {
      const view = new InfoBoxView({
        model: new Backbone.Model({hidden: false}),
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      renderBackboneView(view);

      expect(view.el).not.toHaveClass('hidden_via_binding');
    });
  });

  describe('with icon option', () => {
    it('renders img inside with_icon wrapper', () => {
      const {getByRole, getByText} = renderBackboneView(new InfoBoxView({
        model: new Backbone.Model(),
        text: 'Some text',
        icon: 'path/to/icon.svg'
      }));

      expect(getByRole('img')).toHaveAttribute('src', 'path/to/icon.svg');
      expect(getByText('Some text')).toBeInTheDocument();
    });

    it('renders text without wrapper when no icon', () => {
      const {getByText, queryByRole} = renderBackboneView(new InfoBoxView({
        model: new Backbone.Model(),
        text: 'Some text'
      }));

      expect(queryByRole('img')).not.toBeInTheDocument();
      expect(getByText('Some text')).toBeInTheDocument();
    });
  });
});
