import {Scaffold} from './Scaffold';

export const ChapterScaffold = Scaffold.extend({
  build: function() {
    this.chapter = this.parent.buildChapter(this.options.chapterAttributes);
    this.page = this.chapter.buildPage();

    return this.chapter;
  },

  load: function(response) {
    this.chapter.set(response.chapter);
    this.page.set(response.page);
  }
});