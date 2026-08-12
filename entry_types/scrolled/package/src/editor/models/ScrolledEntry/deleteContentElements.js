import {Batch} from './Batch';

export function deleteContentElements(entry, items) {
  groupBySection(entry, items).forEach(({section, selected}) =>
    deleteFromSection(entry, section, selected)
  );
}

function groupBySection(entry, items) {
  const groups = new Map();

  items.forEach(({id}) => {
    const contentElement = entry.contentElements.get(id);

    if (!contentElement || !contentElement.section) {
      return;
    }

    if (!groups.has(contentElement.section)) {
      groups.set(contentElement.section, {
        section: contentElement.section,
        selected: new Set()
      });
    }

    groups.get(contentElement.section).selected.add(contentElement);
  });

  return [...groups.values()].sort(
    (a, b) => entry.sections.indexOf(a.section) - entry.sections.indexOf(b.section)
  );
}

function deleteFromSection(entry, section, selected) {
  const batch = new Batch(entry, section, {reviewSession: entry.reviewSession});

  let previous = null;
  let gap = false;

  section.contentElements.forEach(contentElement => {
    if (selected.has(contentElement)) {
      batch.remove(contentElement);
      batch.markForDeletion(contentElement, {trash: true});
      gap = true;
    }
    else {
      previous = previous && gap ?
                 batch.maybeMerge(previous, contentElement) || contentElement :
                 contentElement;
      gap = false;
    }
  });

  batch.save({
    success() {
      entry.markUnseenTrashItems();
    }
  });
}
