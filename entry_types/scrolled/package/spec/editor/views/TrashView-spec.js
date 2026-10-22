import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitFor, within} from '@testing-library/dom';

import {editor} from 'pageflow-scrolled/editor';

import {TrashView} from 'editor/views/TrashView';
import styles from 'editor/views/TrashView.module.css';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('TrashView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  const {createEntry} = useEditorGlobals();

  useFakeXhr(() => testContext);

  useFakeTranslations({
    'pageflow_scrolled.editor.chapter_item.chapter': 'Chapter',
    'pageflow_scrolled.editor.trash_view.back': 'Outline',
    'pageflow_scrolled.editor.trash_view.blank_slate': 'Nothing deleted',
    'pageflow_scrolled.editor.trash_view.load_failed': 'Could not load',
    'pageflow_scrolled.editor.trash_view.actions': 'Actions',
    'pageflow_scrolled.editor.trash_view.empty_trash.destroy': 'Empty trash',
    'pageflow_scrolled.editor.trash_view.empty_trash.confirm_destroy': 'Empty?',
    'pageflow_scrolled.editor.trash_view.delete_item.destroy': 'Delete permanently',
    'pageflow_scrolled.editor.trash_view.delete_item.confirm_destroy': 'Delete?',
    'pageflow_scrolled.editor.trash_view.empty_failed': 'Could not empty',
    'pageflow_scrolled.editor.trash_view.delete_failed': 'Could not delete',
    'pageflow_scrolled.editor.trash_view.hint': 'Deleted sections can be restored here.',
    'pageflow_scrolled.editor.trash_view.origin': 'Section from %{chapter}',
    'pageflow_scrolled.editor.trash_view.origin_missing': 'Section from deleted chapter',
    'pageflow_scrolled.editor.trash_view.restore': 'Restore',
    'pageflow_scrolled.editor.trash_view.restore_failed': 'Could not restore',
    'pageflow_scrolled.editor.trash_view.restore_chapter_failed': 'Could not restore chapter',
    'pageflow_scrolled.editor.trash_view.trashed_at': 'Deleted %{time}',
    'pageflow_scrolled.editor.trash_view.chapter.one': 'Chapter %{title} with 1 section',
    'pageflow_scrolled.editor.trash_view.chapter.other':
      'Chapter %{title} with %{count} sections',
    'pageflow_scrolled.editor.chapter_item.unnamed': 'Untitled',
    'pageflow_scrolled.editor.trash_view.content_elements': '%{types} from %{section}',
    'pageflow_scrolled.editor.trash_view.content_elements_origin_missing':
      '%{types} from deleted section',
    'pageflow_scrolled.editor.trash_view.restore_content_elements_failed':
      'Could not restore elements',
    'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
    'pageflow_scrolled.editor.configuration_places.section': 'Section %{number}',
    'pageflow_scrolled.editor.content_elements.heading.name': 'Heading',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Image'
  });

  function trashItem({id, originPermaId, sectionId = id * 10}) {
    return {
      id,
      kind: 'section',
      originPermaId,
      originPosition: 0,
      trashedAt: '2026-10-01T12:00:00Z',
      sections: [
        {id: sectionId, permaId: sectionId, chapterId: id, configuration: {},
         contentElements: []}
      ]
    };
  }

  function trashItems(getAllByRole) {
    return getAllByRole('listitem').filter(item => item.classList.contains(styles.item));
  }

  function render(items) {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}}]
    });
    testContext.entry = entry;

    const result = renderBackboneView(new TrashView({entry}));

    testContext.server.respond(
      'GET', '/editor/entries/1/scrolled/trash_items',
      [200, {'Content-Type': 'application/json'}, JSON.stringify(items)]
    );

    return result;
  }

  it('navigates to the outline when the back link is clicked', () => {
    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});
    const {getByRole} = render([]);

    fireEvent.click(getByRole('link', {name: 'Outline'}));

    expect(navigate).toHaveBeenCalledWith('/', {trigger: true});
    navigate.mockRestore();
  });

  it('lists trash items with origin chapter', () => {
    const {getAllByRole} = render([
      trashItem({id: 5, originPermaId: 100}),
      trashItem({id: 6, originPermaId: 999})
    ]);

    const items = trashItems(getAllByRole);

    expect(items[0]).toHaveTextContent('Section from Intro');
    expect(items[1]).toHaveTextContent('Section from deleted chapter');
  });

  it('prefixes deletion time', () => {
    const {getAllByRole} = render([trashItem({id: 5, originPermaId: 100})]);

    expect(trashItems(getAllByRole)[0].querySelector('time'))
      .toHaveTextContent(/^Deleted .*2026/);
  });

  it('lists most recently deleted items first when shown again', () => {
    render([trashItem({id: 5, originPermaId: 100})]);
    const view = renderBackboneView(new TrashView({entry: testContext.entry}));

    testContext.server.respond(
      'GET', '/editor/entries/1/scrolled/trash_items',
      [200, {'Content-Type': 'application/json'}, JSON.stringify([
        trashItem({id: 6, originPermaId: 999}),
        trashItem({id: 5, originPermaId: 100})
      ])]
    );

    expect(trashItems(view.getAllByRole).map(item => item.textContent))
      .toEqual([
        expect.stringContaining('Section from deleted chapter'),
        expect.stringContaining('Section from Intro')
      ]);
  });

  it('shows loading indicator until trash items have been fetched', async () => {
    const entry = createEntry({});
    const view = new TrashView({entry});
    renderBackboneView(view);

    expect(view.el.querySelector('.loading')).not.toBeNull();

    testContext.server.respond(
      'GET', '/editor/entries/1/scrolled/trash_items',
      [200, {'Content-Type': 'application/json'}, '[]']
    );

    await waitFor(() => expect(view.el.querySelector('.loading')).toBeNull());
  });

  it('displays error instead of loading indicator if loading fails', async () => {
    const entry = createEntry({});
    const view = new TrashView({entry});
    const {findByText} = renderBackboneView(view);

    testContext.server.respond(
      'GET', '/editor/entries/1/scrolled/trash_items',
      [500, {'Content-Type': 'application/json'}, '{}']
    );

    expect(await findByText('Could not load')).toBeInTheDocument();
    expect(view.el.querySelector('.loading')).toBeNull();
  });

  it('labels trashed chapters with title and section count', () => {
    const {getAllByRole} = render([
      {
        ...trashItem({id: 5}),
        kind: 'chapter',
        title: 'Outro',
        sections: [
          {id: 50, permaId: 50, chapterId: 5, configuration: {}, contentElements: []},
          {id: 51, permaId: 51, chapterId: 5, configuration: {}, contentElements: []}
        ]
      },
      {...trashItem({id: 6}), kind: 'chapter'}
    ]);

    const items = trashItems(getAllByRole);

    expect(items[0]).toHaveTextContent('Chapter Outro with 2 sections');
    expect(items[1]).toHaveTextContent('Chapter Untitled with 1 section');
  });

  it('renders blank slate when nothing has been deleted', () => {
    const {getByText} = render([]);

    expect(getByText('Nothing deleted')).toBeInTheDocument();
  });

  it('explains what can be restored', () => {
    const {getByText} = render([]);

    expect(getByText('Deleted sections can be restored here.')).toBeInTheDocument();
  });

  it('restores entry when restore button is clicked', () => {
    const {getByRole} = render([trashItem({id: 5, originPermaId: 100})]);

    fireEvent.click(getByRole('button', {name: 'Restore'}));

    expect(testContext.requests.at(-1).url)
      .toBe('/editor/entries/1/scrolled/trash_items/5/restore');
  });

  it('displays error when restore fails', async () => {
    const {getByRole, getAllByRole} = render([trashItem({id: 5, originPermaId: 100})]);

    fireEvent.click(getByRole('button', {name: 'Restore'}));
    testContext.server.respond(
      'POST', '/editor/entries/1/scrolled/trash_items/5/restore',
      [422, {'Content-Type': 'application/json'}, '{}']
    );

    await waitFor(() =>
      expect(within(trashItems(getAllByRole)[0]).getByText('Could not restore'))
        .toBeInTheDocument()
    );
  });

  it('displays generic error when restoring chapter fails', async () => {
    const {getByRole, getAllByRole} = render([
      {...trashItem({id: 5}), kind: 'chapter', originPermaId: 999}
    ]);

    fireEvent.click(getByRole('button', {name: 'Restore'}));

    await waitFor(() =>
      expect(within(trashItems(getAllByRole)[0]).getByText('Could not restore chapter'))
        .toBeInTheDocument()
    );
  });

  function contentElementsTrashItem({id, originPermaId}) {
    return {
      ...trashItem({id}),
      kind: 'contentElements',
      originPermaId,
      sections: [
        {
          id: id * 10, permaId: id * 10, chapterId: id, configuration: {},
          contentElements: [
            {id: 1, permaId: 1, typeName: 'heading', configuration: {}},
            {id: 2, permaId: 2, typeName: 'inlineImage', configuration: {}},
            {id: 3, permaId: 3, typeName: 'heading', configuration: {}}
          ]
        }
      ]
    };
  }

  function renderWithSections(items) {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}}],
      sections: [
        {id: 10, permaId: 1000, chapterId: 1, position: 0},
        {id: 11, permaId: 1100, chapterId: 1, position: 1}
      ]
    });

    const result = renderBackboneView(new TrashView({entry}));

    testContext.server.respond(
      'GET', '/editor/entries/1/scrolled/trash_items',
      [200, {'Content-Type': 'application/json'}, JSON.stringify(items)]
    );

    return result;
  }

  it('labels trashed content elements with type names and origin section', () => {
    const {getAllByRole} = renderWithSections([
      contentElementsTrashItem({id: 5, originPermaId: 1100}),
      contentElementsTrashItem({id: 6, originPermaId: 999})
    ]);

    const items = trashItems(getAllByRole);

    expect(items[0]).toHaveTextContent('Heading, Image from Intro - Section 2');
    expect(items[1]).toHaveTextContent('Heading, Image from deleted section');
  });

  it('marks content element items to render their preview out of context', () => {
    const {getAllByRole} = renderWithSections([
      contentElementsTrashItem({id: 5, originPermaId: 1100}),
      {...trashItem({id: 6}), originPermaId: 100}
    ]);

    const items = trashItems(getAllByRole);

    expect(items[0]).toHaveClass(styles.contentElementsItem);
    expect(items[1]).not.toHaveClass(styles.contentElementsItem);
  });

  it('displays content element specific error when restore fails', async () => {
    const {getByRole, getAllByRole} = renderWithSections([
      contentElementsTrashItem({id: 5, originPermaId: 1100})
    ]);

    fireEvent.click(getByRole('button', {name: 'Restore'}));
    testContext.server.respond(
      'POST', '/editor/entries/1/scrolled/trash_items/5/restore',
      [422, {'Content-Type': 'application/json'}, '{}']
    );

    await waitFor(() =>
      expect(within(trashItems(getAllByRole)[0]).getByText('Could not restore elements'))
        .toBeInTheDocument()
    );
  });

  describe('permanent deletion', () => {
    beforeEach(() => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
    });

    afterEach(() => {
      window.confirm.mockRestore();
    });

    it('empties trash via actions menu', () => {
      const {getByRole} = render([trashItem({id: 5, originPermaId: 100})]);

      fireEvent.click(getByRole('link', {name: 'Empty trash'}));

      expect(window.confirm).toHaveBeenCalledWith('Empty?');
      expect(testContext.requests.at(-1)).toMatchObject({
        method: 'DELETE',
        url: '/editor/entries/1/scrolled/trash_items/empty'
      });
    });

    it('deletes single item via item menu', () => {
      const {getByRole} = render([trashItem({id: 5, originPermaId: 100})]);

      fireEvent.click(getByRole('link', {name: 'Delete permanently'}));

      expect(window.confirm).toHaveBeenCalledWith('Delete?');
      expect(testContext.requests.at(-1)).toMatchObject({
        method: 'DELETE',
        url: '/editor/entries/1/scrolled/trash_items/5'
      });
    });

    it('displays error when emptying trash fails', async () => {
      const {getByRole, findByText} = render([trashItem({id: 5, originPermaId: 100})]);

      fireEvent.click(getByRole('link', {name: 'Empty trash'}));
      testContext.server.respond(
        'DELETE', '/editor/entries/1/scrolled/trash_items/empty', [500, {}, '']
      );

      expect(await findByText('Could not empty')).toBeInTheDocument();
    });

    it('displays error in item when deleting it fails', async () => {
      const {getByRole, getAllByRole} = render([trashItem({id: 5, originPermaId: 100})]);

      fireEvent.click(getByRole('link', {name: 'Delete permanently'}));
      testContext.server.respond(
        'DELETE', '/editor/entries/1/scrolled/trash_items/5', [500, {}, '']
      );

      await waitFor(() =>
        expect(within(trashItems(getAllByRole)[0]).getByText('Could not delete'))
          .toBeInTheDocument()
      );
    });

    it('does not delete if confirmation is canceled', () => {
      window.confirm.mockReturnValue(false);
      const {getByRole} = render([trashItem({id: 5, originPermaId: 100})]);
      const requestCount = testContext.requests.length;

      fireEvent.click(getByRole('link', {name: 'Delete permanently'}));

      expect(testContext.requests).toHaveLength(requestCount);
    });
  });
});
