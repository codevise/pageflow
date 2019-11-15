import PageThumbnail from './PageThumbnail';
import {connectInPage} from 'pages';
import {pageIsPreloaded} from 'pages/selectors';
import {combineSelectors} from 'utils';

export default connectInPage(combineSelectors({
  loaded: pageIsPreloaded(),
  lazy: true
}))(PageThumbnail);
