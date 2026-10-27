// Selections of multiple items of the same type:
//
//     {
//       type: 'multiSelection',
//       itemType: 'contentElement',
//       items: [{id: 5}, {id: 6}]
//     }

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

export function isInMultiSelection(selection, {type, id}) {
  return isMultiSelectionOf(selection, type) &&
         selection.items.some(item => item.id === id);
}

function isMultiSelectionOf(selection, type) {
  return !!selection &&
         selection.type === 'multiSelection' &&
         selection.itemType === type;
}

function withoutItem(selection, id) {
  const items = selection.items.filter(item => item.id !== id);

  if (items.length > 1) {
    return {...selection, items};
  }

  return {type: selection.itemType, id: items[0].id};
}
