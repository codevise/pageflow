import {camelize} from 'utils';

export function findThumbnailCandidate({candidates, page, fileExists}) {
  return candidates.find(candidate => {
    if (candidate.condition && !conditionMet(candidate.condition, page)) {
      return false;
    }

    var id = thumbnailCandidateId(page, candidate);
    return fileExists(camelize(candidate.collectionName), id);
  });
}

function conditionMet(condition, page) {
  const value = page[camelize(condition.attribute)];

  if (condition.negated) {
    return value != condition.value;
  }
  else {
    return value == condition.value;
  }
}

export function thumbnailCandidateId(page, candidate) {
  return 'id' in candidate ? candidate.id : page[camelize(candidate.attribute)];
}
