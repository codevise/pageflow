import classNames from 'classnames';

import {connectInPage} from 'pages';
import {pageType} from 'pageTypes/selectors';
import {fileExists} from 'files/selectors';

import {findThumbnailCandidate, thumbnailCandidateId} from 'pages/thumbnailCandidates';
import {combineSelectors} from 'utils';

export function PageThumbnail(props) {
  return (
    <div className={className(props)} />
  );
}

PageThumbnail.defaultProps = {
  imageStyle: 'navigation_thumbnail_large'
};

function className(props) {
  return classNames(
    {load_image: props.lazy && props.loaded},
    props.className,
    typeClassName(props.pageType),
    thumbnailClassName(props)
  );
}

function typeClassName(pageType) {
  return pageType ? `is_${pageType.name}` : 'is_dangling';
}

function thumbnailClassName(props) {
  var candidate = findThumbnailCandidate({
    candidates: thumbnailCandidates(props),
    page: props.page,
    fileExists: props.fileExists
  });

  if (candidate) {
    return thumbnailCandidateClassName(props, candidate);
  }
}

function thumbnailCandidates(props) {
  return [
    customThumbnailCandidate(props),
    ...pageTypeCandidates(props.pageType)
  ];
}

function customThumbnailCandidate(props) {
  return {
    id: props.customThumbnailId,
    cssClassPrefix: 'pageflow_image_file',
    collectionName: 'image_files'
  };
}

function pageTypeCandidates(pageType) {
  return pageType ? pageType.thumbnailCandidates : [];
}

function thumbnailCandidateClassName(props, candidate) {
  return [
    props.lazy ? 'lazy' : null,
    candidate.cssClassPrefix,
    props.imageStyle,
    thumbnailCandidateId(props.page, candidate)
  ].filter(Boolean).join('_');
}

export default connectInPage(combineSelectors({
  pageType: pageType({page: props => props.page}),
  fileExists: fileExists()
}))(PageThumbnail);
