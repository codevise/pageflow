import {connect} from 'react-redux';
import {connectInPage} from 'pages';
import {isEntryReady} from 'entry/selectors';
import {pageIsPrepared} from 'pages/selectors';
import {file, prop} from 'selectors';
import {combineSelectors} from 'utils';

function PagePrintImage({page, isEntryReady}) {
  if (!isEntryReady) {
    return null;
  }
  if (page.backgroundType == 'video' || page.type == 'video') {
    return (
      <PrintVideoPoster videoId={page.videoFileId} posterImageId={page.posterImageId} />
    );
  }
  else {
    return (
      <PrintImage imageId={page.backgroundImageId} />
    );
  }
}

export default connect(combineSelectors({
  isEntryReady
}))(PagePrintImage);

const PrintVideoPoster = connect(combineSelectors({
  videoFile: file('videoFiles', {
    id: prop('videoId')
  }),
  posterImageFile: file('imageFiles', {
    id: prop('posterImageId')
  })
}))(function({videoFile, posterImageFile}) {
  if (posterImageFile) {
    return (
      <PrintImageTag file={posterImageFile} />
    );
  }
  else {
    return (
      <PrintImageTag file={videoFile} />
    );
  }
});

const PrintImage = connectInPage(combineSelectors({
  file: file('imageFiles', {
    id: prop('imageId')
  }),
  pageIsPrepared: pageIsPrepared()
}))(PrintImageTag);

function PrintImageTag({file}) {
  if (file && file.isReady && pageIsPrepared) {
    return (
      <img src={file.urls.print}
           alt={file.alt}
           className="print_image" />
    );
  }
  else {
    return <noscript />;
  }
}
