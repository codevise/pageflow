import 'contentElements/hotspots/editor';

import {editor} from 'pageflow/editor';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('hotspots configuration place', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
    'pageflow_scrolled.editor.content_elements.hotspots.name': 'Hotspots',
    'pageflow_scrolled.editor.content_elements.hotspots.attributes.image.label': 'Image',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes.tooltipImage.label':
      'Image in tooltip',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes.portraitActiveImage.label':
      'Active image (Portrait)',
    'pageflow_scrolled.editor.content_elements.hotspots.configuration_places.tooltipTexts':
      'Link in tooltip text',
    'pageflow_scrolled.editor.content_elements.hotspots.configuration_places.tooltipLinks':
      'Tooltip link'
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
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'hotspots',
                         configuration}],
      fileReferenceLocations: {
        contentElements: {
          hotspots: [
            {path: ['image'], collection: 'imageFiles'},
            {path: ['areas', '*', 'tooltipImage'], collection: 'imageFiles'},
            {path: ['areas', '*', 'portraitActiveImage'], collection: 'imageFiles'}
          ]
        }
      }
    });
  }

  function places(entry) {
    return entry.fileReferences().placesFor(
      entry.getFileCollection('image_files').findWhere({perma_id: 5})
    );
  }

  it('names the referencing property', () => {
    const entry = create({image: 5});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Hotspots', 'Image']]);
  });

  it('selects the content element and deactivates areas on select', () => {
    const entry = create({image: 5, areas: [{id: 7}]});
    const commandListener = jest.fn();
    const selectListener = jest.fn();
    entry.contentElements.get(2).on('postCommand', commandListener);
    entry.on('selectContentElement', selectListener);

    places(entry)[0].select();

    expect(commandListener).toHaveBeenCalledWith(2, {type: 'SET_ACTIVE_AREA', index: -1});
    expect(selectListener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                                {navigate: true});
  });

  it('names the referencing property of an area', () => {
    const entry = create({areas: [{id: 7}, {id: 8, tooltipImage: 5}]});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Hotspots', 'Image in tooltip']]);
  });

  it('activates the area and opens its editor on select', () => {
    const entry = create({areas: [{id: 7}, {id: 8, tooltipImage: 5}]});
    const listener = jest.fn();
    entry.contentElements.get(2).on('postCommand', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(2, {type: 'SET_ACTIVE_AREA', index: 1});
    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/hotspots/2/8/area', {trigger: true});
  });

  it('selects the content element without leaving the area route', () => {
    const entry = create({areas: [{id: 7}, {id: 8, tooltipImage: 5}]});
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2), {navigate: false});
  });

  it('opens the portrait tab for a portrait property', () => {
    const entry = create({areas: [{id: 7, portraitActiveImage: 5}]});

    places(entry)[0].select();

    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/hotspots/2/7/portrait', {trigger: true});
  });

  it('names links in tooltip texts', () => {
    const entry = create({
      areas: [{id: 7}],
      tooltipTexts: {7: {description: [linkNode()]}}
    });

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Hotspots', 'Link in tooltip text']]);
  });

  it('names tooltip links', () => {
    const entry = create({
      areas: [{id: 7}],
      tooltipLinks: {7: {href: fileHref()}}
    });

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Hotspots', 'Tooltip link']]);
  });

  it('activates the area of a tooltip link on select', () => {
    const entry = create({
      areas: [{id: 7}, {id: 8}],
      tooltipLinks: {8: {href: fileHref()}}
    });
    const commandListener = jest.fn();
    const selectListener = jest.fn();
    entry.contentElements.get(2).on('postCommand', commandListener);
    entry.on('selectContentElement', selectListener);

    places(entry)[0].select();

    expect(commandListener).toHaveBeenCalledWith(2, {type: 'SET_ACTIVE_AREA', index: 1});
    expect(selectListener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                                {navigate: false});
    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/hotspots/2/8/area', {trigger: true});
  });

  it('selects the content element for tooltip links of removed areas', () => {
    const entry = create({
      areas: [{id: 7}],
      tooltipLinks: {8: {href: fileHref()}}
    });
    const commandListener = jest.fn();
    entry.contentElements.get(2).on('postCommand', commandListener);

    places(entry)[0].select();

    expect(commandListener).toHaveBeenCalledWith(2, {type: 'SET_ACTIVE_AREA', index: -1});
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
