import {pageAttribute, pageAttributes} from 'pages/selectors';
import {chapterAttribute, chapterAttributes} from 'chapters/selectors';
import {storylineAttribute} from 'storylines/selectors';

export function currentParentChapterAttributes() {
  return function(state, props) {
    const parentPage = currentParentPageAttributes()(state, props);

    if (!parentPage) {
      return null;
    }

    return chapterAttributes({id: parentPage.chapterId})(state, props);
  };
}

export function currentParentPageAttributes() {
  return function(state, props) {
    const currentChapterId = pageAttribute('chapterId', {
      id: state.currentPageId
    })(state, props);

    const currentStorylineId = chapterAttribute('storylineId', {
      id: currentChapterId
    })(state, props);

    const currentParentPageId = storylineAttribute('parentPagePermaId', {
      id: currentStorylineId
    })(state, props);

    return pageAttributes({
      id: currentParentPageId
    })(state, props);
  };
}
