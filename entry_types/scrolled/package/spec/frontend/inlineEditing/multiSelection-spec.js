import {
  extendMultiSelection,
  isInMultiSelection,
  watchSelectionModifier
} from 'frontend/inlineEditing/multiSelection';

describe('extendMultiSelection', () => {
  it('selects content element when nothing is selected', () => {
    expect(extendMultiSelection(null, {type: 'contentElement', id: 5}))
      .toEqual({type: 'contentElement', id: 5});
  });

  it('keeps selection when extending the selected content element', () => {
    const selection = {type: 'contentElement', id: 5};

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 5}))
      .toBe(selection);
  });

  it('creates multi selection from selection of other content element', () => {
    const selection = {type: 'contentElement', id: 5};

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 6}))
      .toEqual({
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 5}, {id: 6}]
      });
  });

  it('drops range of selected content element when creating multi selection', () => {
    const selection = {type: 'contentElement', id: 5, range: [1, 3]};

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 6}))
      .toEqual({
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 5}, {id: 6}]
      });
  });

  it('appends item to multi selection', () => {
    const selection = {
      type: 'multiSelection',
      itemType: 'contentElement',
      items: [{id: 5}, {id: 6}]
    };

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 7}))
      .toEqual({
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 5}, {id: 6}, {id: 7}]
      });
  });

  it('removes item that is already part of multi selection', () => {
    const selection = {
      type: 'multiSelection',
      itemType: 'contentElement',
      items: [{id: 5}, {id: 6}, {id: 7}]
    };

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 6}))
      .toEqual({
        type: 'multiSelection',
        itemType: 'contentElement',
        items: [{id: 5}, {id: 7}]
      });
  });

  it('collapses multi selection when only one item remains', () => {
    const selection = {
      type: 'multiSelection',
      itemType: 'contentElement',
      items: [{id: 5}, {id: 6}]
    };

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 6}))
      .toEqual({type: 'contentElement', id: 5});
  });

  it('replaces selection of other type', () => {
    const selection = {type: 'sectionSettings', id: 3};

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 5}))
      .toEqual({type: 'contentElement', id: 5});
  });

  it('replaces multi selection of other item type', () => {
    const selection = {
      type: 'multiSelection',
      itemType: 'section',
      items: [{id: 3}, {id: 4}]
    };

    expect(extendMultiSelection(selection, {type: 'contentElement', id: 5}))
      .toEqual({type: 'contentElement', id: 5});
  });
});

describe('isInMultiSelection', () => {
  const selection = {
    type: 'multiSelection',
    itemType: 'contentElement',
    items: [{id: 5}, {id: 6}]
  };

  it('returns true for content element that is part of multi selection', () => {
    expect(isInMultiSelection(selection, {type: 'contentElement', id: 6})).toBe(true);
  });

  it('returns false for content element that is not part of multi selection', () => {
    expect(isInMultiSelection(selection, {type: 'contentElement', id: 7})).toBe(false);
  });

  it('returns false for other item type', () => {
    expect(isInMultiSelection(selection, {type: 'contentElementComments', id: 6}))
      .toBe(false);
  });

  it('returns false for single selection', () => {
    expect(isInMultiSelection({type: 'contentElement', id: 6},
                              {type: 'contentElement', id: 6}))
      .toBe(false);
  });

  it('returns false without selection', () => {
    expect(isInMultiSelection(null, {type: 'contentElement', id: 6})).toBe(false);
  });
});

describe('watchSelectionModifier', () => {
  let unwatch;

  afterEach(() => unwatch());

  function isFlagged() {
    return document.documentElement.hasAttribute('data-selection-modifier');
  }

  it('flags document while modifier key is held', () => {
    unwatch = watchSelectionModifier(window);

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Meta', metaKey: true}));

    expect(isFlagged()).toBe(true);
  });

  it('removes flag when modifier key is released', () => {
    unwatch = watchSelectionModifier(window);

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Control', ctrlKey: true}));
    window.dispatchEvent(new KeyboardEvent('keyup', {key: 'Control'}));

    expect(isFlagged()).toBe(false);
  });

  it('reads modifier state from mouse moves', () => {
    unwatch = watchSelectionModifier(window);

    window.dispatchEvent(new MouseEvent('mousemove', {ctrlKey: true}));

    expect(isFlagged()).toBe(true);
  });

  it('removes flag when window loses focus', () => {
    unwatch = watchSelectionModifier(window);

    window.dispatchEvent(new MouseEvent('mousemove', {metaKey: true}));
    window.dispatchEvent(new Event('blur'));

    expect(isFlagged()).toBe(false);
  });

  it('removes flag and stops watching when unwatched', () => {
    watchSelectionModifier(window)();
    unwatch = () => {};

    window.dispatchEvent(new MouseEvent('mousemove', {metaKey: true}));

    expect(isFlagged()).toBe(false);
  });
});
