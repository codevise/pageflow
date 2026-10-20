import {useEntryStateCollectionItem} from './EntryStateProvider';

export function useLinkedEntry(entryId) {
  return useEntryStateCollectionItem('linkedEntries', entryId);
}

export function useLinkedEntryUrl(href) {
  return useLinkedEntryDestination(href)?.url;
}

export function useLinkedEntryDestination({entry: entryId, chapter: chapterPermaId, section}) {
  const linkedEntry = useLinkedEntry(entryId);

  if (!linkedEntry) {
    return undefined;
  }

  const chapter = findLinkedChapter(linkedEntry, chapterPermaId);

  return {
    linkedEntry,
    chapter,
    section: !!section,
    url: withAnchor(linkedEntry.url, {
      chapterSlug: chapter?.slug,
      section
    }),
    previewUrl: linkedEntry.previewUrl && withAnchor(linkedEntry.previewUrl, {
      chapterSlug: chapter?.previewSlug,
      section
    })
  };
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
