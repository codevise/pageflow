import {getChapterSlugs} from 'shared/chapterSlug';

describe('getChapterSlugs', () => {
  it('returns slugified title', () => {
    const chapters = [
      {configuration: {title: 'My Chapter'}, permaId: 100}
    ];

    expect(getChapterSlugs(chapters)[100]).toBe('my-chapter');
  });

  it('returns chapter-permaId for empty title', () => {
    const chapters = [
      {configuration: {title: ''}, permaId: 100}
    ];

    expect(getChapterSlugs(chapters)[100]).toBe('chapter-100');
  });

  it('returns chapter-permaId for missing title', () => {
    const chapters = [
      {configuration: {}, permaId: 100}
    ];

    expect(getChapterSlugs(chapters)[100]).toBe('chapter-100');
  });

  it('appends permaId if slug would not be unique', () => {
    const chapters = [
      {configuration: {title: 'Same Title'}, permaId: 100},
      {configuration: {title: 'Same Title'}, permaId: 200}
    ];

    const slugs = getChapterSlugs(chapters);

    expect(slugs[100]).toBe('same-title');
    expect(slugs[200]).toBe('same-title-200');
  });

  it('handles special characters', () => {
    const chapters = [
      {configuration: {title: 'Über uns & mehr!'}, permaId: 100}
    ];

    expect(getChapterSlugs(chapters)[100]).toBe('ueber-uns-and-mehr');
  });
});
