import '@testing-library/jest-dom/extend-expect';

import {editor} from 'pageflow-scrolled/editor';

import {MultiSelectionView} from 'editor/views/MultiSelectionView';

import {DropDownButton, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import {fireEvent, within} from '@testing-library/dom';

describe('MultiSelectionView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.multi_selection_view.tab.one': '1 Element',
    'pageflow_scrolled.editor.multi_selection_view.tab.other': '%{count} Elements',
    'pageflow_scrolled.editor.content_elements.heading.name': 'Heading',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Inline image',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text block',
    'pageflow_scrolled.editor.destroy_content_elements_menu_item.destroy': 'Delete elements',
    'pageflow_scrolled.editor.destroy_content_elements_menu_item.confirm_destroy':
      'Really delete these elements?',
    'pageflow.editor.templates.back_button_decorator.outline': 'Outline',
    'pageflow.editor.views.edit_configuration.actions': 'Actions'
  });

  function buildView(entry, items) {
    return new MultiSelectionView({
      entry,
      itemType: 'contentElement',
      items
    });
  }

  beforeEach(() => {
    editor.contentElementTypes.register('heading', {pictogram: 'heading.svg'});
    editor.contentElementTypes.register('inlineImage', {});
    editor.contentElementTypes.register('textBlock', {});
  });

  it('renders tab labeled with number of selected content elements', () => {
    const entry = createEntry({
      contentElements: [{id: 1, typeName: 'heading'}, {id: 2, typeName: 'heading'}]
    });

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}, {id: 2}]));

    expect(getByRole('tab')).toHaveTextContent('2 Elements');
  });

  it('lists type names of selected content elements', () => {
    const entry = createEntry({
      contentElements: [
        {id: 1, typeName: 'heading'},
        {id: 2, typeName: 'inlineImage'},
        {id: 3, typeName: 'heading'}
      ]
    });

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}, {id: 2}]));

    expect(within(getByRole('tabpanel')).getAllByRole('listitem').map(item => item.textContent.trim()))
      .toEqual(['Heading', 'Inline image']);
  });

  it('lists content elements in order of sections and positions', () => {
    const entry = createEntry({
      sections: [{id: 10, position: 0}, {id: 20, position: 1}],
      contentElements: [
        {id: 1, sectionId: 20, position: 0, typeName: 'heading'},
        {id: 2, sectionId: 10, position: 1, typeName: 'textBlock'},
        {id: 3, sectionId: 10, position: 0, typeName: 'inlineImage'}
      ]
    });

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}, {id: 2}, {id: 3}]));

    expect(within(getByRole('tabpanel')).getAllByRole('listitem').map(item => item.textContent.trim()))
      .toEqual(['Inline image', 'Text block', 'Heading']);
  });

  it('renders type pictograms of selected content elements', () => {
    const entry = createEntry({contentElements: [{id: 1, typeName: 'heading'}]});

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}]));

    expect(within(getByRole('tabpanel')).getByRole('listitem').querySelector('[style*="heading.svg"]')).not.toBeNull();
  });

  it('ignores items of content elements that no longer exist', () => {
    const entry = createEntry({contentElements: [{id: 1, typeName: 'heading'}]});

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}, {id: 99}]));

    expect(within(getByRole('tabpanel')).getAllByRole('listitem')).toHaveLength(1);
  });

  it('ignores items of content elements without section', () => {
    const entry = createEntry({
      sections: [{id: 10}],
      contentElements: [
        {id: 1, sectionId: 10, typeName: 'heading'},
        {id: 2, sectionId: 20, typeName: 'heading'}
      ]
    });

    const {getByRole} = renderBackboneView(buildView(entry, [{id: 1}, {id: 2}]));

    expect(within(getByRole('tabpanel')).getAllByRole('listitem')).toHaveLength(1);
  });

  it('resets the selection when the back link is clicked', () => {
    const entry = createEntry({
      contentElements: [{id: 1, typeName: 'heading'}, {id: 2, typeName: 'heading'}]
    });
    const listener = jest.fn();
    entry.on('resetSelection', listener);

    const {getByText} = renderBackboneView(buildView(entry, [{id: 1}, {id: 2}]));
    fireEvent.click(getByText('Outline'));

    expect(listener).toHaveBeenCalled();
  });

  it('offers deleting the selected content elements', () => {
    const entry = createEntry({
      contentElements: [{id: 1, typeName: 'heading'}, {id: 2, typeName: 'heading'}]
    });
    entry.deleteContentElements = jest.fn();
    window.confirm = jest.fn().mockReturnValue(true);
    const items = [{id: 1}, {id: 2}];
    const view = buildView(entry, items);

    renderBackboneView(view);
    DropDownButton.findAll(view)[0].selectMenuItemByLabel('Delete elements');

    expect(entry.deleteContentElements).toHaveBeenCalledWith(items);
  });
});
