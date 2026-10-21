import 'contentElements/externalLinkList/editor';

import {editor} from 'pageflow/editor';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('externalLinkList configuration place', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
    'pageflow_scrolled.editor.content_elements.externalLinkList.name': 'Link list',
    'pageflow_scrolled.editor.content_elements.externalLinkList.attributes.thumbnail.label':
      'Thumbnail',
    'pageflow_scrolled.editor.content_elements.externalLinkList.configuration_places.itemTexts':
      'Link in item text',
    'pageflow_scrolled.editor.content_elements.externalLinkList.configuration_places.itemLinks':
      'Item link'
  });

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function create(configuration) {
    return createEntry({
      chapters: [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
      imageFiles: [{perma_id: 5}],
      sections: [{id: 1, permaId: 10, chapterId: 1}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'externalLinkList',
                         configuration}],
      fileReferenceLocations: {
        contentElements: {
          externalLinkList: [{path: ['links', '*', 'thumbnail'], collection: 'imageFiles'}]
        }
      }
    });
  }

  function places(entry) {
    return entry.fileReferences().placesFor(
      entry.getFileCollection('image_files').findWhere({perma_id: 5})
    );
  }

  it('names the referencing property of a link', () => {
    const entry = create({links: [{id: 7}, {id: 8, thumbnail: 5}]});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Link list', 'Thumbnail']]);
  });

  it('selects the link and opens its editor on select', () => {
    const entry = create({links: [{id: 7}, {id: 8, thumbnail: 5}]});
    const listener = jest.fn();
    entry.contentElements.get(2).on('postCommand', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(2, {type: 'SET_SELECTED_ITEM', index: 1});
    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/external_links/2/8', {trigger: true});
  });

  it('selects the content element without leaving the link route', () => {
    const entry = create({links: [{id: 7}, {id: 8, thumbnail: 5}]});
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2), {navigate: false});
  });

  it('names links in item texts', () => {
    const entry = create({links: [{id: 7}], itemTexts: {7: {description: [linkNode()]}}});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Link list', 'Link in item text']]);
  });

  it('names item links', () => {
    const entry = create({links: [{id: 7}], itemLinks: {7: {href: fileHref()}}});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Link list', 'Item link']]);
  });

  it('selects the link of an item link on select', () => {
    const entry = create({links: [{id: 7}, {id: 8}], itemLinks: {8: {href: fileHref()}}});
    const commandListener = jest.fn();
    const selectListener = jest.fn();
    entry.contentElements.get(2).on('postCommand', commandListener);
    entry.on('selectContentElement', selectListener);

    places(entry)[0].select();

    expect(commandListener).toHaveBeenCalledWith(2, {type: 'SET_SELECTED_ITEM', index: 1});
    expect(selectListener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                                {navigate: false});
    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/external_links/2/8', {trigger: true});
  });

  it('selects the content element for item links of removed links', () => {
    const entry = create({links: [{id: 7}], itemLinks: {8: {href: fileHref()}}});
    const selectListener = jest.fn();
    entry.on('selectContentElement', selectListener);

    places(entry)[0].select();

    expect(selectListener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                                {navigate: true});
    expect(editor.router.navigate).not.toHaveBeenCalled();
  });

  function fileHref() {
    return {file: {permaId: 5, collectionName: 'imageFiles'}};
  }

  function linkNode() {
    return {type: 'paragraph', children: [
      {type: 'link', href: fileHref(), children: [{text: 'Download'}]}
    ]};
  }
});
