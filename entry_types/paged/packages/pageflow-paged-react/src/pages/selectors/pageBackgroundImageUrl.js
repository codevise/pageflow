import {memoizedSelector, camelize} from 'utils';
import {findThumbnailCandidate, thumbnailCandidateId} from '../thumbnailCandidates';

import {fileExists, file} from 'files/selectors';
import {pageType as pageTypeSelector} from 'pageTypes/selectors';

export default function pageBackgroundImageUrl({page: pageSelector, variant = 'medium'}) {
  return memoizedSelector(
    pageSelector,
    fileExists(),
    state => state,
    (page, fileExists, state) => {
      if (!page) {
        return undefined;
      }

      const pageType = pageTypeSelector({page})(state);
      const candidate = findThumbnailCandidate({
        candidates: pageType.thumbnailCandidates,
        page,
        fileExists
      });

      if (!candidate) {
        return undefined;
      }

      var fileSelector = file(camelize(candidate.collectionName), {
        id: thumbnailCandidateId(page, candidate)
      });

      if (candidate.collectionName == 'image_files') {
        return fileSelector(state).urls[variant];
      }
      else if (candidate.collectionName == 'video_files') {
        return fileSelector(state).urls[`poster_${variant}`];
      }
    }
  );
}
