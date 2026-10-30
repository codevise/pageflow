import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';
import {useFakeFeatures} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('inline editing section multi selection', () => {
  useInlineEditingPageObjects();
  useFakeFeatures('frontend', ['fragments']);

  function renderEntryWithThreeSections() {
    return renderEntry({
      seed: {
        sections: [
          {id: 1, permaId: 10},
          {id: 2, permaId: 20},
          {id: 3, permaId: 30}
        ]
      }
    });
  }

  function lastSelectedPayload() {
    return window.parent.postMessage.mock.calls
      .map(([message]) => message)
      .filter(message => message.type === 'SELECTED')
      .pop()
      .payload;
  }

  it('selects multiple sections when section is clicked with modifier', () => {
    const {getSectionByPermaId} = renderEntryWithThreeSections();

    getSectionByPermaId(10).select();
    getSectionByPermaId(20).select({ctrlKey: true});

    expect(lastSelectedPayload()).toEqual({
      type: 'multiSelection',
      itemType: 'sectionSettings',
      items: [{id: 1}, {id: 2}]
    });
  });

  it('marks multi selected sections as selected', () => {
    const {getSectionByPermaId} = renderEntryWithThreeSections();

    getSectionByPermaId(10).select();
    getSectionByPermaId(20).select({ctrlKey: true});

    expect(getSectionByPermaId(10).isSelected()).toBe(true);
    expect(getSectionByPermaId(20).isSelected()).toBe(true);
    expect(getSectionByPermaId(30).isSelected()).toBe(false);
  });

  it('reverts to selection of section settings when reduced to one section', () => {
    const {getSectionByPermaId} = renderEntryWithThreeSections();

    getSectionByPermaId(10).select();
    getSectionByPermaId(20).select({ctrlKey: true});
    getSectionByPermaId(20).select({ctrlKey: true});

    expect(lastSelectedPayload()).toEqual({type: 'sectionSettings', id: 1});
  });

  it('carries over section selected by editor', () => {
    const {getSectionByPermaId, simulateSelectMessage} = renderEntryWithThreeSections();

    simulateSelectMessage({type: 'section', id: 1});
    getSectionByPermaId(20).select({ctrlKey: true});

    expect(lastSelectedPayload()).toEqual({
      type: 'multiSelection',
      itemType: 'sectionSettings',
      items: [{id: 1}, {id: 2}]
    });
  });

  it('carries over multiple sections selected by editor', () => {
    const {getSectionByPermaId, simulateSelectMessage} = renderEntryWithThreeSections();

    simulateSelectMessage({
      type: 'multiSelection',
      itemType: 'section',
      items: [{id: 1}, {id: 2}]
    });
    getSectionByPermaId(30).select({ctrlKey: true});

    expect(lastSelectedPayload()).toEqual({
      type: 'multiSelection',
      itemType: 'sectionSettings',
      items: [{id: 1}, {id: 2}, {id: 3}]
    });
  });

  it('marks sections of multi selection by editor as selected', () => {
    const {getSectionByPermaId, simulateSelectMessage} = renderEntryWithThreeSections();

    simulateSelectMessage({
      type: 'multiSelection',
      itemType: 'section',
      items: [{id: 1}]
    });

    expect(getSectionByPermaId(10).isSelected()).toBe(true);
    expect(getSectionByPermaId(20).isSelected()).toBe(false);
  });

  it('ends multi selection when section is clicked without modifier', () => {
    const {getSectionByPermaId} = renderEntryWithThreeSections();

    getSectionByPermaId(10).select();
    getSectionByPermaId(20).select({ctrlKey: true});
    getSectionByPermaId(30).select();

    expect(lastSelectedPayload()).toEqual({type: 'sectionSettings', id: 3});
  });

  it('resets selection when only section of multi selection by editor is clicked with modifier', () => {
    const {getSectionByPermaId, simulateSelectMessage} = renderEntryWithThreeSections();

    simulateSelectMessage({
      type: 'multiSelection',
      itemType: 'section',
      items: [{id: 1}]
    });
    getSectionByPermaId(10).select({ctrlKey: true});

    expect(lastSelectedPayload()).toEqual({});
  });
});

describe('inline editing section multi selection without fragments feature', () => {
  useInlineEditingPageObjects();

  it('ignores sections clicked with modifier', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {sections: [{id: 1, permaId: 10}, {id: 2, permaId: 20}]}
    });

    getSectionByPermaId(10).select();
    getSectionByPermaId(20).select({ctrlKey: true});

    expect(getSectionByPermaId(10).isSelected()).toBe(true);
    expect(getSectionByPermaId(20).isSelected()).toBe(false);
  });
});
