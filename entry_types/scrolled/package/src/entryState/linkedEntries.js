import {useEntryStateCollectionItem} from './EntryStateProvider';

export function useLinkedEntry(entryId) {
  return useEntryStateCollectionItem('linkedEntries', entryId);
}

export function useLinkedEntryUrl({entry: entryId, chapter, section}) {
  const linkedEntry = useLinkedEntry(entryId);

  if (!linkedEntry) {
    return undefined;
  }

  return withAnchor(linkedEntry.url, {
    chapterSlug: findLinkedChapter(linkedEntry, chapter)?.slug,
    section
  });
}

function findLinkedChapter(linkedEntry, chapterPermaId) {
  return chapterPermaId &&
         (linkedEntry.chapters || []).find(chapter => chapter.permaId === chapterPermaId);
}

function withAnchor(url, {chapterSlug, section}) {
  if (section) {
    return `${url}#section-${section}`;
  }
  else if (chapterSlug) {
    return `${url}#${chapterSlug}`;
  }

  return url;
}
