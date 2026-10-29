import React, {useEffect} from 'react';

import {features} from 'pageflow/frontend';
import {frontend} from 'pageflow-scrolled/frontend';

import {editableTextValue} from 'support';
import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';
import {act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('inline editing content element multi selection', () => {
  useInlineEditingPageObjects();

  it('flags document while selection modifier is held', () => {
    renderEntry({
      seed: {
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      }
    });

    fireEvent.keyDown(window, {key: 'Control', ctrlKey: true});

    expect(document.documentElement).toHaveAttribute('data-selection-modifier');

    fireEvent.keyUp(window, {key: 'Control'});
  });

  it('marks both content elements as selected', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();
    getContentElementByTestId(6).select({ctrlKey: true});

    expect(getContentElementByTestId(5).isSelected()).toBe(true);
    expect(getContentElementByTestId(6).isSelected()).toBe(true);
  });

  it('removes content element from selection when added again', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();
    getContentElementByTestId(6).select({ctrlKey: true});
    getContentElementByTestId(6).select({ctrlKey: true});

    expect(getContentElementByTestId(5).isSelected()).toBe(true);
    expect(getContentElementByTestId(6).isSelected()).toBe(false);
  });

  it('replaces multi selection when content element is clicked without modifier', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();
    getContentElementByTestId(6).select({ctrlKey: true});
    getContentElementByTestId(6).select();

    expect(getContentElementByTestId(5).isSelected()).toBe(false);
    expect(getContentElementByTestId(6).isSelected()).toBe(true);
  });

  it('keeps multi selection when section is clicked with modifier', () => {
    const {getContentElementByTestId, getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [
          {sectionId: 1, typeName: 'withTestId', configuration: {testId: 5}},
          {sectionId: 1, typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();
    getContentElementByTestId(6).select({ctrlKey: true});

    fireEvent.mouseDown(getSectionByPermaId(10).el, {ctrlKey: true});

    expect(getContentElementByTestId(5).isSelected()).toBe(true);
    expect(getContentElementByTestId(6).isSelected()).toBe(true);
  });

  it('does not focus editable text when clicked with modifier', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {
            typeName: 'withEditableInlineText',
            configuration: {
              testId: 5,
              value: editableTextValue('Some heading', {type: 'heading'})
            }
          }
        ]
      }
    });

    const editableText = getContentElementByTestId(5).editableText();

    editableText.click('Some heading', {ctrlKey: true});

    expect(editableText.isFocused()).toBe(false);
  });

  it('blurs editable text when content element becomes part of multi selection', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {
            typeName: 'withEditableInlineText',
            configuration: {
              testId: 6,
              value: editableTextValue('Some heading', {type: 'heading'})
            }
          }
        ]
      }
    });
    const editableText = getContentElementByTestId(6).editableText();

    editableText.focus();
    getContentElementByTestId(5).select();
    editableText.click('Some heading', {ctrlKey: true});

    expect(editableText.isFocused()).toBe(false);
  });

  it('does not remount content element when it becomes part of multi selection', () => {
    const mounted = jest.fn();
    frontend.contentElementTypes.register('withMountCallback', {
      component: function WithMountCallback({configuration}) {
        useEffect(() => mounted(), []);
        return <div data-testid={`contentElement-${configuration.testId}`} />;
      }
    });

    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withMountCallback', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();
    getContentElementByTestId(6).select({ctrlKey: true});

    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it('does not render insert buttons and drag handle for multi selected content elements', () => {
    const {getContentElementByTestId, queryAllByTitle} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();

    expect(queryAllByTitle('Insert content element after').length).toBeGreaterThan(0);
    expect(queryAllByTitle('Drag to move').length).toBeGreaterThan(0);

    getContentElementByTestId(6).select({ctrlKey: true});

    expect(queryAllByTitle('Insert content element after')).toHaveLength(0);
    expect(queryAllByTitle('Drag to move')).toHaveLength(0);
  });

  it('does not render comment badges for multi selected content elements', () => {
    features.enable('frontend', ['commenting']);

    const {getContentElementByTestId, queryAllByRole} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      }
    });

    getContentElementByTestId(5).select();

    expect(queryAllByRole('status').length).toBeGreaterThan(0);

    getContentElementByTestId(6).select({ctrlKey: true});

    expect(queryAllByRole('status')).toHaveLength(0);
  });

  describe('selection mode', () => {
    function startSelectionMode(items) {
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            type: 'SELECT',
            payload: {
              type: 'multiSelection',
              itemType: 'contentElement',
              items,
              selectionMode: true
            }
          },
          origin: window.location.origin
        }));
      });
    }

    function renderEntryWithTwoContentElements() {
      return renderEntry({
        seed: {
          sections: [{id: 1, permaId: 10}],
          contentElements: [
            {id: 1, sectionId: 1, typeName: 'withTestId', configuration: {testId: 5}},
            {id: 2, sectionId: 1, typeName: 'withTestId', configuration: {testId: 6}}
          ]
        }
      });
    }

    it('adds content element to selection on plain click', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(true);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('removes content element from selection on plain click', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}, {id: 2}]);
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(true);
      expect(getContentElementByTestId(6).isSelected()).toBe(false);
    });

    it('stays in selection mode when only one content element is left', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}, {id: 2}]);
      getContentElementByTestId(6).select();
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(true);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('keeps last content element selected when it is clicked again', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);
      getContentElementByTestId(5).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(true);
    });

    it('ends selection mode on escape', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);
      fireEvent.keyDown(window, {key: 'Escape'});
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(false);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('keeps selection when selection mode ends', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}, {id: 2}]);
      fireEvent.keyDown(window, {key: 'Escape'});

      expect(getContentElementByTestId(5).isSelected()).toBe(true);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('ends selection mode when editor requests it', () => {
      const {getContentElementByTestId} = renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {type: 'END_SELECTION_MODE'},
          origin: window.location.origin
        }));
      });
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(false);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('ends selection mode when section is clicked', () => {
      const {getContentElementByTestId, getSectionByPermaId} =
        renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);
      fireEvent.mouseDown(getSectionByPermaId(10).el);
      getContentElementByTestId(6).select();

      expect(getContentElementByTestId(5).isSelected()).toBe(false);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });

    it('flags document while in selection mode', () => {
      renderEntryWithTwoContentElements();

      startSelectionMode([{id: 1}]);

      expect(document.documentElement).toHaveAttribute('data-selection-mode');

      fireEvent.keyDown(window, {key: 'Escape'});

      expect(document.documentElement).not.toHaveAttribute('data-selection-mode');
    });

    it('does not focus editable text when clicked in selection mode', () => {
      const {getContentElementByTestId} = renderEntry({
        seed: {
          contentElements: [
            {id: 1, typeName: 'withTestId', configuration: {testId: 5}},
            {
              id: 2,
              typeName: 'withEditableInlineText',
              configuration: {
                testId: 6,
                value: editableTextValue('Some heading', {type: 'heading'})
              }
            }
          ]
        }
      });
      const editableText = getContentElementByTestId(6).editableText();

      startSelectionMode([{id: 1}]);
      editableText.click('Some heading');

      expect(editableText.isFocused()).toBe(false);
      expect(getContentElementByTestId(6).isSelected()).toBe(true);
    });
  });
});
