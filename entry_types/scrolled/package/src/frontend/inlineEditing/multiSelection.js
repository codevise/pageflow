// Selections of multiple items of the same type:
//
//     {
//       type: 'multiSelection',
//       itemType: 'contentElement',
//       items: [{id: 5}, {id: 6}]
//     }
//
// In selection mode, started from the editor, plain clicks extend the
// selection as well and it stays a multi selection down to one item:
//
//     {
//       type: 'multiSelection',
//       itemType: 'contentElement',
//       items: [{id: 5}],
//       selectionMode: true
//     }

const sectionSelectionTypes = ['section', 'sectionSettings'];

export function hasSelectionModifier(event) {
  return event.ctrlKey || event.metaKey;
}

export function watchSelectionModifier(window) {
  const root = window.document.documentElement;
  const events = ['keydown', 'keyup', 'mousemove'];

  function update(event) {
    root.toggleAttribute('data-selection-modifier', hasSelectionModifier(event));
  }

  function reset() {
    root.removeAttribute('data-selection-modifier');
  }

  events.forEach(name => window.addEventListener(name, update));
  window.addEventListener('blur', reset);

  return () => {
    events.forEach(name => window.removeEventListener(name, update));
    window.removeEventListener('blur', reset);
    reset();
  };
}

export function extendMultiSelection(selection, {type, id}) {
  // Do not dissolve a multi selection of content elements when a
  // modifier click lands on the section next to the elements.
  if (sectionSelectionTypes.includes(type) && isMultiSelectionOf(selection, 'contentElement')) {
    return selection;
  }

  selection = withSectionSelectionType(selection, type);

  if (isMultiSelectionOf(selection, type)) {
    return isInMultiSelection(selection, {type, id}) ?
           withoutItem(selection, id) :
           {...selection, items: [...selection.items, {id}]};
  }

  if (selection && selection.type === type) {
    return selection.id === id ?
           selection :
           {
             type: 'multiSelection',
             itemType: type,
             items: [{id: selection.id}, {id}]
           };
  }

  return {type, id};
}

export function isInSelectionMode(selection) {
  return !!selection && !!selection.selectionMode;
}

export function withoutSelectionMode({selectionMode, ...selection}) {
  if (selection.items.length > 1) {
    return selection;
  }

  return {type: selection.itemType, id: selection.items[0].id};
}

export function isInMultiSelection(selection, {type, id}) {
  return isMultiSelectionOf(selection, type) &&
         selection.items.some(item => item.id === id);
}

// The outline selects sections with type `section`, the preview with
// type `sectionSettings`. Without this, extending a selection started
// in one place from the other would drop the sections selected so far.
function withSectionSelectionType(selection, type) {
  if (!selection || !sectionSelectionTypes.includes(type)) {
    return selection;
  }

  if (selection.type === 'multiSelection' &&
      sectionSelectionTypes.includes(selection.itemType)) {
    return {...selection, itemType: type};
  }

  if (sectionSelectionTypes.includes(selection.type)) {
    return {...selection, type};
  }

  return selection;
}

function isMultiSelectionOf(selection, type) {
  return !!selection &&
         selection.type === 'multiSelection' &&
         selection.itemType === type;
}

function withoutItem(selection, id) {
  const items = selection.items.filter(item => item.id !== id);

  if (selection.selectionMode) {
    return items.length ? {...selection, items} : selection;
  }

  if (items.length > 1) {
    return {...selection, items};
  }

  return items.length ? {type: selection.itemType, id: items[0].id} : null;
}
