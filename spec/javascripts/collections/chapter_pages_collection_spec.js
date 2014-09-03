describe('ChapterPagesCollection', function() {
  var Chapter = pageflow.Chapter;
  var PagesCollection = pageflow.PagesCollection;
  var Page = pageflow.Page;

  it('filters pages by chapter', function() {
    var pages = new PagesCollection([
      new Page({chapter_id: 1}),
      new Page({chapter_id: 2})
    ]);
    var chapter = new Chapter({id: 1}, {pages: pages});

    expect(chapter.pages.models).to.eql([pages.first()]);
  });

  it('sets reference back to chapter on create', function() {
    var pages = new PagesCollection([
      new Page({chapter_id: 1})
    ]);
    var chapter = new Chapter({id: 1}, {pages: pages});

    expect(chapter.pages.first().chapter).to.eq(chapter);
  });

  it('sets reference back to chapter on add', function() {
    var pages = new PagesCollection([]);
    var page = new Page({chapter_id: 1});
    var chapter = new Chapter({id: 1}, {pages: pages});

    chapter.pages.add(page);

    expect(chapter.pages.first().chapter).to.eq(chapter);
  });
});