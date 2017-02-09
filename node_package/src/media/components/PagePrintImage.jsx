import {connect} from 'react-redux';
import {connectInPage} from 'pages';
import {pageIsPrepared} from 'pages/selectors';
import {file, prop} from 'selectors';
import {combine} from 'utils';

export default function PagePrintImage({page}) {
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

const PrintVideoPoster = connect(combine({
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

const PrintImage = connectInPage(combine({
  file: file('imageFiles', {
    id: prop('imageId')
  }),
  pageIsPrepared: pageIsPrepared()
}))(PrintImageTag);

function PrintImageTag({file}) {
  if (file && pageIsPrepared) {
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
