import {SelectLinkDestinationDialogView} from 'editor/views/SelectLinkDestinationDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {editor} from 'pageflow/editor';

import {factories, normalizeSeed, useFakeXhr} from 'support';
import {
  useFakeTranslations,
  renderBackboneView as render,
  setupGlobals
} from 'pageflow/testHelpers';
import 'support/fakeResizeObserver';

import userEvent from '@testing-library/user-event';
import {within} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

describe('SelectLinkDestinationDialogView', () => {
  let testContext;

  function panel({getByRole}, name) {
    return within(getByRole('radio', {name}).closest('.accordion_view-section'));
  }

  beforeEach(() => {
    testContext = {};
  });

  useFakeXhr(() => testContext);

  function respondWithLinkableEntries(linkableEntries) {
    testContext.server.respondWith(
      'GET', /linkable_entries$/, [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(linkableEntries)]
    );
    testContext.server.respond();
  }

  setupGlobals({
    entry: () => factories.entry(ScrolledEntry, {id: 1})
  });

  useFakeTranslations({
    'pageflow_scrolled.editor.select_link_destination.link_to_chapter_or_section':
      'Link to chapter or section of story',
    'pageflow_scrolled.editor.select_link_destination.link_to_beginning_of_entry':
      'Link to beginning of story instead',
    'pageflow_scrolled.editor.select_link_destination.outline_failed':
      'Outline could not be loaded',
    'pageflow_scrolled.editor.entry_select.show_entries': 'Show stories',
    'pageflow_scrolled.editor.selectable_section_item.title': 'Select section',
    'pageflow_scrolled.editor.select_link_destination.url': 'URL',
    'pageflow_scrolled.editor.select_link_destination.story': 'Story',
    'pageflow_scrolled.editor.select_link_destination.inaccessible_entry': 'No access to %{title}',
    'pageflow_scrolled.editor.select_link_destination.kinds.this_entry.title': 'Chapter or section of this story',
    'pageflow_scrolled.editor.select_link_destination.kinds.other_entry.title': 'Another story',
    'pageflow_scrolled.editor.select_link_destination.kinds.file.title': 'File download',
    'pageflow_scrolled.editor.select_link_destination.kinds.url.title': 'Other website',
    'pageflow_scrolled.editor.select_link_destination.open_in_new_tab': 'Open in new tab',
    'pageflow_scrolled.editor.select_link_destination.create': 'Create link',
    'pageflow_scrolled.editor.select_link_destination.header': 'Create link',
    'pageflow_scrolled.editor.select_link_destination.edit_header': 'Edit link',
    'pageflow_scrolled.editor.select_link_destination.save': 'Save',
    'pageflow_scrolled.editor.select_link_destination.remove': 'Remove link',
    'pageflow_scrolled.editor.select_link_destination.select_in_sidebar': 'Select file',
    'pageflow_scrolled.editor.select_link_destination.selection_label': 'a file to download',
    'pageflow_scrolled.editor.select_link_destination.cancel': 'Cancel'
  });

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
    const {getByText, getByRole} = render(view);
    await user.click(getByText('Intro'));
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({href: {chapter: 10}});
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
    const {getByTitle, getByRole} = render(view);
    await user.click(getByTitle('Select section'));
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({href: {section: 10}});
  });

  it('does not apply chapter before confirming', async () => {
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
    const {getByText} = render(view);
    await user.click(getByText('Intro'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('disables create button until destination is selected', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        chapters: [
          {id: 1, permaId: 10, configuration: {title: 'Intro'}}
        ]
      })
    });
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByText, getByRole} = render(view);

    expect(getByRole('button', {name: 'Create link'})).toBeDisabled();

    await user.click(getByText('Intro'));

    expect(getByRole('button', {name: 'Create link'})).not.toBeDisabled();
  });

  it('expands panel for chapters and sections of this story by default', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: jest.fn()
    });

    const {getByRole} = render(view);

    expect(getByRole('radio', {name: /Chapter or section of this story/})).toBeChecked();
  });

  function respondWithOutline(id, {
    chapters = [], sections = [], signatures = {}, chapterDestinations
  } = {}) {
    testContext.server.respondWith(
      'GET', new RegExp(`linkable_entries/${id}$`), [
        200, {'Content-Type': 'application/json'},
        JSON.stringify({
          id,
          permaId: id,
          title: 'Other story',
          url: '/other-story',
          chapters: chapterDestinations || destinations(signatures.chapters),
          sections: destinations(signatures.sections),
          collections: {
            storylines: [{id: 1, permaId: 1, role: 'main'}],
            chapters,
            sections,
            contentElements: []
          }
        })
      ]
    );
    testContext.server.respond();
  }

  function destinations(signatures = {}) {
    return Object.entries(signatures).map(([permaId, signature]) => ({
      permaId: Number(permaId),
      signature
    }));
  }

  describe('with other entry selected', () => {
    function renderDialog({seed, onSelect = jest.fn()} = {}) {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed(seed)
      });
      const view = new SelectLinkDestinationDialogView({entry, onSelect});

      return {entry, ...render(view)};
    }

    async function selectOtherEntry(user, {getByRole}, {moreEntries = []} = {}) {
      await user.click(getByRole('radio', {name: /Another story/}));
      respondWithLinkableEntries([{
        id: 5, title: 'Other story', typeName: 'scrolled', signature: 'signed-5'
      }, ...moreEntries]);
      await user.click(getByRole('button', {name: /Show stories/}));
      await user.click(getByRole('option', {name: 'Other story'}));
    }

    it('does not fetch entries before panel is selected', () => {
      renderDialog();

      expect(testContext.requests).toHaveLength(0);
    });

    it('fetches entries once when panel is selected', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await user.click(result.getByRole('radio', {name: /Another story/}));
      await user.click(result.getByRole('radio', {name: /Other website/}));
      await user.click(result.getByRole('radio', {name: /Another story/}));

      expect(testContext.requests).toHaveLength(1);
    });

    it('only offers entries returned by server', async () => {
      const user = userEvent.setup();
      const result = renderDialog({
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]}
      });
      await user.click(result.getByRole('radio', {name: /Another story/}));
      respondWithLinkableEntries([{id: 5, title: 'Other story'}]);
      await user.click(result.getByRole('button', {name: /Show stories/}));

      expect(result.getAllByRole('option').map(option => option.textContent))
        .toEqual(['Other story']);
    });

    it('disables create button until story is selected', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await user.click(result.getByRole('radio', {name: /Another story/}));

      expect(result.getByRole('button', {name: 'Create link'})).toBeDisabled();
    });

    it('links to other entry with signature', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({href: {entry: 5, signature: 'signed-5'}});
    });

    it('makes linked entry available to render created link', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await user.click(result.getByRole('radio', {name: /Another story/}));
      respondWithLinkableEntries([{
        id: 5, title: 'Other story', url: '/other-story', previewUrl: '/admin/other-story',
        publicationState: 'not_published', signature: 'signed-5'
      }]);
      await user.click(result.getByRole('button', {name: /Show stories/}));
      await user.click(result.getByRole('option', {name: /Other story/}));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(result.entry.linkedEntries.get(5).attributes).toEqual({
        id: 5, title: 'Other story', url: '/other-story', previewUrl: '/admin/other-story',
        publicationState: 'not_published'
      });
    });

    async function expandOutline(user, {getByRole}, outline) {
      await user.click(getByRole('button', {name: 'Link to chapter or section of story'}));
      respondWithOutline(5, outline);
    }

    it('allows selecting chapter of other entry', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}],
        signatures: {chapters: {70: 'signed-chapter-70'}}
      });
      await user.click(await result.findByText('Other chapter'));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({
        href: {entry: 5, chapter: 70, signature: 'signed-chapter-70'}
      });
    });

    it('collapses outline when selecting entry without outline', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result, {
        moreEntries: [{id: 6, title: 'Paged story', typeName: 'paged', signature: 'signed-6'}]
      });
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}]
      });
      await user.click(result.getByRole('button', {name: /Show stories/}));
      await user.click(result.getByRole('option', {name: 'Paged story'}));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({href: {entry: 6, signature: 'signed-6'}});
      expect(testContext.requests.map(request => request.url))
        .not.toContainEqual(expect.stringMatching(/linkable_entries\/6$/));
    });

    it('displays outline only once when expanding again while loading', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await selectOtherEntry(user, result);
      await user.click(result.getByRole('button', {name: 'Link to chapter or section of story'}));
      await user.click(result.getByRole('button', {name: 'Link to beginning of story instead'}));
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}]
      });

      expect(await result.findAllByText('Other chapter')).toHaveLength(1);
    });

    it('keeps selected chapter when selecting same entry again', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}],
        signatures: {chapters: {70: 'signed-chapter-70'}}
      });
      await user.click(await result.findByText('Other chapter'));
      await user.click(result.getByRole('button', {name: /Show stories/}));
      await user.click(result.getByRole('option', {name: 'Other story'}));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({
        href: {entry: 5, chapter: 70, signature: 'signed-chapter-70'}
      });
    });

    it('makes linked chapter available to render created link', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await selectOtherEntry(user, result);
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}],
        chapterDestinations: [{permaId: 70, title: 'Other chapter', slug: 'other-chapter',
                               signature: 'signed-chapter-70'}]
      });
      await user.click(await result.findByText('Other chapter'));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(result.entry.linkedEntries.get(5).get('chapters')).toEqual([{
        permaId: 70, title: 'Other chapter', slug: 'other-chapter', previewSlug: 'other-chapter'
      }]);
    });

    it('allows selecting section of other entry', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1, configuration: {}}],
        sections: [{id: 8, permaId: 80, chapterId: 7, configuration: {}}],
        signatures: {sections: {80: 'signed-section-80'}}
      });
      await user.click(await result.findByTitle('Select section'));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({
        href: {entry: 5, section: 80, signature: 'signed-section-80'}
      });
    });

    it('disables create button while outline is expanded without selection', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await selectOtherEntry(user, result);
      await expandOutline(user, result);

      expect(result.getByRole('button', {name: 'Create link'})).toBeDisabled();
    });

    it('allows switching back to linking to beginning of story', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await expandOutline(user, result, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}],
        signatures: {chapters: {70: 'signed-chapter-70'}}
      });
      await user.click(await result.findByText('Other chapter'));
      await user.click(result.getByRole('button', {name: 'Link to beginning of story instead'}));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({href: {entry: 5, signature: 'signed-5'}});
    });

    it('does not offer linking to chapters of entries of other types', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await user.click(result.getByRole('radio', {name: /Another story/}));
      respondWithLinkableEntries([{
        id: 6, title: 'Paged story', typeName: 'paged', signature: 'signed-6'
      }]);
      await user.click(result.getByRole('button', {name: /Show stories/}));
      await user.click(result.getByRole('option', {name: 'Paged story'}));

      expect(result.queryByRole('button', {name: 'Link to chapter or section of story'}))
        .toBeNull();
    });

    it('displays error if outline can not be loaded', async () => {
      const user = userEvent.setup();
      const result = renderDialog();
      await selectOtherEntry(user, result);
      await user.click(result.getByRole('button', {name: 'Link to chapter or section of story'}));
      testContext.server.respondWith('GET', /linkable_entries\/5$/, [404, {}, '']);
      testContext.server.respond();

      expect(await result.findByText('Outline could not be loaded')).toBeInTheDocument();
    });

    it('allows opening other entry in new tab', async () => {
      const listener = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({onSelect: listener});
      await selectOtherEntry(user, result);
      await user.click(panel(result, /Another story/).getByLabelText('Open in new tab'));
      await user.click(result.getByRole('button', {name: 'Create link'}));

      expect(listener).toHaveBeenCalledWith({
        href: {entry: 5, signature: 'signed-5'},
        openInNewTab: true
      });
    });
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
    await user.click(getByRole('radio', {name: /Other website/}));
    await user.type(getByLabelText('URL'), 'https://example.com');
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({href: 'https://example.com'});
  });

  it('creates link when pressing enter in url input', async () => {
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
    await user.click(getByRole('radio', {name: /Other website/}));
    await user.type(getByLabelText('URL'), 'https://example.com{Enter}');

    expect(listener).toHaveBeenCalledWith({href: 'https://example.com'});
  });

  it('ignores enter in empty url input', async () => {
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
    await user.click(getByRole('radio', {name: /Other website/}));
    await user.type(getByLabelText('URL'), '{Enter}');

    expect(listener).not.toHaveBeenCalled();
  });

  it('disables create button while url is empty', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('radio', {name: /Other website/}));

    expect(getByRole('button', {name: 'Create link'})).toBeDisabled();
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
    const result = render(view);
    const {getByLabelText, getByRole} = result;
    await user.click(getByRole('radio', {name: /Other website/}));
    await user.type(getByLabelText('URL'), 'https://example.com');
    await user.click(panel(result, /Other website/).getByLabelText('Open in new tab'));
    await user.click(getByRole('button', {name: 'Create link'}));

    expect(listener).toHaveBeenCalledWith({
      href: 'https://example.com',
      openInNewTab: true
    });
  });

  it('disables create button for file download without file', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: jest.fn()
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('radio', {name: /File download/}));

    expect(getByRole('button', {name: 'Create link'})).toBeDisabled();
  });

  it('allows selecting file', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed(),
      fileTypes: factories.fileTypesWithImageFileType(),
      filesAttributes: {
        image_files: [
          {
            id: 1,
            perma_id: 10
          }
        ]
      }
    });
    const file = entry.getFileCollection('image_files').get(1);
    const listener = jest.fn();
    const view = new SelectLinkDestinationDialogView({
      entry,
      onSelect: listener
    });
    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('radio', {name: /File download/}));
    await user.click(getByRole('button', {name: 'Select file'}));

    expect(navigate).toHaveBeenCalledWith(
      expect.stringContaining('/files?handler=linkDestination'),
      {trigger: true}
    );

    const payload = decodeURIComponent(navigate.mock.calls[0][0].split('payload=')[1]);

    expect(editor.createFileSelectionHandler('linkDestination', payload).selectionLabel)
      .toEqual('a file to download');

    editor.createFileSelectionHandler('linkDestination', '{}').call(file);

    expect(listener).toHaveBeenCalledWith({
      href: {file: {permaId: 10, collectionName: 'imageFiles'}}
    });
  });

  describe('with existing link', () => {
    function renderDialog(link, {
      seed, onSelect = jest.fn(), onRemove = jest.fn(), allowRemove, ...options
    } = {}) {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed(seed),
        ...options
      });
      const view = new SelectLinkDestinationDialogView({
        entry, link, allowRemove, onSelect, onRemove
      });

      return render(view);
    }

    it('renders edit header and save button', () => {
      const {getByRole, queryByRole} = renderDialog({href: 'https://example.com'});

      expect(getByRole('heading', {name: 'Edit link'})).toBeInTheDocument();
      expect(getByRole('button', {name: 'Save'})).toBeInTheDocument();
      expect(queryByRole('button', {name: 'Create link'})).toBeNull();
    });

    it('does not offer removing new links', () => {
      const {queryByRole} = renderDialog(undefined, {allowRemove: true});

      expect(queryByRole('button', {name: 'Remove link'})).toBeNull();
    });

    it('does not offer removing links unless allowed', () => {
      const {queryByRole} = renderDialog({href: 'https://example.com'});

      expect(queryByRole('button', {name: 'Remove link'})).toBeNull();
    });

    it('calls onRemove when remove button is clicked', async () => {
      const onRemove = jest.fn();
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const {getByRole} = renderDialog({href: 'https://example.com'}, {
        allowRemove: true, onRemove, onSelect
      });
      await user.click(getByRole('button', {name: 'Remove link'}));

      expect(onRemove).toHaveBeenCalled();
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('preselects url', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: 'https://example.com', openInNewTab: true}, {onSelect});

      expect(result.getByRole('radio', {name: /Other website/})).toBeChecked();
      expect(result.getByLabelText('URL')).toHaveValue('https://example.com');
      expect(panel(result, /Other website/).getByLabelText('Open in new tab')).toBeChecked();

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({href: 'https://example.com', openInNewTab: true});
    });

    it('preselects chapter of this entry', async () => {
      Element.prototype.scrollIntoView = jest.fn();
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {chapter: 10}}, {
        seed: {chapters: [{id: 1, permaId: 10, configuration: {title: 'Intro'}}]},
        onSelect
      });

      expect(result.getByRole('radio', {name: /Chapter or section of this story/})).toBeChecked();
      expect(result.getByText('Intro').closest('li')).toHaveAttribute('aria-current', 'true');

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({href: {chapter: 10}});
      delete Element.prototype.scrollIntoView;
    });

    it('preselects file', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {file: {permaId: 10, collectionName: 'imageFiles'}}}, {
        onSelect,
        fileTypes: factories.fileTypesWithImageFileType(),
        filesAttributes: {
          image_files: [{id: 1, perma_id: 10, file_name: 'report.jpg'}]
        }
      });

      expect(result.getByRole('radio', {name: /File download/})).toBeChecked();
      expect(result.getByText('report.jpg')).toBeInTheDocument();

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({
        href: {file: {permaId: 10, collectionName: 'imageFiles'}}
      });
    });

    it('preselects other entry and keeps signature', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {entry: 9, signature: 'signed-9'}, openInNewTab: true}, {
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]},
        onSelect
      });

      respondWithLinkableEntries([{id: 9, title: 'Linked story', signature: 'other'}]);

      expect(result.getByRole('radio', {name: /Another story/})).toBeChecked();
      expect(result.getByRole('combobox', {name: 'Story'})).toHaveValue('Linked story');

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({
        href: {entry: 9, signature: 'signed-9'},
        openInNewTab: true
      });
    });

    it('explains that link to entry that cannot be linked to cannot be changed', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {entry: 9, signature: 'signed-9'}}, {
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]},
        onSelect
      });
      respondWithLinkableEntries([{id: 5, title: 'Other story', signature: 'signed-5'}]);

      expect(result.getByText('No access to Linked story')).toBeInTheDocument();
      expect(result.getByRole('combobox', {name: 'Story'})).toHaveValue('');

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({href: {entry: 9, signature: 'signed-9'}});
    });

    it('allows replacing link to entry that cannot be linked to', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {entry: 9, signature: 'signed-9'}}, {
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]},
        onSelect
      });
      respondWithLinkableEntries([{id: 5, title: 'Other story', signature: 'signed-5'}]);
      await user.click(result.getByRole('button', {name: /Show stories/}));
      await user.click(result.getByRole('option', {name: 'Other story'}));
      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(result.queryByText('No access to Linked story')).not.toBeInTheDocument();
      expect(onSelect).toHaveBeenCalledWith({href: {entry: 5, signature: 'signed-5'}});
    });

    it('expands outline of other entry for chapter links', async () => {
      Element.prototype.scrollIntoView = jest.fn();
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {entry: 9, chapter: 70, signature: 'signed-chapter-70'}}, {
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]},
        onSelect
      });
      respondWithLinkableEntries([{
        id: 9, title: 'Linked story', typeName: 'scrolled', signature: 'signed-9'
      }]);
      respondWithOutline(9, {
        chapters: [{id: 7, permaId: 70, storylineId: 1,
                    configuration: {title: 'Other chapter'}}],
        signatures: {chapters: {70: 'signed-chapter-70'}}
      });

      expect((await result.findByText('Other chapter')).closest('li'))
        .toHaveAttribute('aria-current', 'true');

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({
        href: {entry: 9, chapter: 70, signature: 'signed-chapter-70'}
      });
      delete Element.prototype.scrollIntoView;
    });

    it('does not offer outline for chapter link to entry that cannot be linked to', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();
      const result = renderDialog({href: {entry: 9, chapter: 70, signature: 'signed-chapter-70'}}, {
        seed: {linkedEntries: [{id: 9, title: 'Linked story', url: '/linked'}]},
        onSelect
      });
      respondWithLinkableEntries([{
        id: 5, title: 'Other story', typeName: 'scrolled', signature: 'signed-5'
      }]);

      expect(result.getByText('No access to Linked story')).toBeInTheDocument();
      expect(result.queryByRole('button', {name: 'Link to beginning of story instead'}))
        .toBeNull();
      expect(testContext.requests).toHaveLength(1);

      await user.click(result.getByRole('button', {name: 'Save'}));

      expect(onSelect).toHaveBeenCalledWith({
        href: {entry: 9, chapter: 70, signature: 'signed-chapter-70'}
      });
    });

    it('fetches entries when other entry is preselected', () => {
      renderDialog({href: {entry: 9, signature: 'signed-9'}});

      expect(testContext.requests).toHaveLength(1);
    });
  });
});
