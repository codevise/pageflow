import _ from 'underscore';

export const StorylineOrdering = function(storylines, pages) {
  var storylinesByParent;

  this.watch = function() {
    storylines.on('add change:configuration', function() {
      this.sort();
    }, this);

    pages.on('change:position change:chapter_id', function() {
      this.sort();
    }, this);
  };

  this.sort = function(options) {
    prepare();
    visit(storylinesWithoutParent(), 1, 0);

    storylines.sort(options);
  };

  function visit(storylines, offset, level) {
    return _(storylines).reduce(function(position, storyline, index) {
      storyline.set('position', position);
      storyline.set('level', level);

      return visit(children(storyline), position + 1, level + 1);
    }, offset);
  }

  function storylinesWithoutParent() {
    return storylinesByParent[-1];
  }

  function children(storyline) {
    return storylinesByParent[storyline.cid] || [];
  }

  function prepare() {
    storylinesByParent = _(groupStorylinesByParentStoryline())
      .reduce(function(result, storylines, key) {
        result[key] = storylines.sort(compareStorylines);
        return result;
      }, {});
  }

  function groupStorylinesByParentStoryline() {
    return storylines
      .groupBy(function(storyline) {
        var parentPage = getParentPage(storyline);
        return parentPage && parentPage.chapter ? parentPage.chapter.storyline.cid : -1;
      });
  }

  function compareStorylines(storylineA, storylineB) {
    return compareByMainFlag(storylineA, storylineB) ||
      compareByParentPagePosition(storylineA, storylineB) ||
      compareByLane(storylineA, storylineB) ||
      compareByRow(storylineA, storylineB) ||
      compareByTitle(storylineA, storylineB);
  }

  function compareByMainFlag(storylineA, storylineB) {
    return compare(
      storylineA.isMain() ? -1 : 1,
      storylineB.isMain() ? -1 : 1
    );
  }

  function compareByParentPagePosition(storylineA, storylineB) {
    return compare(
      getParentPagePosition(storylineA),
      getParentPagePosition(storylineB)
    );
  }

  function compareByLane(storylineA, storylineB) {
    return compare(
      storylineA.lane(),
      storylineB.lane()
    );
  }

  function compareByRow(storylineA, storylineB) {
    return compare(
      storylineA.row(),
      storylineB.row()
    );
  }

  function compareByTitle(storylineA, storylineB) {
    return compare(
      storylineA.title(),
      storylineB.title()
    );
  }

  function compare(a, b) {
    if (a > b) {
      return 1;
    }
    else if (a < b) {
      return -1;
    }
    else {
      return 0;
    }
  }

  function getParentPagePosition(storyline) {
    var parentPage = getParentPage(storyline);
    return parentPage && parentPage.get('position');
  }

  function getParentPage(storyline) {
    return pages.getByPermaId(storyline.parentPagePermaId());
  }
};
