import {SelectLinkDestinationDialogView} from 'editor/views/SelectLinkDestinationDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('SelectLinkDestinationDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.selectable_section_item.title': 'Select section',
    'pageflow_scrolled.editor.select_link_destination.enter_url': 'Enter url',
    'pageflow_scrolled.editor.select_link_destination.open_in_new_tab': 'Open in new tab',
    'pageflow_scrolled.editor.select_link_destination.create': 'Create link'
  });

  function render(view) {
    view.render();
    document.body.appendChild(view.el);
    return within(view.el);
  }

  it('allows selecting chapter', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        chapters: [
          {id: 1, permaId: 10, configuration: {title: 'Intro'}}
        ]
      })
    });
    const listener = jest.fn();
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getByText} = within(view.render().el);
    await user.click(getByText('Intro'));

    expect(listener).toHaveBeenCalledWith({chapter: 10});
  });

  it('allows selecting section', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, permaId: 10}
        ]
      })
    });
    const listener = jest.fn();
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getByTitle} = within(view.render().el);
    await user.click(getByTitle('Select section'));

    expect(listener).toHaveBeenCalledWith({section: 10});
  });

  it('allows entering url', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const listener = jest.fn();
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getByLabelText, getByRole} = render(view);
    await user.type(getByLabelText('Enter url'), 'https://example.com');
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({url: 'https://example.com'});
  });

  it('allows setting link target', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const listener = jest.fn();
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getByLabelText, getByRole} = render(view);
    await user.type(getByLabelText('Enter url'), 'https://example.com');
    await user.click(getByLabelText('Open in new tab'));
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({
      url: 'https://example.com',
      openInNewTab: true
    });
  });
});
