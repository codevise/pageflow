import {EntrySelectView} from 'editor/views/EntrySelectView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderReactBasedBackboneView as render} from 'pageflow-scrolled/testHelpers';

describe('EntrySelectView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.entry_select.placeholder': 'Select story',
    'pageflow_scrolled.editor.entry_select.no_matches': 'No matching stories',
    'pageflow_scrolled.editor.entry_select.show_entries': 'Show stories',
    'pageflow_scrolled.editor.entry_select.not_published': 'Not published',
    'pageflow_scrolled.editor.entry_select.password_protected': 'Password protected'
  });

  it('renders combobox with label and placeholder', () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([{id: 5, title: 'Other'}]),
      label: 'Story',
      onSelect: jest.fn()
    });

    const {getByRole} = render(view);

    expect(getByRole('combobox', {name: 'Story'})).toHaveValue('');
    expect(getByRole('combobox', {name: 'Story'}))
      .toHaveAttribute('placeholder', 'Select story');
  });

  it('displays initially selected entry', () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([{id: 5, title: 'Other'}]),
      selectedEntryId: 5,
      onSelect: jest.fn()
    });

    const {getByRole} = render(view);

    expect(getByRole('combobox')).toHaveValue('Other');
  });

  it('lists entries of collection', async () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([{id: 5, title: 'Other'}, {id: 6, title: 'Next'}]),
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole, getAllByRole} = render(view);
    await user.click(getByRole('button', {name: 'Show stories'}));

    expect(getAllByRole('option').map(option => option.textContent))
      .toEqual(['Other', 'Next']);
  });

  it('lists entries when clicking into input', async () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([{id: 5, title: 'Other'}]),
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole, getAllByRole} = render(view);
    await user.click(getByRole('combobox'));

    expect(getAllByRole('option').map(option => option.textContent)).toEqual(['Other']);
  });

  it('filters entries by typed title', async () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([
        {id: 5, title: 'Climate report'},
        {id: 6, title: 'Election night'}
      ]),
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole, getAllByRole} = render(view);
    await user.type(getByRole('combobox'), 'elect');

    expect(getAllByRole('option').map(option => option.textContent))
      .toEqual(['Election night']);
  });

  it('displays hint if no entry matches', async () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([{id: 5, title: 'Climate report'}]),
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole, getByText} = render(view);
    await user.type(getByRole('combobox'), 'xyz');

    expect(getByText('No matching stories')).not.toBeNull();
  });

  it('calls onSelect with selected entry', async () => {
    const collection = new Backbone.Collection([{id: 5, title: 'Other'}]);
    const listener = jest.fn();
    const view = new EntrySelectView({collection, onSelect: listener});

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Show stories'}));
    await user.click(getByRole('option', {name: 'Other'}));

    expect(listener).toHaveBeenCalledWith(collection.get(5));
    expect(getByRole('combobox')).toHaveValue('Other');
  });

  it('updates when entries are added to collection', async () => {
    const collection = new Backbone.Collection();
    const view = new EntrySelectView({collection, onSelect: jest.fn()});

    const user = userEvent.setup();
    const {getByRole} = render(view);
    collection.add({id: 5, title: 'Other'});
    await user.click(getByRole('button', {name: 'Show stories'}));

    expect(getByRole('option', {name: 'Other'})).not.toBeNull();
  });

  it('displays selected entry once collection syncs it in', () => {
    const collection = new Backbone.Collection();
    const view = new EntrySelectView({collection, selectedEntryId: 5, onSelect: jest.fn()});

    const {getByRole} = render(view);
    collection.set([{id: 5, title: 'Other'}]);
    collection.trigger('sync');

    expect(getByRole('combobox')).toHaveValue('Other');
  });

  it('marks entries that are not published or password protected', async () => {
    const view = new EntrySelectView({
      collection: new Backbone.Collection([
        {id: 5, title: 'Draft', publicationState: 'not_published'},
        {id: 6, title: 'Protected', publicationState: 'published_with_password_protection'},
        {id: 7, title: 'Public', publicationState: 'published_without_password_protection'}
      ]),
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole, getAllByRole} = render(view);
    await user.click(getByRole('button', {name: 'Show stories'}));

    expect(getAllByRole('option').map(option => option.textContent))
      .toEqual(['DraftNot published', 'ProtectedPassword protected', 'Public']);
  });
});
