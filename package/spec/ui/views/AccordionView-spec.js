import Backbone from 'backbone';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import {AccordionView, TextInputView} from 'pageflow/ui';

import {renderBackboneView} from '$support';

describe('AccordionView', () => {
  const TextView = Backbone.View.extend({
    initialize(options) {
      this.text = options.text;
    },

    render() {
      this.el.textContent = this.text;
      return this;
    }
  });

  it('renders section titles', () => {
    const view = new AccordionView();

    view.section('First', function() {});
    view.section('Second', function() {});

    const {getByText} = renderBackboneView(view);

    expect(getByText('First')).toBeInTheDocument();
    expect(getByText('Second')).toBeInTheDocument();
  });

  it('opens first section by default', () => {
    const view = new AccordionView();

    view.section('First', function() {
      this.view(TextView, {text: 'First content'});
    });
    view.section('Second', function() {
      this.view(TextView, {text: 'Second content'});
    });

    const {getByText} = renderBackboneView(view);

    expect(getByText('First content')).toBeVisible();
    expect(getByText('Second content')).not.toBeVisible();
  });

  it('renders inputs for model', () => {
    const model = new Backbone.Model({title: 'Some title'});
    const view = new AccordionView({model});

    view.section('First', function() {
      this.input('title', TextInputView, {label: 'Title'});
    });

    const {getByLabelText} = renderBackboneView(view);

    expect(getByLabelText('Title')).toHaveValue('Some title');
  });

  it('throws when views are added outside of sections', () => {
    const view = new AccordionView();

    expect(() => view.view(TextView)).toThrow(/inside section/);
  });

  describe('with selection model', () => {
    function createSelectableView(selection) {
      const view = new AccordionView({
        selectionModel: selection,
        selectionPropertyName: 'kind'
      });

      view.section('Website', {value: 'url', description: 'Any page'}, function() {
        this.view(TextView, {text: 'Website content'});
      });
      view.section('File', {value: 'file', description: 'Some download'}, function() {
        this.view(TextView, {text: 'File content'});
      });

      return view;
    }

    it('renders radio button for each section', () => {
      const view = createSelectableView(new Backbone.Model({kind: 'file'}));

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('radio', {name: /Website/})).not.toBeChecked();
      expect(getByRole('radio', {name: /File/})).toBeChecked();
    });

    it('renders section descriptions', () => {
      const view = createSelectableView(new Backbone.Model({kind: 'file'}));

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('radio', {name: 'Website Any page'})).toBeInTheDocument();
    });

    it('only displays content of selected section', () => {
      const view = createSelectableView(new Backbone.Model({kind: 'file'}));

      const {getByText} = renderBackboneView(view);

      expect(getByText('File content')).toBeVisible();
      expect(getByText('Website content')).not.toBeVisible();
    });

    it('does not display any content if nothing is selected', () => {
      const view = createSelectableView(new Backbone.Model());

      const {getByText} = renderBackboneView(view);

      expect(getByText('File content')).not.toBeVisible();
      expect(getByText('Website content')).not.toBeVisible();
    });

    it('updates selection model when radio button is clicked', async () => {
      const selection = new Backbone.Model({kind: 'file'});
      const view = createSelectableView(selection);

      const user = userEvent.setup();
      const {getByRole, getByText} = renderBackboneView(view);
      await user.click(getByRole('radio', {name: /Website/}));

      expect(selection.get('kind')).toEqual('url');
      expect(getByText('Website content')).toBeVisible();
      expect(getByText('File content')).not.toBeVisible();
    });

    it('updates when selection model changes', () => {
      const selection = new Backbone.Model({kind: 'file'});
      const view = createSelectableView(selection);

      const {getByRole} = renderBackboneView(view);
      selection.set('kind', 'url');

      expect(getByRole('radio', {name: /Website/})).toBeChecked();
    });
  });

  it('lets sections with fill option fill remaining height', () => {
    const view = new AccordionView();

    view.section('First', {fill: true}, function() {
      this.view(TextView, {text: 'First content'});
    });

    const {getByText} = renderBackboneView(view);

    expect(getByText('First content').closest('.accordion_view-section'))
      .toHaveClass('accordion_view-section-fill');
  });
});
