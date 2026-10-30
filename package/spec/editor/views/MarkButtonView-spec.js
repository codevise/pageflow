import {MarkButtonView, ListSelection} from 'pageflow/editor';
import Backbone from 'backbone';
import {renderBackboneView as render} from 'pageflow/testHelpers';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('MarkButtonView', () => {
  function setup({selection = new ListSelection(), ...options} = {}) {
    const model = new Backbone.Model();
    const view = new MarkButtonView({model, selection, label: 'Mark', ...options});

    render(view);

    return {view, model, selection, ...within(view.el.parentNode)};
  }

  it('renders unpressed button', () => {
    const {getByRole} = setup();

    expect(getByRole('button', {name: 'Mark'})).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks model on click', async () => {
    const user = userEvent.setup();
    const {model, selection, getByRole} = setup();

    await user.click(getByRole('button', {name: 'Mark'}));

    expect(selection.models).toEqual([model]);
    expect(getByRole('button', {name: 'Mark'})).toHaveAttribute('aria-pressed', 'true');
    expect(getByRole('button', {name: 'Mark'})).toHaveClass('marked');
  });

  it('unmarks marked model on click', async () => {
    const user = userEvent.setup();
    const {model, selection, getByRole} = setup();
    selection.add(model);

    await user.click(getByRole('button', {name: 'Mark'}));

    expect(selection.length).toBe(0);
    expect(getByRole('button', {name: 'Mark'})).not.toHaveClass('marked');
  });

  it('triggers toggle event after selection changed', async () => {
    const user = userEvent.setup();
    const {view, model, selection, getByRole} = setup();
    const listener = jest.fn(() => expect(selection.includes(model)).toBe(true));
    view.on('toggle', listener);

    await user.click(getByRole('button', {name: 'Mark'}));

    expect(listener).toHaveBeenCalled();
  });

  it('does not let click reach parent elements', async () => {
    const user = userEvent.setup();
    const {view, getByRole} = setup();
    const listener = jest.fn();
    view.el.parentNode.addEventListener('click', listener);

    await user.click(getByRole('button', {name: 'Mark'}));

    expect(listener).not.toHaveBeenCalled();
  });

  it('indicates marking while other models are marked', () => {
    const {getByRole} = setup({selection: new ListSelection([new Backbone.Model()])});

    expect(getByRole('button', {name: 'Mark'})).toHaveClass('marking');
  });

  it('indicates marking while selection is active', () => {
    const {selection, getByRole} = setup();

    selection.start();

    expect(getByRole('button', {name: 'Mark'})).toHaveClass('marking');
  });

  it('does not indicate marking by default', () => {
    const {getByRole} = setup();

    expect(getByRole('button', {name: 'Mark'})).not.toHaveClass('marking');
  });

  it('updates marked state when selection is reset', () => {
    const {model, selection, getByRole} = setup();
    selection.add(model);

    selection.reset();

    expect(getByRole('button', {name: 'Mark'})).not.toHaveClass('marked');
  });

  it('uses start marking label while selection is not active', () => {
    const {getByRole} = setup({startMarkingLabel: 'Start'});

    expect(getByRole('button', {name: 'Start'})).toHaveAttribute('title', 'Start');
  });

  it('uses label while selection is active', () => {
    const {selection, getByRole} = setup({startMarkingLabel: 'Start'});

    selection.start();

    expect(getByRole('button', {name: 'Mark'})).toHaveAttribute('title', 'Mark');
  });
});
