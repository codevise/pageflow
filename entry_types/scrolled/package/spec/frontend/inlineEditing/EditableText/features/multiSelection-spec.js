import {useFakeTranslations} from 'pageflow/testHelpers';
import {editableTextValue} from 'support';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import styles from 'frontend/inlineEditing/EditableText/index.module.css';

import {fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText multi selection', () => {
  useInlineEditingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.inline_editing.formats.paragraph': 'Paragraph'
  });

  const value = editableTextValue(['First paragraph', 'Second paragraph', 'Third paragraph']);

  it('adds text block as a whole to multi selection', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });
    const editableText = entry.getContentElementByTestId('textBlock').editableText();

    entry.getContentElementByTestId('sibling').select();
    editableText.click('Second paragraph', {ctrlKey: true});

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 1}, {id: 2}]
      }
    }, expect.anything());
  });

  it('removes text block from selection when adding it again', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });
    const editableText = entry.getContentElementByTestId('textBlock').editableText();

    entry.getContentElementByTestId('sibling').select();
    editableText.click('Second paragraph', {ctrlKey: true});
    window.parent.postMessage.mockClear();
    editableText.click('Second paragraph', {ctrlKey: true});

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {type: 'contentElement', id: 1}
    }, expect.anything());
  });

  it('drops range of selected text block when turning into multi selection', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });

    entry.simulateSelectMessage({type: 'contentElement', id: 2, range: [2, 3]});
    entry.getContentElementByTestId('sibling').select({ctrlKey: true});

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 2}, {id: 1}]
      }
    }, expect.anything());
  });

  it('blurs text block when it becomes part of multi selection', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });
    const editableText = entry.getContentElementByTestId('textBlock').editableText();

    entry.simulateSelectMessage({type: 'contentElement', id: 2, range: [2, 3]});

    expect(editableText.isFocused()).toBe(true);

    entry.getContentElementByTestId('sibling').select({ctrlKey: true});

    expect(editableText.isFocused()).toBe(false);
  });

  it('focuses text block when multi selection collapses to it', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });
    const editableText = entry.getContentElementByTestId('textBlock').editableText();

    entry.getContentElementByTestId('sibling').select();
    editableText.click('Second paragraph', {ctrlKey: true});
    entry.getContentElementByTestId('sibling').select({ctrlKey: true});

    expect(editableText.isFocused()).toBe(true);
  });

  it('replaces multi selection when clicking into text block without modifier', async () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withTestId', configuration: {testId: 'sibling'}},
          {id: 2, typeName: 'withEditableText', configuration: {testId: 'textBlock', value}}
        ]
      }
    });
    const editableText = entry.getContentElementByTestId('textBlock').editableText();

    entry.getContentElementByTestId('sibling').select();
    editableText.click('Second paragraph', {ctrlKey: true});
    window.parent.postMessage.mockClear();
    editableText.click('Third paragraph');

    await waitFor(() => expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {type: 'contentElement', id: 2}
    }, expect.anything()));
  });

  it('updates selection rect on resize while part of multi selection', () => {
    let textHeight = 100;
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => ({top: 0, bottom: textHeight, left: 0, right: 0}));

    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withEditableText', configuration: {value}}
        ]
      }
    });

    entry.simulateSelectMessage({
      type: 'multiSelection',
      itemType: 'contentElement',
      items: [{id: 1}]
    });
    textHeight = 200;
    fireEvent(window, new Event('resize'));

    expect(selectionRectHeight(entry)).toBe('200px');
  });

  it('does not render toolbar and insert buttons while part of multi selection', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [
          {id: 1, typeName: 'withEditableText', configuration: {value}}
        ]
      }
    });

    expect(entry.queryByTitle('Paragraph')).not.toBeNull();
    expect(entry.queryAllByTitle('Insert content element after').length).toBeGreaterThan(0);

    entry.simulateSelectMessage({
      type: 'multiSelection',
      itemType: 'contentElement',
      items: [{id: 1}]
    });

    expect(entry.queryByTitle('Paragraph')).toBeNull();
    expect(entry.queryAllByTitle('Insert content element after')).toHaveLength(0);
  });

  function selectionRectHeight({container}) {
    const selection = container.querySelector(`.${styles.selection}`);

    return [...selection.querySelectorAll('div')]
      .map(div => div.style.height)
      .find(Boolean);
  }
});
