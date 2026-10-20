import {slugify} from './slugify';

export function getChapterSlugs(chapters) {
  const result = {};
  const usedSlugs = {};

  chapters.forEach(chapter => {
    let chapterSlug = chapter.configuration.title && slugify(chapter.configuration.title);

    if (chapterSlug) {
      if (usedSlugs[chapterSlug]) {
        chapterSlug = chapterSlug + '-' + chapter.permaId;
      }

      usedSlugs[chapterSlug] = true;
    }
    else {
      chapterSlug = 'chapter-' + chapter.permaId;
    }

    result[chapter.permaId] = chapterSlug;
  });

  return result;
}
