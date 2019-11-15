export const StorylineTransitiveChildPages = function(storyline, storylines, pages) {
  var isTranstiveChildStoryline;

  this.contain = function(page) {
    if (!isTranstiveChildStoryline) {
      search();
    }

    return !!isTranstiveChildStoryline[page.chapter.storyline.id];
  };

  function search() {
    isTranstiveChildStoryline = storylines.reduce(function(memo, other) {
      var current = other;

      while (current) {
        if (current === storyline || memo[current.id]) {
          memo[other.id] = true;
          return memo;
        }

        current = parentStoryline(current);
      }

      return memo;
    }, {});
  }

  function parentStoryline(storyline) {
    var parentPage = pages.getByPermaId(storyline.parentPagePermaId());
    return parentPage && parentPage.chapter && parentPage.chapter.storyline;
  }
};