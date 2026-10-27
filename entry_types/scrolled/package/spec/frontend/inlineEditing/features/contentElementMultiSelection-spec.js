import React, {useEffect} from 'react';

import {features} from 'pageflow/frontend';
import {frontend} from 'pageflow-scrolled/frontend';

import {editableTextValue} from 'support';
import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';
import {fireEvent} from '@testing-library/react';
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
});
