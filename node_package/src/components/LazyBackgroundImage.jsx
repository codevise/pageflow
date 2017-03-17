import BackgroundImage from './BackgroundImage';

import {connectInPage} from 'pages';
import {pageIsPreloaded} from 'pages/selectors';
import {combineSelectors} from 'utils';

export default connectInPage(combineSelectors({
  loaded: pageIsPreloaded()
}))(BackgroundImage);
